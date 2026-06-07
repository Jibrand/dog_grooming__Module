import express from 'express';
import { getPublicClinicInfo, getAllClinics, createClinic, updateClinic, deleteClinic } from '../controllers/clinicController.js';

const router = express.Router();

router.get('/public/:subdomain', getPublicClinicInfo);
router.get('/', getAllClinics);
router.post('/', createClinic);
router.put('/:id', updateClinic);
router.delete('/:id', deleteClinic);

export default router;
 