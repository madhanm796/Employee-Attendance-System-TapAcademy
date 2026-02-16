const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
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
        enum: ['employee', 'manager'],
        default: 'employee' 
    },
    employeeId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    department: { 
        type: String, 
        required: true 
    },
}, { 
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;