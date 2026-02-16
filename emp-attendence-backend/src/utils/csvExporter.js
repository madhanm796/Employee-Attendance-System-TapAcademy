
const { formatDate } = require('./dateHelpers');

const generateCSV = (data) => {
  const headers = [
    'Employee ID',
    'Name',
    'Department',
    'Date',
    'Check In',
    'Check Out',
    'Status',
    'Total Hours'
  ];

  const rows = data.map(record => {
    const empId = record.userId ? record.userId.employeeId : 'N/A';
    const name = record.userId ? record.userId.name : 'Unknown';
    const dept = record.userId ? record.userId.department : 'N/A';

    const checkIn = record.checkInTime 
      ? new Date(record.checkInTime).toLocaleTimeString() 
      : '-';
    
    const checkOut = record.checkOutTime 
      ? new Date(record.checkOutTime).toLocaleTimeString() 
      : '-';

    return [
      empId,
      `"${name}"`, 
      dept,
      formatDate(record.date),
      checkIn,
      checkOut,
      record.status,
      record.totalHours || 0
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

module.exports = { generateCSV };