import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { listCars, getCar, createCar, updateCar, deleteCar } from '../controllers/cars.controller.js';

const router = Router();

router.get('/', listCars);
router.get('/:id', getCar);
router.post('/', authenticate, authorizeRoles('admin', 'manager'), createCar);
router.put('/:id', authenticate, authorizeRoles('admin', 'manager'), updateCar);
router.delete('/:id', authenticate, authorizeRoles('admin'), deleteCar);

export default router;
