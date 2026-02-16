const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getTodayStatus,
  getAllAttendance,
  getSingleEmployeeAttendance,
  getTeamSummary,
  exportAttendance,
  getTodayPresence
} = require('../controllers/attendanceController');

router.post('/checkin', protect, checkIn); 
router.post('/checkout', protect, checkOut); 
router.get('/my-history', protect, getMyHistory); 
router.get('/my-summary', protect, getMySummary); 
router.get('/today', protect, getTodayStatus);

router.use(protect);
router.use(authorize('manager'));

router.get('/all', getAllAttendance);
router.get('/employee/:id', getSingleEmployeeAttendance);
router.get('/summary', getTeamSummary);
router.get('/export', exportAttendance); 
router.get('/today-status', getTodayPresence);

module.exports = router;