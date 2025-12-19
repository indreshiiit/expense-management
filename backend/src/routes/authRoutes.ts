import { Router } from 'express';
import { register, login } from '@controllers/authController.js';
import { registerRules, loginRules } from '@utils/validationRules.js';
import { validate } from '@middleware/validator.js';

const router = Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);

export default router;
