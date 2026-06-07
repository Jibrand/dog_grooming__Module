import prisma from '../config/db.js';

export const getLeads = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { clinicId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    const mapped = users.map(u => ({
      _id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      source: 'vapi', // default mock source
      createdAt: u.createdAt
    }));
    
    res.status(200).json(mapped);
  } catch (error) {
    next(error);
  }
};

export const getLeadAppointments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const appointments = await prisma.appointment.findMany({
      where: { userId: id, clinicId: req.user.id },
      orderBy: [{ appointmentDate: 'desc' }, { appointmentTime: 'desc' }]
    });
    
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.deleteMany({ where: { id, clinicId: req.user.id } });
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    next(error);
  }
};
