import express from 'express';
import { getNextProspect, updateStatus } from '../services/googleSheetsToolService.js';

const router = express.Router();

// GET /api/tool/get-next-prospect
router.get('/get-next-prospect', async (req, res, next) => {
  try {
    const prospect = await getNextProspect();
    if (!prospect) {
      return res.json({
        success: true,
        message: 'No more prospects available.',
        prospect: null
      });
    }
    
    return res.json({
      success: true,
      prospect
    });
  } catch (error) {
    next(error); // Let the global error handler catch it
  }
});

// POST /api/tool/update-status
router.post('/update-status', async (req, res, next) => {
  try {
    const { phone, status, notes, email } = req.body;
    
    if (!phone || !status) {
      return res.status(400).json({
        success: false,
        message: 'phone and status are required'
      });
    }

    await updateStatus({ phone, status, notes, email });

    return res.json({
      success: true
    });
  } catch (error) {
    next(error);
  }
});

export default router;
