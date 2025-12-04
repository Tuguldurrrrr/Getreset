import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { listUsers, createUser, updateRole } from '../controllers/users.controller.js';

const router = Router();

router.get('/', authenticate, authorizeRoles('admin', 'manager'), listUsers);
router.post('/', authenticate, authorizeRoles('admin'), createUser);
router.patch('/:id/role', authenticate, authorizeRoles('admin'), updateRole);

export default router;
