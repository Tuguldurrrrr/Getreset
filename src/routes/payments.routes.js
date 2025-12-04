import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { listPayments, createPayment } from '../controllers/payments.controller.js';

const router = Router();

router.get('/', authenticate, authorizeRoles('admin', 'manager'), listPayments);
router.post('/', authenticate, authorizeRoles('customer', 'admin', 'manager'), createPayment);

export default router;
