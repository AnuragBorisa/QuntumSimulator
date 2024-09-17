import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { createSimulation, getSimulations, getSimulation, getRecentSimulations,updateSimulation, deleteSimulation, uploadFile, downloadFile } from '../controllers/simulationController.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();


router.get('/recent', protect, authorize('student'), getRecentSimulations);
router.route('/')
  .post(protect, authorize('student'), createSimulation)
  .get(protect, authorize('student'), getSimulations);

router.route('/:id')
  .get(protect, authorize('student'), getSimulation)
  .put(protect, authorize('student'), updateSimulation)
  .delete(protect, authorize('student'), deleteSimulation);




router.post('/:id/upload', protect, authorize('student'), upload, uploadFile);

router.get('/:id/download', protect, authorize('student'), downloadFile);

export default router;
