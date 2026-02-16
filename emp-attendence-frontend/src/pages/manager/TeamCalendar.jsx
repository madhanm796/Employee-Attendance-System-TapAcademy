import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { ChevronLeft, ChevronRight, Users, Clock, AlertCircle, Calendar } from 'lucide-react';

const TeamCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyData, setMonthlyData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayDetails, setDayDetails] = useState([]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  useEffect(() => {
    const fetchMonthSummary = async () => {
      const data = await attendanceApi.getAllRecords({date: selectedDate});
      
      const mapped = data.reduce((acc, curr) => {
        const dateStr = new Date(curr.date).toISOString().split('T')[0];
        if (!acc[dateStr]) acc[dateStr] = { present: 0, late: 0, absent: 0 };
        acc[dateStr][curr.status]++;
        return acc;
      }, {});
      setMonthlyData(mapped);
    };
    fetchMonthSummary();
  }, [currentDate]);

  const handleDateClick = async (dateStr) => {
    setSelectedDate(dateStr);
    const data = await attendanceApi.getAllRecords({ date: dateStr });
    setDayDetails(data);
  };

  return (
       <>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Team Attendance Calendar</h1>
            <p className="text-slate-500 text-sm">Visualizing team patterns and monthly presence.</p>
        </div>
        
        <div className="flex gap-4">
            <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl flex items-center gap-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-700 font-bold text-sm">Live Tracking</span>
            </div>
        </div>
        </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"><ChevronLeft size={20}/></button>
            <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/30">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} className="h-32 border-b border-r border-slate-50 bg-slate-50/10"></div>)}
          
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const stats = monthlyData[dateStr];
            const isSelected = selectedDate === dateStr;

            return (
              <div 
                key={day} 
                onClick={() => handleDateClick(dateStr)}
                className={`h-32 p-2 border-b border-r border-slate-100 cursor-pointer transition-all hover:bg-indigo-50/30 ${isSelected ? 'bg-indigo-50 ring-2 ring-inset ring-indigo-500 z-10' : ''}`}
              >
                <span className={`text-sm font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-700'}`}>{day}</span>
                
                {stats && (
                  <div className="mt-2 space-y-1">
                    {stats.present > 0 && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        <Users size={10}/> {stats.present}
                      </div>
                    )}
                    {stats.late > 0 && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Clock size={10}/> {stats.late}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 h-fit sticky top-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          {selectedDate ? `Details for ${new Date(selectedDate).toLocaleDateString()}` : 'Select a date'}
        </h3>
        
        {!selectedDate ? (
          <div className="text-center py-12 text-slate-400">
            <Calendar className="mx-auto mb-3 opacity-20" size={48} />
            <p>Click a date to see individual logs</p>
          </div>
        ) : dayDetails.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No records found.</div>
        ) : (
          <div className="space-y-4">
            {dayDetails.map(record => (
              <div key={record._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{record.userId?.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{record.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-slate-600">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--'}</p>
                  <p className="text-[10px] text-slate-400">Check-in</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
       </>
  );
};

export default TeamCalendar;