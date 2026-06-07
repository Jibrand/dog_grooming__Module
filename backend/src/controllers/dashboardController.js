import prisma from '../config/db.js';

export const getDashboardData = async (req, res, next) => {
  try {
    const totalLeads = await prisma.user.count({ where: { clinicId: req.user.id } });
    const allAppointments = await prisma.appointment.findMany({ 
      where: { clinicId: req.user.id },
      include: { user: true } 
    });
    
    const totalAppts = allAppointments.length;
    const scheduled = allAppointments.filter(a => ['SCHEDULED', 'CONFIRMED'].includes(a.status)).length;
    const totalCompleted = allAppointments.filter(a => a.status === 'COMPLETED').length;
    const cancelled = allAppointments.filter(a => a.status === 'CANCELLED').length;
    const inProgress = allAppointments.filter(a => a.status === 'IN_PROGRESS').length;
    
    let conversionRate = 0;
    if (totalAppts > 0) {
      conversionRate = Math.round((totalCompleted / totalAppts) * 100);
    }
    
    let cancellationRate = 0;
    if (totalAppts > 0) {
      cancellationRate = Math.round((cancelled / totalAppts) * 100);
    }

    // Mock recent upcoming appointments
    const upcomingAppts = allAppointments
      .filter(a => ['SCHEDULED', 'CONFIRMED'].includes(a.status))
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
      .slice(0, 5)
      .map(a => ({
        _id: a.id,
        leadId: { name: a.user?.name || 'Unknown' },
        serviceType: a.reason,
        date: a.appointmentDate,
        timeSlot: a.appointmentTime,
        status: a.status.toLowerCase()
      }));

    res.status(200).json({
      kpi: {
        totalLeads,
        leadsGrowth: 5,
        leadsThisMonth: totalLeads,
        totalAppts,
        scheduled,
        totalCompleted,
        completedGrowth: 2,
        completedThisMonth: totalCompleted,
        conversionRate,
        totalReviews: 0,
        positiveReviews: 0,
        avgRating: 0,
        cancellationRate,
        cancelled,
        inProgress
      },
      upcomingAppts,
      recentActivities: [], // Mock empty since we don't track activities yet
      statusBreakdown: [
        { status: 'scheduled', count: scheduled },
        { status: 'completed', count: totalCompleted },
        { status: 'cancelled', count: cancelled },
        { status: 'in-progress', count: inProgress }
      ]
    });
  } catch (error) {
    next(error);
  }
};
