import express from 'express';
import {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} from '../controllers/blogController.js';
import { validateBlogPost } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getBlogPosts);
router.get('/:id', getBlogPostById);

// Protected routes (admin only)
router.post('/', authenticate, validateBlogPost, createBlogPost);
router.put('/:id', authenticate, validateBlogPost, updateBlogPost);
router.delete('/:id', authenticate, deleteBlogPost);

export default router;

