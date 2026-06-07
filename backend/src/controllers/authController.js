import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { formatResponse } from '../utils/responseHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'brightsmile_secret_123';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json(formatResponse(false, 'Email already in use', null));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (password !== 'Pass123') {
      return res.status(401).json(formatResponse(false, 'Invalid credentials', null));
    }

    let subdomain = null;

    if (email === 'cliniclocal@gmail.com') {
      subdomain = 'cliniclocal';
    } else if (email.endsWith('@futureframe.com')) {
      subdomain = email.split('@')[0];
    } else {
      return res.status(401).json(formatResponse(false, 'Invalid email format. Use subdomain@futureframe.com', null));
    }

    // Find or create clinic
    let clinic = await prisma.clinic.findUnique({ where: { subdomain } });
    if (!clinic) {
      clinic = await prisma.clinic.create({
        data: { name: subdomain + ' Clinic', subdomain }
      });
    }

    const token = jwt.sign({ id: clinic.id, subdomain }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      token,
      user: { id: clinic.id, name: 'Admin', email, businessName: clinic.name, logoUrl: clinic.logoUrl }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const clinic = await prisma.clinic.findUnique({ where: { id: req.user.id } });
    if (!clinic) {
      return res.status(404).json(formatResponse(false, 'Clinic not found', null));
    }

    res.status(200).json({ id: clinic.id, name: 'Admin', email: `${clinic.subdomain}@futureframe.com`, businessName: clinic.name, logoUrl: clinic.logoUrl });
  } catch (error) {
    next(error);
  }
};
