const express = require('express');
const { body } = require('express-validator');
const { 
  getTransactions, 
  getTransaction, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getAnalytics
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/transactions
// @desc    Get all transactions
// @access  Private
router.get('/', getTransactions);

// @route   GET /api/transactions/analytics
// @desc    Get transaction analytics
// @access  Private
router.get('/analytics', getAnalytics);

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Private
router.get('/:id', getTransaction);

// @route   POST /api/transactions
// @desc    Create transaction
// @access  Private
router.post('/', [
  body('type', 'Transaction type is required').isIn(['sale', 'delivery_fee', 'expense']),
  body('amount', 'Amount is required and must be positive').isFloat({ min: 0 }),
  body('transactionDate', 'Transaction date must be a valid date').optional().isISO8601(),
  body('description', 'Description cannot exceed 200 characters').optional().isLength({ max: 200 })
], createTransaction);

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', [
  body('type', 'Transaction type is required').optional().isIn(['sale', 'delivery_fee', 'expense']),
  body('amount', 'Amount must be positive').optional().isFloat({ min: 0 }),
  body('transactionDate', 'Transaction date must be a valid date').optional().isISO8601(),
  body('description', 'Description cannot exceed 200 characters').optional().isLength({ max: 200 })
], updateTransaction);

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', deleteTransaction);

module.exports = router; 