const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
     mobile: { 
        type: String, 
        required: true,
        match: [/^[0-9]{10}$/, 'Please use a valid 10-digit mobile number.']
    },
    
    email:     { type: String, required: true, 
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']  },
    subject:   { type: String, required: true },
    message:   { type: String, required: true },
    date:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
