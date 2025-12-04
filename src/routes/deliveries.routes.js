import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { listDeliveries, updateDeliveryStatus } from '../controllers/deliveries.controller.js';

const router = Router();

router.get('/', authenticate, authorizeRoles('admin', 'manager', 'driver'), listDeliveries);
router.patch('/:id/status', authenticate, authorizeRoles('driver', 'admin', 'manager'), updateDeliveryStatus);

export default router;
