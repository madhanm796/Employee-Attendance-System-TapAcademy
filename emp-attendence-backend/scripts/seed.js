const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data to avoid duplicates
    await User.deleteMany({});
    await Attendance.deleteMany({});

    // Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash('admin123', salt);
    const hashedUserPassword = await bcrypt.hash('user123', salt);

    // 1. Create Users
    const users = await User.insertMany([
      {
        name: "Admin Manager",
        email: "admin@company.com",
        password: hashedAdminPassword,
        role: "manager",
        employeeId: "MGR001",
        department: "Operations"
      },
      {
        name: "Jane Smith",
        email: "user@company.com",
        password: hashedUserPassword,
        role: "employee",
        employeeId: "EMP001",
        department: "Engineering"
      }
    ]);

    console.log("Users Seeded ✅");

    // 2. Create Attendance Data for the last 5 days
    const attendanceRecords = [];
    const emp1 = users[1]._id;
    const emp2 = users[2]._id;

    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // Record for Employee 1
      attendanceRecords.push({
        userId: emp1,
        date: date,
        checkInTime: new Date(date.setHours(9, 30)),
        checkOutTime: new Date(date.setHours(18, 0)),
        status: i === 1 ? 'late' : 'present', // Make one day "late"
        totalHours: 8.5
      });

      // Record for Employee 2 (Absent yesterday)
      if (i !== 1) {
        attendanceRecords.push({
          userId: emp2,
          date: date,
          checkInTime: new Date(date.setHours(9, 0)),
          checkOutTime: new Date(date.setHours(17, 30)),
          status: 'present',
          totalHours: 8.5
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log("Attendance Data Seeded ✅");

    console.log("Seeding Complete. Press Ctrl+C to exit.");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();