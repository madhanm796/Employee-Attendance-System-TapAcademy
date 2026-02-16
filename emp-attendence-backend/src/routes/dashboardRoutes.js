const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const { getMySummary, getTeamSummary } = require('../controllers/attendanceController');

router.get('/employee', protect, getMySummary);

router.get('/manager', protect, authorize('manager'), getTeamSummary);

module.exports = router;