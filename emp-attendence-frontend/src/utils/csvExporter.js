export const generateCSV = (data) => {
  const headers = ['Employee Name', 'Date', 'Status', 'Check In', 'Check Out', 'Total Hours'];
  
  const rows = data.map(record => [
    `"${record.userId?.name || 'N/A'}"`,
    `"${new Date(record.date).toLocaleDateString()}"`,
    `"${record.status}"`,
    `"${record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}"`,
    `"${record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}"`,
    record.totalHours || 0
  ]);

  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
  return csvContent;
};