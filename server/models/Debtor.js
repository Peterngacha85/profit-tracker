const mongoose = require('mongoose');

const debtorSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot be more than 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  transactionDate: {
    type: Date,
    required: [true, 'Transaction date is required'],
    default: Date.now
  },
  entryDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
debtorSchema.index({ status: 1, dueDate: 1 });
debtorSchema.index({ createdBy: 1, status: 1 });

// Virtual for checking if debtor is overdue
debtorSchema.virtual('isOverdue').get(function() {
  return this.status === 'unpaid' && this.dueDate < new Date();
});

// Virtual for formatted amount
debtorSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.amount);
});

// Virtual for days overdue
debtorSchema.virtual('daysOverdue').get(function() {
  if (this.status === 'paid' || this.dueDate >= new Date()) {
    return 0;
  }
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  const diffTime = today - dueDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtuals are serialized
debtorSchema.set('toJSON', { virtuals: true });
debtorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Debtor', debtorSchema); 