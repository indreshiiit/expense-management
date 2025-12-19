import { body, query } from 'express-validator';

export const registerRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty(),
];

export const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export const expenseRules = [
  body('amount').isFloat({ min: 0.01 }),
  body('category').isIn([
    'food',
    'transport',
    'utilities',
    'entertainment',
    'healthcare',
    'shopping',
    'education',
    'other',
  ]),
  body('description').trim().notEmpty(),
  body('date').optional().isISO8601(),
];

export const dateRangeRules = [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
];
