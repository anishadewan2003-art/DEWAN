import { body, validationResult } from 'express-validator';

/**
 * Validation middleware
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

/**
 * Product validation rules
 */
export const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('skinType').trim().notEmpty().withMessage('Skin type is required'),
  body('description').optional().trim(),
  handleValidationErrors
];

/**
 * Order validation rules
 */
export const validateOrder = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zip').trim().notEmpty().withMessage('Postal code is required'),
  body('paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  handleValidationErrors
];

/**
 * Blog post validation rules
 */
export const validateBlogPost = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('summary').trim().notEmpty().withMessage('Summary is required'),
  handleValidationErrors
];

/**
 * Quiz submission validation rules
 */
export const validateQuizSubmission = [
  body('answers').isObject().withMessage('Answers must be an object'),
  body('recommendations').isArray().withMessage('Recommendations must be an array'),
  handleValidationErrors
];

