const express = require('express');
const { body } = require('express-validator');
const { 
  getDebtors, 
  getDebtor, 
  createDebtor, 
  updateDebtor, 
  markAsPaid,
  deleteDebtor,
  getDebtorAnalytics
} = require('../controllers/debtorController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/debtors
// @desc    Get all debtors
// @access  Private
router.get('/', getDebtors);

// @route   GET /api/debtors/analytics
// @desc    Get debtor analytics
// @access  Private
router.get('/analytics', getDebtorAnalytics);

// @route   GET /api/debtors/:id
// @desc    Get single debtor
// @access  Private
router.get('/:id', getDebtor);

// @route   POST /api/debtors
// @desc    Create debtor
// @access  Private
router.post('/', [
  body('clientName', 'Client name is required').not().isEmpty(),
  body('amount', 'Amount is required and must be positive').isFloat({ min: 0 }),
  body('dueDate', 'Due date is required and must be a valid date').isISO8601(),
  body('transactionDate', 'Transaction date must be a valid date').optional().isISO8601()
], createDebtor);

// @route   PUT /api/debtors/:id
// @desc    Update debtor
// @access  Private
router.put('/:id', [
  body('clientName', 'Client name is required').optional().not().isEmpty(),
  body('amount', 'Amount must be positive').optional().isFloat({ min: 0 }),
  body('dueDate', 'Due date must be a valid date').optional().isISO8601(),
  body('transactionDate', 'Transaction date must be a valid date').optional().isISO8601()
], updateDebtor);

// @route   PATCH /api/debtors/:id/mark-paid
// @desc    Mark debtor as paid
// @access  Private
router.patch('/:id/mark-paid', markAsPaid);

// @route   DELETE /api/debtors/:id
// @desc    Delete debtor
// @access  Private
router.delete('/:id', deleteDebtor);

module.exports = router; 