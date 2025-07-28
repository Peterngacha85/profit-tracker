const Debtor = require('../models/Debtor');

// @desc    Get all debtors
// @route   GET /api/debtors
// @access  Private
const getDebtors = async (req, res) => {
  try {
    const { status, overdue, page = 1, limit = 10 } = req.query;
    
    const query = { createdBy: req.user._id };
    
    // Filter by status
    if (status && ['unpaid', 'paid'].includes(status)) {
      query.status = status;
    }
    
    // Filter overdue debtors
    if (overdue === 'true') {
      query.status = 'unpaid';
      query.dueDate = { $lt: new Date() };
    }
    
    const skip = (page - 1) * limit;
    
    const debtors = await Debtor.find(query)
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name');
    
    const total = await Debtor.countDocuments(query);
    
    res.json({
      success: true,
      data: debtors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get debtors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single debtor
// @route   GET /api/debtors/:id
// @access  Private
const getDebtor = async (req, res) => {
  try {
    const debtor = await Debtor.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: 'Debtor not found'
      });
    }
    
    // Check ownership
    if (debtor.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    res.json({
      success: true,
      data: debtor
    });
  } catch (error) {
    console.error('Get debtor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create debtor
// @route   POST /api/debtors
// @access  Private
const createDebtor = async (req, res) => {
  try {
    const { clientName, amount, dueDate, transactionDate } = req.body;
    
    const debtor = await Debtor.create({
      clientName,
      amount,
      dueDate,
      transactionDate: transactionDate || new Date(),
      createdBy: req.user._id
    });
    
    res.status(201).json({
      success: true,
      data: debtor
    });
  } catch (error) {
    console.error('Create debtor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update debtor
// @route   PUT /api/debtors/:id
// @access  Private
const updateDebtor = async (req, res) => {
  try {
    let debtor = await Debtor.findById(req.params.id);
    
    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: 'Debtor not found'
      });
    }
    
    // Check ownership
    if (debtor.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    debtor = await Debtor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: debtor
    });
  } catch (error) {
    console.error('Update debtor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Mark debtor as paid
// @route   PATCH /api/debtors/:id/mark-paid
// @access  Private
const markAsPaid = async (req, res) => {
  try {
    const debtor = await Debtor.findById(req.params.id);
    
    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: 'Debtor not found'
      });
    }
    
    // Check ownership
    if (debtor.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    debtor.status = 'paid';
    await debtor.save();
    
    res.json({
      success: true,
      data: debtor
    });
  } catch (error) {
    console.error('Mark as paid error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete debtor
// @route   DELETE /api/debtors/:id
// @access  Private
const deleteDebtor = async (req, res) => {
  try {
    const debtor = await Debtor.findById(req.params.id);
    
    if (!debtor) {
      return res.status(404).json({
        success: false,
        message: 'Debtor not found'
      });
    }
    
    // Check ownership
    if (debtor.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    await debtor.deleteOne();
    
    res.json({
      success: true,
      message: 'Debtor deleted'
    });
  } catch (error) {
    console.error('Delete debtor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get debtor analytics
// @route   GET /api/debtors/analytics
// @access  Private
const getDebtorAnalytics = async (req, res) => {
  try {
    const debtors = await Debtor.find({ createdBy: req.user._id });
    
    // Calculate totals
    const totalDebt = debtors
      .filter(d => d.status === 'unpaid')
      .reduce((sum, d) => sum + d.amount, 0);
    
    const totalPaid = debtors
      .filter(d => d.status === 'paid')
      .reduce((sum, d) => sum + d.amount, 0);
    
    const overdueDebt = debtors
      .filter(d => d.status === 'unpaid' && d.dueDate < new Date())
      .reduce((sum, d) => sum + d.amount, 0);
    
    const overdueCount = debtors.filter(d => 
      d.status === 'unpaid' && d.dueDate < new Date()
    ).length;
    
    // Status breakdown
    const statusBreakdown = {
      unpaid: debtors.filter(d => d.status === 'unpaid').length,
      paid: debtors.filter(d => d.status === 'paid').length
    };
    
    // Overdue debtors
    const overdueDebtors = debtors
      .filter(d => d.status === 'unpaid' && d.dueDate < new Date())
      .sort((a, b) => a.dueDate - b.dueDate)
      .slice(0, 5); // Top 5 overdue
    
    res.json({
      success: true,
      data: {
        summary: {
          totalDebt,
          totalPaid,
          overdueDebt,
          overdueCount
        },
        statusBreakdown,
        overdueDebtors
      }
    });
  } catch (error) {
    console.error('Get debtor analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getDebtors,
  getDebtor,
  createDebtor,
  updateDebtor,
  markAsPaid,
  deleteDebtor,
  getDebtorAnalytics
}; 