const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    date: {
        type: Date, 
        required: true
    },
    checkInTime: {
        type: Date
    },
    checkOutTime: {
        type: Date
    },
    status: {
        type: String, 
        enum: ['present', 'absent', 'late', 'half-day'], 
        default: 'absent', 
        required: true
    },
    totalHours: {
        type: Number
    },
}, { timestamps: true }); 

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;