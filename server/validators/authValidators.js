import { body } from 'express-validator';

export const registerStudentValidator = [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
];

export const registerUserValidator = [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
];

export const loginValidator = [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').notEmpty()
];
