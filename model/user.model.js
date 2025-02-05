const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ['user', 'admin'], // only allow user or admin
            default: 'user'
        }
    }, 
    {
        timestamps: true
    });

const User = mongoose.model('User', userSchema)

module.exports = User