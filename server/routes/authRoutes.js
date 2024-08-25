import express from 'express';
const router = express.Router();
import { registerStudent, registerUser, login, forgotPassword, verifyToken, updatePassword } from '../controllers/authController.js';
import { registerStudentValidator, registerUserValidator, loginValidator } from '../validators/authValidators.js';
import { handleValidationErrors } from '../middlewares/validationMiddleware.js';

router.post('/register/student', registerStudentValidator, handleValidationErrors, registerStudent);
router.post('/register/user', registerUserValidator, handleValidationErrors, registerUser);
router.post('/login', loginValidator, handleValidationErrors, login);
router.post('/forgot-password', forgotPassword);
router.get('/reset/:token', verifyToken);
router.post('/reset/:token', updatePassword);

export default router;
