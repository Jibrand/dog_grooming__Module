import prisma from '../config/db.js';
import { formatResponse } from '../utils/responseHelper.js';

export const getPublicClinicInfo = async (req, res, next) => {
  try {
    let { subdomain } = req.params;

    if (!subdomain || subdomain === 'localhost' || subdomain === '127.0.0.1') {
      subdomain = 'cliniclocal';
    }

    let clinic = await prisma.clinic.findUnique({
      where: { subdomain }
    });

    // If it's the cliniclocal demo and doesn't exist or is empty, seed it with rich data
    if (subdomain === 'cliniclocal') {
      const seedData = {
        name: 'Paws & Bubbles Grooming',
        phone: '+1 (555) 123-4567',
        email: 'hello@pawsandclaws.com',
        location: '123 Pet Avenue, New York, NY',
        logoUrl: '', // Provide a fallback in frontend if empty, or a real URL if the user sets it up
        happyPetsTreated: 4500,
        expertSpecialists: 12,
        yearsExperience: 15,
        services: [
          { name: 'Wellness Exams', description: 'Comprehensive health checks for your furry friends.' },
          { name: 'Vaccinations', description: 'Essential immunizations to keep pets safe.' },
          { name: 'Dental Care', description: 'Professional teeth cleaning and oral health.' },
          { name: 'Surgery', description: 'State-of-the-art surgical facilities.' },
          { name: 'Emergency Care', description: '24/7 urgent care for critical situations.' },
          { name: 'Grooming', description: 'Professional styling and spa services.' }
        ],
        testimonials: [
          { name: 'Sarah Jenkins', text: 'Dr. Smith took amazing care of my golden retriever! The staff is so friendly and professional. Highly recommend this clinic.', rating: 5 },
          { name: 'Mike Rogers', text: 'Great service, they really care about the animals. Very satisfied with the care my cat received.', rating: 5 },
          { name: 'Emily Chen', text: 'They saved my puppy\'s life! The emergency response was incredibly fast and the follow-up care has been exceptional.', rating: 5 }
        ]
      };

      if (!clinic) {
        clinic = await prisma.clinic.create({
          data: {
            subdomain,
            ...seedData
          }
        });
      } else if (!clinic.services || (Array.isArray(clinic.services) && clinic.services.length === 0)) {
        // If clinic exists but is barebones (e.g. created by login before this update), update it
        clinic = await prisma.clinic.update({
          where: { subdomain },
          data: seedData
        });
      }
    }

    if (!clinic) {
      return res.status(404).json(formatResponse(false, 'Clinic not found', null));
    }

    // Return the public data
    res.status(200).json({
      success: true,
      data: {
        id: clinic.id,
        name: clinic.name,
        subdomain: clinic.subdomain,
        phone: clinic.phone,
        email: clinic.email,
        location: clinic.location,
        logoUrl: clinic.logoUrl,
        happyPetsTreated: clinic.happyPetsTreated,
        expertSpecialists: clinic.expertSpecialists,
        yearsExperience: clinic.yearsExperience,
        services: clinic.services,
        testimonials: clinic.testimonials
      }
    });

  } catch (error) {
    next(error);
  }
};

export const getAllClinics = async (req, res, next) => {
  try {
    const clinics = await prisma.clinic.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: clinics });
  } catch (error) {
    next(error);
  }
};

export const createClinic = async (req, res, next) => {
  try {
    const { name, subdomain, logoUrl, details } = req.body;
    
    if (!subdomain) {
      return res.status(400).json(formatResponse(false, 'Subdomain is required', null));
    }

    const existing = await prisma.clinic.findUnique({ where: { subdomain } });
    if (existing) {
      return res.status(400).json(formatResponse(false, 'Subdomain already exists', null));
    }

    let parsedDetails = {};
    if (details) {
      try {
        parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
      } catch (e) {
        return res.status(400).json(formatResponse(false, 'Invalid JSON in details', null));
      }
    }

    const { phone, email, location, happyPetsTreated, expertSpecialists, yearsExperience, services, testimonials } = parsedDetails;

    const clinic = await prisma.clinic.create({
      data: {
        name: name || 'New Clinic',
        subdomain,
        logoUrl: logoUrl || '',
        phone, email, location, happyPetsTreated, expertSpecialists, yearsExperience, services, testimonials
      }
    });

    res.status(201).json({ success: true, data: clinic });
  } catch (error) {
    next(error);
  }
};

export const updateClinic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, subdomain, logoUrl, details } = req.body;

    let parsedDetails = {};
    if (details) {
      try {
        parsedDetails = typeof details === 'string' ? JSON.parse(details) : details;
      } catch (e) {
        return res.status(400).json(formatResponse(false, 'Invalid JSON in details', null));
      }
    }

    const { phone, email, location, happyPetsTreated, expertSpecialists, yearsExperience, services, testimonials } = parsedDetails;

    const clinic = await prisma.clinic.update({
      where: { id },
      data: {
        name,
        subdomain,
        logoUrl,
        phone, email, location, happyPetsTreated, expertSpecialists, yearsExperience, services, testimonials
      }
    });

    res.status(200).json({ success: true, data: clinic });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatResponse(false, 'Clinic not found', null));
    }
    next(error);
  }
};

export const deleteClinic = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.clinic.delete({
      where: { id }
    });
    res.status(200).json({ success: true, message: 'Clinic deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json(formatResponse(false, 'Clinic not found', null));
    }
    next(error);
  }
};
