import { Router } from 'express';
import {
    getPasswords,
    getPassword,
    createPassword,
    updatePassword,
    deletePassword,
} from '../controllers/passwordController';
import { authMiddleware } from '../middleware/auth';
import { passwordValidation } from '../middleware/validation';

const router = Router();

// All routes are protected
router.use(authMiddleware);

router.get('/', getPasswords);
router.get('/:id', getPassword);
router.post('/', passwordValidation, createPassword);
router.put('/:id', updatePassword);
router.delete('/:id', deletePassword);

export default router;
