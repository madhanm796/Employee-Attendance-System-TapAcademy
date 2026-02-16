
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { getStartOfDay, getEndOfDay, getMonthRange } = require('../utils/dateHelpers');
const { generateCSV } = require('../utils/csvExporter');

// Employee controllers

exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();

    const existing = await Attendance.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    if (existing) {
      return res.status(400).json({ message: 'Already checked in today' });
    }
    const now = new Date();
    const lateThreshold = new Date(now).setHours(10, 0, 0, 0);
    const status = now > lateThreshold ? 'late' : 'present';

    const attendance = await Attendance.create({
      userId,
      date: now,
      checkInTime: now,
      status
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error check-in', error: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();

    const attendance = await Attendance.findOne({
      userId,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    if (!attendance) {
      return res.status(400).json({ message: 'You have not checked in today' });
    }
    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out' });
    }

    attendance.checkOutTime = new Date();
    
    const diff = attendance.checkOutTime - attendance.checkInTime;
    const totalHours = diff / (1000 * 60 * 60);
    attendance.totalHours = parseFloat(totalHours.toFixed(2));

    if (attendance.totalHours < 4) {
      attendance.status = 'half-day';
    }

    await attendance.save();
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error check-out', error: error.message });
  }
};

exports.getTodayStatus = async (req, res) => {
  try {
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();

    const attendance = await Attendance.findOne({
      userId: req.user.id,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    res.status(200).json({
      checkedIn: !!attendance,
      data: attendance || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching today status' });
  }
};

exports.getMyHistory = async (req, res) => {
  try {
    const query = { userId: req.user.id };
    
    const attendance = await Attendance.find(query).sort({ date: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching history' });
  }
};


exports.getMySummary = async (req, res) => {
  try {
    const now = new Date();
    const { start, end } = getMonthRange(now.getFullYear(), now.getMonth());

    const records = await Attendance.find({
      userId: req.user.id,
      date: { $gte: start, $lte: end }
    });

    const summary = {
      present: records.filter(r => r.status === 'present').length,
      late: records.filter(r => r.status === 'late').length,
      halfDay: records.filter(r => r.status === 'half-day').length,
      absent: 0, 
      totalHours: records.reduce((acc, curr) => acc + curr.totalHours, 0).toFixed(2)
    };

   
    const daysPassed = now.getDate(); 
    const daysAttended = records.length;
    summary.absent = Math.max(0, daysPassed - daysAttended);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching summary' });
  }
};

// Manager controllers


exports.getAllAttendance = async (req, res) => {
  try {
    let query = {};

    if (req.query.date) {
      const d = new Date(req.query.date);
      query.date = { $gte: getStartOfDay(d), $lte: getEndOfDay(d) };
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all records' });
  }
};

exports.getSingleEmployeeAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ userId: req.params.id })
      .populate('userId', 'name email')
      .sort({ date: -1 });

    if (!attendance) {
      return res.status(404).json({ message: 'No records found for this user' });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching employee records' });
  }
};

exports.getTodayPresence = async (req, res) => {
  try {
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();

    const presentRecords = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate('userId', 'name employeeId department');

    const allUsers = await User.find({ role: 'employee' });

    const presentIds = presentRecords.map(r => r.userId._id.toString());
    
    const absentUsers = allUsers.filter(u => !presentIds.includes(u._id.toString()));

    res.status(200).json({
      present: presentRecords,
      absent: absentUsers,
      counts: {
        present: presentRecords.length,
        absent: absentUsers.length,
        total: allUsers.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching today presence' });
  }
};

exports.getTeamSummary = async (req, res) => {
  try {
    const todayStart = getStartOfDay();
    const todayEnd = getEndOfDay();

    // Today's Stats
    const todayRecords = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd }
    });

    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const presentCount = todayRecords.length;
    const lateCount = todayRecords.filter(r => r.status === 'late').length;

    res.status(200).json({
      totalEmployees,
      presentToday: presentCount,
      absentToday: totalEmployees - presentCount,
      lateToday: lateCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching team summary' });
  }
};


exports.exportAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('userId', 'name email employeeId department')
      .sort({ date: -1 });

    if (!attendance.length) return res.status(404).json({ message: 'No data' });

    const csvString = generateCSV(attendance);

    res.header('Content-Type', 'text/csv');
    res.attachment(`attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csvString);
  } catch (error) {
    res.status(500).json({ message: 'Server error exporting CSV' });
  }
};