const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false 
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'counselor'],
        default: 'student'
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema);