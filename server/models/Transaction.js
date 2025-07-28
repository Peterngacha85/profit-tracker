const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['sale', 'delivery_fee', 'expense'],
    default: 'sale'
  },
  category: {
    type: String,
    required: function() {
      return this.type === 'expense';
    },
    enum: {
      values: [
        'fuel',
        'driver',
        'car_owner',
        'turni boys',
        'repairs',
        'miscellaneous',
        'traffic_fines'
      ],
      message: 'Please select a valid expense category'
    },
    // Only validate enum if type is 'expense'
    validate: {
      validator: function(value) {
        if (this.type !== 'expense') return true;
        return [
          'fuel',
          'driver',
          'car_owner',
          'turni boys',
          'repairs',
          'miscellaneous',
          'traffic_fines'
        ].includes(value);
      },
      message: 'Please select a valid expense category'
    }
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot be more than 200 characters']
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
transactionSchema.index({ type: 1, transactionDate: -1 });
transactionSchema.index({ createdBy: 1, transactionDate: -1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.amount);
});

// Ensure virtuals are serialized
transactionSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Transaction', transactionSchema); 