import jwt from 'jsonwebtoken';
import { formatResponse } from '../utils/responseHelper.js';

export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json(formatResponse(false, 'Unauthorized', null, 'UNAUTHORIZED'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'brightsmile_secret_123');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(formatResponse(false, 'Invalid token', null, 'INVALID_TOKEN'));
  }
};
