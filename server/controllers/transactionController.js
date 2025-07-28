const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { type, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    const query = { createdBy: req.user._id };
    
    // Filter by type
    if (type && ['sale', 'delivery_fee', 'expense'].includes(type)) {
      query.type = type;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.transactionDate = {};
      if (startDate) {
        query.transactionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.transactionDate.$lte = new Date(endDate);
      }
    }
    
    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find(query)
      .sort({ transactionDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name');
    
    const total = await Transaction.countDocuments(query);
    
    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    // Check ownership
    if (transaction.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, transactionDate } = req.body;
    
    // Validate expense category
    if (type === 'expense' && !category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required for expenses'
      });
    }
    
    const transaction = await Transaction.create({
      type,
      category,
      amount,
      description,
      transactionDate: transactionDate || new Date(),
      createdBy: req.user._id
    });
    
    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    // Check ownership
    if (transaction.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    // Check ownership
    if (transaction.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    await transaction.deleteOne();
    
    res.json({
      success: true,
      message: 'Transaction deleted'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get analytics
// @route   GET /api/transactions/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        transactionDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      // Default period filtering
      const now = new Date();
      let start;
      
      switch (period) {
        case 'week':
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          start = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          start = new Date(now.getFullYear(), now.getMonth(), 1);
      }
      
      dateFilter = {
        transactionDate: {
          $gte: start,
          $lte: now
        }
      };
    }
    
    const query = {
      createdBy: req.user._id,
      ...dateFilter
    };
    
    // Get transactions for analytics
    const transactions = await Transaction.find(query);
    
    // Calculate totals
    const totalIncome = transactions
      .filter(t => ['sale', 'delivery_fee'].includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netProfit = totalIncome - totalExpenses;
    
    // Expense breakdown by category
    const expenseBreakdown = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
    
    // Daily breakdown for charts
    const dailyData = transactions.reduce((acc, t) => {
      const date = t.transactionDate.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { income: 0, expenses: 0 };
      }
      if (['sale', 'delivery_fee'].includes(t.type)) {
        acc[date].income += t.amount;
      } else {
        acc[date].expenses += t.amount;
      }
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpenses,
          netProfit
        },
        expenseBreakdown,
        dailyData: Object.entries(dailyData).map(([date, data]) => ({
          date,
          income: data.income,
          expenses: data.expenses,
          profit: data.income - data.expenses
        }))
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAnalytics
}; 