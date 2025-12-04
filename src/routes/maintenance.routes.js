import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { listMaintenance, createMaintenance } from '../controllers/maintenance.controller.js';

const router = Router();

router.get('/', authenticate, authorizeRoles('admin', 'manager'), listMaintenance);
router.post('/', authenticate, authorizeRoles('admin', 'manager'), createMaintenance);

export default router;
