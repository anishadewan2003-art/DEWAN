import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus
} from '../controllers/orderController.js';
import { validateOrder } from '../middleware/validation.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public route (for creating orders)
router.post('/', validateOrder, createOrder);

// Protected routes
router.get('/', authenticate, getOrders);
router.get('/:id', optionalAuth, getOrderById);
router.patch('/:id/status', authenticate, updateOrderStatus);

export default router;

