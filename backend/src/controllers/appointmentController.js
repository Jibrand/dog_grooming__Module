import { validationResult } from 'express-validator';
import { format, isBefore, startOfDay, parseISO } from 'date-fns';
import { formatInTimeZone, toDate } from 'date-fns-tz';
import prisma from '../config/db.js';
import { createEvent, updateEvent, cancelEvent } from '../services/googleCalendarService.js';
import { formatResponse } from '../utils/responseHelper.js';

const TIMEZONE = 'Asia/Karachi';

const getFirstName = (fullName) => {
  if (!fullName) return '';
  return fullName.split(' ')[0];
};

const isDateInPast = (dateStr) => {
  const today = toDate(new Date(), { timeZone: TIMEZONE });
  const targetDate = toDate(`${dateStr}T00:00:00`, { timeZone: TIMEZONE });
  return isBefore(targetDate, startOfDay(today));
};

const formatSpeakableDate = (dateStr) => {
  const date = toDate(`${dateStr}T00:00:00`, { timeZone: TIMEZONE });
  return format(date, 'EEEE, MMMM do');
};

const formatSpeakableTime = (timeStr) => {
  const [hour, minute] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hour, 10));
  date.setMinutes(parseInt(minute, 10));
  return format(date, 'h:mm a');
};

export const bookAppointment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msg = errors.array().map(e => e.msg).join('. ');
      return res.status(400).json(formatResponse(
        false,
        `I'm missing some information to complete the booking. ${msg}`,
        null,
        'VALIDATION_ERROR'
      ));
    }

    let { userName, userEmail, userPhone, petName, species, reason, appointmentDate, appointmentTime, subdomain } = req.body;
    const firstName = getFirstName(userName);

    if (!subdomain || subdomain === 'localhost' || subdomain === '127.0.0.1') {
      subdomain = 'cliniclocal';
    }

    let clinic = await prisma.clinic.findUnique({ where: { subdomain } });
    if (!clinic) {
      clinic = await prisma.clinic.create({
        data: {
          name: `${subdomain} Clinic`,
          subdomain
        }
      });
    }

    if (isDateInPast(appointmentDate)) {
      return res.status(400).json(formatResponse(
        false,
        "I'm sorry, I can only book appointments for future dates. What date works for you?",
        null,
        "PAST_DATE_NOT_ALLOWED"
      ));
    }

    // Check if slot is taken
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        clinicId: clinic.id,
        appointmentDate,
        appointmentTime,
        status: {
          in: ['SCHEDULED', 'CONFIRMED']
        }
      }
    });

    if (existingAppointment) {
      return res.status(400).json(formatResponse(
        false,
        "I'm sorry, that time slot is already taken. Could you choose a different time?",
        null,
        "SLOT_ALREADY_BOOKED"
      ));
    }

    // Find or Create User (Lead)
    let user = await prisma.user.findFirst({
      where: { phone: userPhone, clinicId: clinic.id }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clinicId: clinic.id,
          name: userName,
          email: userEmail || null,
          phone: userPhone
        }
      });
    } else {
      // Optionally update name/email if they provided new ones
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: userName,
          email: userEmail || user.email
        }
      });
    }

    const tempAppointment = {
      reason,
      appointmentDate,
      appointmentTime
    };

    let googleEventId = null;
    let googleMeetLink = null;
    let syncFailed = false;

    try {
      const gcalData = await createEvent(tempAppointment, user);
      googleEventId = gcalData.googleEventId;
      googleMeetLink = gcalData.googleMeetLink;
    } catch (error) {
      console.error('Calendar sync error during booking:', error);
      syncFailed = true;
    }

    const appointment = await prisma.appointment.create({
      data: {
        clinicId: clinic.id,
        userId: user.id,
        petName,
        species,
        reason,
        appointmentDate,
        appointmentTime,
        status: 'SCHEDULED',
        googleEventId,
        googleMeetLink
      },
      include: {
        user: true
      }
    });

    const speakableDate = formatSpeakableDate(appointmentDate);
    const speakableTime = formatSpeakableTime(appointmentTime);

    if (syncFailed) {
      return res.status(201).json(formatResponse(
        true,
        `Your appointment is booked! We had a small issue syncing with our calendar, but our team will sort it out. You're confirmed for ${speakableDate} at ${speakableTime}.`,
        appointment
      ));
    }

    return res.status(201).json(formatResponse(
      true,
      `You're all set, ${firstName}! Your appointment is booked for ${speakableDate} at ${speakableTime}. We look forward to seeing you at Paws & Bubbles Dog Grooming Salon!`,
      appointment
    ));
  } catch (error) {
    next(error);
  }
};

export const lookupAppointment = async (req, res, next) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json(formatResponse(
        false,
        "I need a phone number to look up your appointments.",
        null,
        "VALIDATION_ERROR"
      ));
    }

    const user = await prisma.user.findUnique({
      where: { phone }
    });

    if (!user) {
       return res.status(200).json(formatResponse(
        true,
        "I don't see a profile linked to that phone number. Are you a new patient looking to book an appointment?",
        []
      ));
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: user.id,
        status: {
          in: ['SCHEDULED', 'CONFIRMED']
        }
      },
      orderBy: [
        { appointmentDate: 'asc' },
        { appointmentTime: 'asc' }
      ],
      include: {
        user: true
      }
    });

    const firstName = user.name ? user.name.split(' ')[0] : 'there';

    if (appointments.length === 0) {
      return res.status(200).json(formatResponse(
        true,
        `Welcome back, ${firstName}! I don't see any upcoming appointments for you right now. Would you like to schedule one?`,
        []
      ));
    }

    const nextAppt = appointments[0];
    const speakableDate = formatSpeakableDate(nextAppt.appointmentDate);
    const speakableTime = formatSpeakableTime(nextAppt.appointmentTime);

    return res.status(200).json(formatResponse(
      true,
      `Welcome back, ${firstName}! I found ${appointments.length} upcoming appointment(s) for you. Your next appointment is on ${speakableDate} at ${speakableTime}.`,
      appointments
    ));
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await prisma.appointment.findUnique({ 
      where: { id },
      include: { user: true }
    });

    if (!appointment) {
      return res.status(404).json(formatResponse(
        false,
        "I couldn't find that appointment in our system. Could you double-check the details?",
        null,
        "APPOINTMENT_NOT_FOUND"
      ));
    }

    if (appointment.status === 'CANCELLED') {
      return res.status(400).json(formatResponse(
        false,
        "It looks like this appointment has already been cancelled. Is there anything else I can help you with?",
        null,
        "APPOINTMENT_ALREADY_CANCELLED"
      ));
    }

    if (appointment.googleEventId) {
      try {
        await cancelEvent(appointment.googleEventId);
      } catch (error) {
        console.error('Failed to cancel Google Calendar event:', error);
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason || null
      },
      include: { user: true }
    });

    const speakableDate = formatSpeakableDate(updatedAppointment.appointmentDate);
    const speakableTime = formatSpeakableTime(updatedAppointment.appointmentTime);

    return res.status(200).json(formatResponse(
      true,
      `Done! Your appointment on ${speakableDate} at ${speakableTime} has been cancelled. We hope to see you again soon. Just give us a call whenever you're ready to rebook!`,
      updatedAppointment
    ));
  } catch (error) {
    next(error);
  }
};

export const rescheduleAppointment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msg = errors.array().map(e => e.msg).join('. ');
      return res.status(400).json(formatResponse(
        false,
        `I'm missing some information to complete the rescheduling. ${msg}`,
        null,
        'VALIDATION_ERROR'
      ));
    }

    const { id } = req.params;
    const { newDate, newTime } = req.body;

    const appointment = await prisma.appointment.findUnique({ 
      where: { id },
      include: { user: true }
    });

    if (!appointment) {
      return res.status(404).json(formatResponse(
        false,
        "I couldn't find that appointment in our system. Could you double-check the details?",
        null,
        "APPOINTMENT_NOT_FOUND"
      ));
    }

    if (isDateInPast(newDate)) {
      return res.status(400).json(formatResponse(
        false,
        "I can only reschedule to a future date. What date would you prefer?",
        null,
        "PAST_DATE_NOT_ALLOWED"
      ));
    }

    // Check if new slot is taken
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        appointmentDate: newDate,
        appointmentTime: newTime,
        status: {
          in: ['SCHEDULED', 'CONFIRMED']
        },
        id: {
          not: id // Exclude current appointment
        }
      }
    });

    if (existingAppointment) {
      return res.status(400).json(formatResponse(
        false,
        "I'm sorry, that new time slot is also taken. Could you suggest another time that works for you?",
        null,
        "SLOT_ALREADY_BOOKED"
      ));
    }

    if (appointment.googleEventId) {
      try {
        await updateEvent(appointment.googleEventId, newDate, newTime);
      } catch (error) {
        console.error('Failed to update Google Calendar event:', error);
      }
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        appointmentDate: newDate,
        appointmentTime: newTime
      },
      include: { user: true }
    });

    const firstName = getFirstName(updatedAppointment.user.name);
    const speakableDate = formatSpeakableDate(newDate);
    const speakableTime = formatSpeakableTime(newTime);

    return res.status(200).json(formatResponse(
      true,
      `Great news, ${firstName}! Your appointment has been moved to ${speakableDate} at ${speakableTime}. See you then!`,
      updatedAppointment
    ));
  } catch (error) {
    next(error);
  }
};

export const getAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({ 
      where: { id },
      include: { user: true }
    });

    if (!appointment) {
      return res.status(404).json(formatResponse(
        false,
        "I couldn't find an appointment with that ID.",
        null,
        "APPOINTMENT_NOT_FOUND"
      ));
    }

    const speakableDate = formatSpeakableDate(appointment.appointmentDate);
    const speakableTime = formatSpeakableTime(appointment.appointmentTime);

    return res.status(200).json(formatResponse(
      true,
      `Here are your appointment details: ${appointment.reason} on ${speakableDate} at ${speakableTime}. Your status is ${appointment.status.toLowerCase()}.`,
      appointment
    ));
  } catch (error) {
    next(error);
  }
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { clinicId: req.user.id },
      include: { user: true },
      orderBy: [{ appointmentDate: 'desc' }, { appointmentTime: 'desc' }]
    });
    
    // Map to what the frontend expects
    const mapped = appointments.map(a => ({
      _id: a.id,
      leadId: { name: a.user?.name || 'Unknown', phone: a.user?.phone },
      serviceType: a.reason,
      date: a.appointmentDate,
      timeSlot: a.appointmentTime,
      status: a.status.toLowerCase(),
      createdAt: a.createdAt
    }));
    
    res.status(200).json(mapped);
  } catch (error) {
    next(error);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatus = status.toUpperCase();
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: validStatus },
      include: { user: true }
    });
    
    res.status(200).json({ success: true, appointment: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.appointment.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

export const getAvailableSlots = async (req, res, next) => {
  try {
    const { date, subdomain } = req.query;
    
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required.' });
    }

    let clinicSub = subdomain;
    if (!clinicSub || clinicSub === 'localhost' || clinicSub === '127.0.0.1') {
      clinicSub = 'cliniclocal';
    }

    const clinic = await prisma.clinic.findUnique({ where: { subdomain: clinicSub } });
    
    // Generate all 30-min slots from 09:00 to 17:00
    const allSlots = [];
    const now = new Date();
    const todayStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    const isToday = date === todayStr;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let h = 9; h < 17; h++) {
      const hStr = h.toString().padStart(2, '0');
      
      if (!isToday || (h > currentHour) || (h === currentHour && currentMinute === 0)) {
        allSlots.push(`${hStr}:00`);
      }
      if (!isToday || (h > currentHour) || (h === currentHour && currentMinute <= 30)) {
        allSlots.push(`${hStr}:30`);
      }
    }

    if (!clinic) {
      // Clinic doesn't exist yet, so all slots are available
      return res.status(200).json({ success: true, availableSlots: allSlots });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        clinicId: clinic.id,
        appointmentDate: date,
        status: { in: ['SCHEDULED', 'CONFIRMED'] }
      }
    });

    const bookedSlots = appointments.map(a => a.appointmentTime);
    const availableSlots = allSlots.filter(s => !bookedSlots.includes(s));

    return res.status(200).json({ success: true, availableSlots });
  } catch (error) {
    next(error);
  }
};
