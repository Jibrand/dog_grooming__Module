import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import { createEvent, updateEvent, cancelEvent } from '../services/googleCalendarService.js';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function getSystemInstruction(clinic) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const clinicName = clinic ? clinic.name : 'Paws & Bubbles Dog Grooming Salon';
  const clinicHours = "9:00 AM to 5:00 PM";

  return `The current date is ${dateStr} and the current time is ${timeStr}.

[Identity]
You are Kylie, the upbeat and friendly AI receptionist for ${clinicName}. You communicate casually and keep the interaction lighthearted, helpful, and engaging.

[Clinic Information]
- The clinic is open from ${clinicHours}.
- If a user asks for information about the clinic, provide this information.

[Style]
- Use a casual, friendly, and upbeat tone throughout the conversation.
- Maintain warmth and friendliness, making interactions feel open and engaging.
- Talk to pet owners as if you are having a friendly chat, avoiding overly robotic or professional language.
- Speak in a fast-paced manner, minimizing pauses between words to keep the interaction lively. 

[Response Guidelines]
- When a user asks to do something, collect the required information conversationally before calling the tool.
- CRITICAL: When you successfully call a tool, the tool will return a JSON response with a "message" field. You MUST read the text from that "message" field directly to the user as your response.
- BEFORE CALLING ANY TOOL, YOU MUST SAY SOMETHING LIKE "Just give me a sec" OR "Let me pull that up for you real quick" TO PREVENT SILENCES AND KEEP THE CONVERSATION LIVELY.
- If a user asks what you can do or how you can help, DO NOT use numbered lists (like 1, 2, 3). Instead, reply in a short, conversational sentence. Example: "I can help you book a new appointment for your pet, check your schedule, or reschedule and cancel existing appointments. What do you need help with?"
- If the user simply greets you (e.g., "hi", "hey", "hello"), just greet them back warmly and ask how you can help. DO NOT ask for their phone number until they actually ask to book, check, cancel, or reschedule an appointment.

[Date Handling]
- You know the exact current date and time from the system variables above.
- When a user says "today", "tomorrow", or "next Tuesday", you MUST accurately calculate the exact date (YYYY-MM-DD) based on today's date: ${dateStr}.
- If a user mentions a month and day without specifying the year (e.g., "August 1st"), you MUST ALWAYS assume it is for the current year, unless that date has already passed, in which case you must use the next year.
- NEVER send a past date to the booking tool.

[Tasks & Tools]
You have access to tools to manage dog grooming appointments. You must use them when requested:

1. Booking a New Appointment:
   - When a user wants to book an appointment, the VERY FIRST thing you must do is ask for their phone number. Do not ask for anything else yet.
   - Once they give you their phone number, immediately call the lookup_appointments tool.
   - The tool will respond. If it greets them with "Welcome back, [Name]!", you know they are an existing client! You DO NOT need to ask for their name. Simply ask for the pet's name, species (e.g., dog, cat), the reason for their visit, and their desired date and time.
   - If the tool says it doesn't see a profile, they are a new client. You must then ask for their full name, the pet's name, species, reason for visit, and desired date and time.
   - Once you have all the required details, call the book_appointment tool.

2. Looking Up Appointments (Tool: lookup_appointments):
   - If a user asks when their appointment is, or wants to cancel/reschedule, you MUST look up their appointment first.
   - Ask for their phone number to perform the lookup.

3. Rescheduling (Tool: reschedule_appointment):
   - First, use the lookup_appointments tool using their phone number to find their existing appointment.
   - Once you have their appointment details, ask them for the new date and time they want.
   - Call the reschedule tool.

4. Cancelling (Tool: cancel_appointment):
   - First, use the lookup_appointments tool using their phone number to find their existing appointment.
   - Once found, confirm they want to cancel it, and then call the cancel tool.`;
}

const tools = [
  {
    functionDeclarations: [
      {
        name: 'lookup_appointments',
        description: 'Looks up a user and their upcoming pet appointments by phone number.',
        parameters: {
          type: 'OBJECT',
          properties: {
            phone: { type: 'STRING', description: 'User phone number' },
          },
          required: ['phone'],
        },
      },
      {
        name: 'book_appointment',
        description: 'Books a new grooming appointment for a pet.',
        parameters: {
          type: 'OBJECT',
          properties: {
            phone: { type: 'STRING', description: 'User phone number' },
            name: { type: 'STRING', description: 'User full name (only required if they are a new client)' },
            petName: { type: 'STRING', description: 'Name of the pet' },
            species: { type: 'STRING', description: 'Species of the pet (e.g., Dog, Cat, Bird)' },
            reason: { type: 'STRING', description: 'Reason for the visit (e.g., Vaccination, Checkup, Illness)' },
            date: { type: 'STRING', description: 'Appointment date in YYYY-MM-DD format' },
            time: { type: 'STRING', description: 'Appointment time in HH:MM format' },
          },
          required: ['phone', 'petName', 'species', 'reason', 'date', 'time'],
        },
      },
      {
        name: 'reschedule_appointment',
        description: 'Reschedules an existing appointment to a new date and time.',
        parameters: {
          type: 'OBJECT',
          properties: {
            appointmentId: { type: 'STRING', description: 'The unique ID of the appointment (retrieved from lookup_appointments)' },
            newDate: { type: 'STRING', description: 'New appointment date in YYYY-MM-DD format' },
            newTime: { type: 'STRING', description: 'New appointment time in HH:MM format' },
          },
          required: ['appointmentId', 'newDate', 'newTime'],
        },
      },
      {
        name: 'cancel_appointment',
        description: 'Cancels an existing appointment.',
        parameters: {
          type: 'OBJECT',
          properties: {
            appointmentId: { type: 'STRING', description: 'The unique ID of the appointment (retrieved from lookup_appointments)' },
          },
          required: ['appointmentId'],
        },
      },
    ],
  },
];

export const processMessageWithAI = async (sessionId, message, subdomain) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in the backend.');
  }

  let clinicSub = subdomain;
  if (!clinicSub || clinicSub === 'localhost' || clinicSub === '127.0.0.1') {
    clinicSub = 'cliniclocal';
  }

  let clinic = await prisma.clinic.findUnique({ where: { subdomain: clinicSub } });
  if (!clinic) {
    clinic = await prisma.clinic.create({
      data: { name: clinicSub + ' Clinic', subdomain: clinicSub }
    });
  }

  let session;
  let finalSessionId = sessionId;
  
  // 1. Manage Session
  if (finalSessionId) {
    session = await prisma.chatSession.findUnique({
      where: { id: finalSessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });
  }

  if (!session) {
    session = await prisma.chatSession.create({ data: {} });
    finalSessionId = session.id;
  }

  // 2. Save User Message
  await prisma.chatMessage.create({
    data: {
      sessionId: finalSessionId,
      role: 'user',
      content: message,
    }
  });

  // 3. Format history for Gemini
  let history = session.messages && session.messages.length > 0 
    ? session.messages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })) 
    : [];

  // 4. Initialize Gemini Chat
  const model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest", 
    systemInstruction: getSystemInstruction(clinic),
    tools: tools
  });

  const chat = model.startChat({ history });

  // 5. Send message to Gemini
  let result = await chat.sendMessage(message);
  let responseText = '';

  // 6. Handle Function Calls (MCP logic)
  const calls = result.response.functionCalls();
  const call = calls && calls.length > 0 ? calls[0] : null;
  
  if (call) {
    // Execute the local tool
    const apiResponse = await executeTool(call.name, call.args, clinic.id);
    
    // Send the tool response back to Gemini to get the final text response
    result = await chat.sendMessage([{
      functionResponse: {
        name: call.name,
        response: apiResponse
      }
    }]);
  }

  responseText = result.response.text();

  // 7. Save Model Message
  await prisma.chatMessage.create({
    data: {
      sessionId: finalSessionId,
      role: 'model',
      content: responseText,
    }
  });

  return { sessionId: finalSessionId, reply: responseText };
};

export const handleChatMessage = async (req, res) => {
  try {
    const { sessionId, message, subdomain } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const aiResponse = await processMessageWithAI(sessionId, message, subdomain);
    res.json(aiResponse);

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: 'Internal Server Error processing chat' });
  }
};

// Helper function to execute backend logic based on Gemini's function call
async function executeTool(name, args, clinicId) {
  try {
    if (name === 'lookup_appointments') {
      const user = await prisma.user.findFirst({
        where: { phone: args.phone, clinicId: clinicId },
        include: {
          appointments: {
            where: { status: 'SCHEDULED' },
            orderBy: { appointmentDate: 'asc' }
          }
        }
      });

      if (!user) {
        return { message: "I don't see a profile for that number. It looks like you're a new client!" };
      }

      if (user.appointments.length === 0) {
        return { message: `Welcome back, ${user.name}! I see your profile, but you don't have any upcoming appointments scheduled right now.` };
      }

      const nextAppt = user.appointments[0];
      const petStr = nextAppt.petName ? ` for ${nextAppt.petName}` : '';
      return {
        message: `Welcome back, ${user.name}! Your next appointment${petStr} is on ${nextAppt.appointmentDate} at ${nextAppt.appointmentTime} for ${nextAppt.reason}.`,
        appointmentId: nextAppt.id, // Providing ID so AI can pass it to cancel/reschedule tools
        userName: user.name
      };
    }

    if (name === 'book_appointment') {
      let user = await prisma.user.findFirst({ where: { phone: args.phone, clinicId: clinicId } });
      
      if (!user) {
        if (!args.name) {
          return { message: "You are a new client, so I need your full name to book the appointment." };
        }
        user = await prisma.user.create({
          data: { name: args.name, phone: args.phone, clinicId: clinicId }
        });
      }

      const tempAppointment = {
        reason: args.reason,
        appointmentDate: args.date,
        appointmentTime: args.time
      };

      let googleEventId = null;
      let googleMeetLink = null;
      let syncFailed = false;

      try {
        const gcalData = await createEvent(tempAppointment, user);
        googleEventId = gcalData.googleEventId;
        googleMeetLink = gcalData.googleMeetLink;
      } catch (error) {
        console.error('Calendar sync error during bot booking:', error);
        syncFailed = true;
      }

      await prisma.appointment.create({
        data: {
          clinicId: clinicId,
          userId: user.id,
          petName: args.petName,
          species: args.species,
          reason: args.reason,
          appointmentDate: args.date,
          appointmentTime: args.time,
          status: 'SCHEDULED',
          googleEventId,
          googleMeetLink
        }
      });

      const petNameStr = args.petName || 'your pet';
      if (syncFailed) {
         return { message: `Awesome! You are all set. I have booked ${petNameStr}'s appointment for ${args.date} at ${args.time}. (Note: Google Calendar sync is temporarily delayed).` };
      }

      return {
        message: `Awesome! You are all set. I have booked ${petNameStr}'s appointment for ${args.date} at ${args.time} and added it to our Google Calendar.`
      };
    }

    if (name === 'reschedule_appointment') {
      const appt = await prisma.appointment.findFirst({ where: { id: args.appointmentId, clinicId: clinicId } });
      if (!appt) {
        return { message: "I couldn't find that specific appointment to reschedule." };
      }

      if (appt.googleEventId) {
        try {
          await updateEvent(appt.googleEventId, args.newDate, args.newTime);
        } catch (error) {
          console.error('Failed to update Google Calendar event from bot:', error);
        }
      }

      await prisma.appointment.update({
        where: { id: args.appointmentId },
        data: {
          appointmentDate: args.newDate,
          appointmentTime: args.newTime,
        }
      });

      return {
        message: `Perfect! I've rescheduled your appointment to ${args.newDate} at ${args.newTime}.`
      };
    }

    if (name === 'cancel_appointment') {
      const appt = await prisma.appointment.findFirst({ where: { id: args.appointmentId, clinicId: clinicId } });
      if (!appt) {
        return { message: "I couldn't find that specific appointment to cancel." };
      }

      if (appt.googleEventId) {
        try {
          await cancelEvent(appt.googleEventId);
        } catch (error) {
          console.error('Failed to cancel Google Calendar event from bot:', error);
        }
      }

      await prisma.appointment.update({
        where: { id: args.appointmentId },
        data: { status: 'CANCELLED' }
      });

      return {
        message: `No problem, I have completely canceled that appointment for you.`
      };
    }

    return { message: `Tool ${name} not found` };
  } catch (error) {
    console.error(`Error executing tool ${name}:`, error);
    return { message: `I hit a small glitch trying to do that.` };
  }
}
