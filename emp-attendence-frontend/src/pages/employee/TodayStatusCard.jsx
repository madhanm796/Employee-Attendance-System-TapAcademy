import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { Clock, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

const TodayStatusCard = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await attendanceApi.getTodayStatus();
        setStatus(data);
      } catch (err) {
        console.error("Error loading today's status", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) return (
    <div className="h-32 w-full bg-slate-100 animate-pulse rounded-3xl"></div>
  );

  const isCheckedIn = status?.checkedIn;
  const record = status?.data;

  return (
    <div className={`p-6 rounded-3xl border transition-all ${
      isCheckedIn 
      ? 'bg-emerald-50 border-emerald-100' 
      : 'bg-amber-50 border-amber-100'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${isCheckedIn ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>
          {isCheckedIn ? <CheckCircle2 size={24} /> : <Clock size={24} />}
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Today</p>
          <p className="text-sm font-bold text-slate-700">
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>

      {isCheckedIn ? (
        <div>
          <h3 className="text-xl font-black text-emerald-900">Checked In</h3>
          <div className="mt-2 flex items-center gap-4 text-emerald-700">
            <div className="flex items-center gap-1 text-sm font-bold">
              <Clock size={14} /> 
              {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${
              record.status === 'late' ? 'bg-rose-100 border-rose-200 text-rose-600' : 'bg-emerald-100 border-emerald-200 text-emerald-600'
            }`}>
              {record.status}
            </span>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-black text-amber-900">Not Checked In</h3>
          <p className="text-sm text-amber-700 mt-1 font-medium">Please mark your attendance to start the day.</p>
        </div>
      )}
    </div>
  );
};

export default TodayStatusCard;