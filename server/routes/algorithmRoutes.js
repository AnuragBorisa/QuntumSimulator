// routes/algorithmRoutes.js

import express from 'express';
import { runAlgorithm } from '../controllers/algorithmController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/run', protect, authorize('student', 'user'), runAlgorithm);

export default router;
