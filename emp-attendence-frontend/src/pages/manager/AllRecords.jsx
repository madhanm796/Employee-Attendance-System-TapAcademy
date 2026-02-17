import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { generateCSV } from '../../utils/csvExporter';
import UserHistoryModal from '../manager/UserHistoryModal';
import { Download, Filter, Search, Calendar, FileText } from 'lucide-react';

const AllRecords = () => {
  const [records, setRecords] = useState([]);
  const [filters, setFilters] = useState({ date: '', status: '', employeeId: '' });
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await attendanceApi.getAllRecords(filters);
      console.log(data);
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [filters]); 

 const handleExport = async () => {
  try {
    const blob = await attendanceApi.exportAttendance();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    
    const filename = `Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', filename);
    
    document.body.appendChild(link);
    link.click();
    
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
    alert("Could not export CSV. Please try again.");
  }
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Attendance Logs</h2>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="date" 
            className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
            onChange={(e) => setFilters({...filters, date: e.target.value})}
          />
        </div>

        <select 
          className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="present">Present</option>
          <option value="late">Late</option>
          <option value="absent">Absent</option>
          <option value="half-day">Half Day</option>
        </select>

        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Employee ID..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
            onChange={(e) => setFilters({...filters, employeeId: e.target.value})}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 text-xs uppercase font-bold tracking-wider">
              <th className="p-4">Employee</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Check In/Out</th>
              <th className="p-4">Hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((r) => (
              <tr key={r._id} onClick={() => setSelectedUser(r.userId)} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-purple-800 cursor-pointer">{r.userId?.name}</div>
                  <div className="text-xs text-slate-500">{r.userId?.department}</div>
                </td>
                <td className="p-4 text-slate-600">{new Date(r.date).toLocaleDateString()}</td>
                <td className="p-4">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                     r.status === 'present' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                     r.status === 'late' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                   }`}>
                     {r.status}
                   </span>
                </td>
                <td className="p-4 text-sm text-slate-600">
                  {r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--'} / 
                  {r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--'}
                </td>
                <td className="p-4 font-bold text-slate-700">{r.totalHours || 0}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedUser && (
        <UserHistoryModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default AllRecords;