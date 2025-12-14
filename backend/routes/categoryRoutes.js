const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { createCategoryValidation, updateCategoryValidation } = require('../middleware/categoryValidation');
const { auth, authorize } = require('../middleware/authMiddleware');

// All category routes require authentication
router.use(auth);

// Get all categories (admin, organizer can access)
router.get('/', authorize('admin', 'organizer'), categoryController.getCategories);

// Get category by ID (admin, organizer can access)
router.get('/:id', authorize('admin', 'organizer'), categoryController.getCategoryById);

// Create new category (admin, organizer can create)
router.post('/', authorize('admin', 'organizer'), createCategoryValidation, categoryController.createCategory);

// Update category (admin, organizer can update)
router.put('/:id', authorize('admin', 'organizer'), updateCategoryValidation, categoryController.updateCategory);

// Delete category (admin, organizer can delete)
router.delete('/:id', authorize('admin', 'organizer'), categoryController.deleteCategory);

module.exports = router;