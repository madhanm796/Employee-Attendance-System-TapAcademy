const Attendance = require('../models/Attendance');
const mongoose = require('mongoose');
const User = require('../models/User');
const { getStartOfDay, getEndOfDay, getMonthRange } = require('../utils/dateHelpers');
const { generateCSV } = require('../utils/csvExporter');


exports.getTeamSummary = async (req, res) => {
  try {
    const todayStart = getStartOfDay(new Date());
    const todayEnd = getEndOfDay(new Date());

    // 1. Basic Counts
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const todayRecords = await Attendance.find({
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate('userId', 'name department');

    // 2. Department-wise Stats (Pie Chart Data)
    const deptStatsMap = {};
    todayRecords.forEach(rec => {
      const dept = rec.userId?.department || 'Other';
      deptStatsMap[dept] = (deptStatsMap[dept] || 0) + 1;
    });
    const departmentStats = Object.keys(deptStatsMap).map(dept => ({
      department: dept,
      count: deptStatsMap[dept]
    }));

    // 3. Absent Employees List
    const allEmployees = await User.find({ role: 'employee' }, 'name department email');
    const presentIds = todayRecords.map(r => r.userId?._id.toString());
    const absentEmployees = allEmployees.filter(emp => !presentIds.includes(emp._id.toString()));

    // 4. Weekly Trend (for Bar Chart)
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