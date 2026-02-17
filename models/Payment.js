const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'test', 
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: ['Success', 'Failed', 'Pending'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);