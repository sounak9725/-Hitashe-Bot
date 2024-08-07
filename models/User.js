// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 }, // Balance in hand
    bank: { type: Number, default: 0 }, // Bank balance
    roles: { type: [String], default: [] } // Array to store role IDs
});

module.exports = mongoose.model('User', userSchema);
