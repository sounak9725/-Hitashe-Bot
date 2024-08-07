const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    balance: { type: Number, default: 0 }, // Money in hand
    bank: { type: Number, default: 0 }     // Money in bank
});

module.exports = mongoose.model('User', userSchema);
