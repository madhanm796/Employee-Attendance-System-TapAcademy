import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const History = () => {
  const [view, setView] = useState('calendar'); 
  const [records, setRecords] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await attendanceApi.getMyHistory();
        setRecords(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'late': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'half-day': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'absent': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };


  const getLocalDateKey = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const renderCalendarDays = () => {
    const days = [];
    const emptySlots = firstDayOfMonth;

    for (let i = 0; i < emptySlots; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[120px] bg-slate-50 border border-slate-100"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      
      const cellKey = getLocalDateKey(cellDate);

      const record = records.find(r => getLocalDateKey(r.date) === cellKey);

      days.push(
        <div key={day} className="min-h-[120px] border border-slate-100 bg-white p-2 relative group hover:shadow-md transition-all">
          <span className={`text-sm font-semibold ${record ? 'text-slate-800' : 'text-slate-400'}`}>{day}</span>
          
          {record ? (
            <div className={`mt-2 p-2 rounded-lg border text-xs font-medium flex flex-col gap-1 ${getStatusColor(record.status)}`}>
              <div className="flex justify-between items-center">
                <span className="capitalize">{record.status}</span>
                {record.status === 'present' && <CheckCircle2 size={12} />}
                {record.status === 'late' && <Clock size={12} />}
                {record.status === 'absent' && <AlertCircle size={12} />}
              </div>
              <div className="opacity-80">
                {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ) : (
             new Date(cellKey) < new Date() && new Date(cellKey).getDay() !== 0 && new Date(cellKey).getDay() !== 6 ? (
                <div className="mt-2 p-1 rounded bg-slate-100 text-slate-400 text-xs text-center">No Record</div>
             ) : null
          )}
        </div>
      );
    }
    return days;
  };

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading history...</div>;

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4 md:mb-0">
          Attendance History
        </h2>

        <div className="flex items-center gap-4">
          {view === 'calendar' && (
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-white rounded-md transition-all">
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
              <span className="px-4 font-semibold text-slate-700 min-w-[140px] text-center">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={handleNextMonth} className="p-2 hover:bg-white rounded-md transition-all">
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            </div>
          )}

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded-md flex items-center gap-2 transition-all ${view === 'calendar' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <CalendarIcon size={18} />
              <span className="text-sm font-medium hidden sm:inline">Calendar</span>
            </button>
            <button
              onClick={() => setView('table')}
              className={`p-2 rounded-md flex items-center gap-2 transition-all ${view === 'table' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List size={18} />
              <span className="text-sm font-medium hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {view === 'calendar' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {renderCalendarDays()}
          </div>
        </div>
      )}
      {view === 'table' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Check In</th>
                  <th className="p-4 font-semibold">Check Out</th>
                  <th className="p-4 font-semibold">Total Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 text-slate-700 font-medium">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(record.status)}`}>
                          {record.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                      </td>
                      <td className="p-4 text-slate-600">
                        {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                      </td>
                      <td className="p-4 text-slate-800 font-bold">
                        {record.totalHours ? `${record.totalHours} hrs` : '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default History;