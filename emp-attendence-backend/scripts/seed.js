const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');
const Attendance = require('../src/models/Attendance');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await User.deleteMany({});
    await Attendance.deleteMany({});

    const manager = await User.create({
      name: 'Admin Manager',
      email: 'manager@test.com',
      password: 'password123', 
      role: 'manager',
      employeeId: 'MGR001',
      department: 'HR'
    });

    const emp1 = await User.create({
      name: 'John Doe',
      email: 'john@test.com',
      password: 'password123',
      role: 'employee',
      employeeId: 'EMP001',
      department: 'IT'
    });

    const emp2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@test.com',
      password: 'password123',
      role: 'employee',
      employeeId: 'EMP002',
      department: 'Sales'
    });
    const users = [emp1, emp2];
    const statuses = ['present', 'late', 'half-day'];

    for (let i = 0; i < 7; i++) {
      let date = new Date();
      date.setDate(date.getDate() - i);

      for (const user of users) {
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        await Attendance.create({
          userId: user._id,
          date: date,
          checkInTime: new Date(date.setHours(9, 0, 0)),
          checkOutTime: new Date(date.setHours(17, 0, 0)),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          totalHours: 8
        });
      }
    }

    console.log('✅ Data Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();