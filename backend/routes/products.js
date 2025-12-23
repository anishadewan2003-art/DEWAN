import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { validateProduct } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (admin only - add admin check if needed)
router.post('/', authenticate, validateProduct, createProduct);
router.put('/:id', authenticate, validateProduct, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;

