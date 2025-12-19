import { Router } from 'express';
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  summary,
  stats,
} from '../controllers/expenseController.js';
import { authenticate } from '../middleware/auth';
import { expenseRules, dateRangeRules } from '@utils/validationRules.js';
import { validate } from '../middleware/validator.js';

const router = Router();

router.use(authenticate);

router.post('/', expenseRules, validate, create);
router.get('/', dateRangeRules, validate, getAll);
router.get('/summary', summary);
router.get('/stats', dateRangeRules, validate, stats);
router.get('/:id', getOne);
router.put('/:id', expenseRules, validate, update);
router.delete('/:id', remove);

export default router;
