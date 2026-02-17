
const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');
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
    const userId = req.user.id;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const stats = await Attendance.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId), 
          date: { $gte: startOfMonth, $lte: endOfMonth } 
        } 
      },
      {
        $group: {
          _id: null,
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } },
          halfDay: { $sum: { $cond: [{ $eq: ["$status", "half-day"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
          totalHours: { $sum: "$totalHours" }
        }
      }
    ]);

    const result = stats[0] || {
      totalPresent: 0,
      totalLate: 0,
      totalHalfDay: 0,
      totalAbsent: 0,
      totalHours: 0
    };

    res.json(result);

  } catch (error) {
    console.error("Summary Error:", error);
    res.status(500).json({ message: 'Server error fetching summary' });
  }
};

// Manager controllers


exports.getAllAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.query;
    let query = {};
    if (employeeId) {
      query.userId = employeeId;
    }

    if (date) {
      const d = new Date(date);
      query.date = { $gte: getStartOfDay(d), $lte: getEndOfDay(d) };
    }
    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('userId', 'name email department')
      .sort({ date: -1 });

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records', error: error.message });
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
    const todayStart = getStartOfDay(new Date());
    const todayEnd = getEndOfDay(new Date());

    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const todayRecords = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate('userId', 'name department');


    const deptStatsMap = {};
    todayRecords.forEach(rec => {
      const dept = rec.userId?.department || 'Other';
      deptStatsMap[dept] = (deptStatsMap[dept] || 0) + 1;
    });
    const departmentStats = Object.keys(deptStatsMap).map(dept => ({
      department: dept,
      count: deptStatsMap[dept]
    }));

    const allEmployees = await User.find({ role: 'employee' }, 'name department email');
    const presentIds = todayRecords.map(r => r.userId?._id.toString());
    const absentEmployees = allEmployees.filter(emp => !presentIds.includes(emp._id.toString()));

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyTrend = await Attendance.aggregate([
      { $match: { date: { $gte: getStartOfDay(sevenDaysAgo) } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          present: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      totalEmployees,
      presentToday: todayRecords.length,
      absentToday: absentEmployees.length,
      departmentStats,
      absentEmployees,
      weeklyTrend
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data' });
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