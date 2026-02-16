import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { attendanceApi } from '../../api/attendanceApi';
import { Clock, CheckCircle, AlertCircle, Timer, LogIn, LogOut, Coffee } from 'lucide-react';
import TodayStatusCard from './TodayStatusCard';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
    </div>
  </div>
);

const EmployeeDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ present: 0, late: 0, absent: 0, halfDay: 0, totalHours: 0});
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const refreshDashboard = async () => {
    try {
      const [statsData, todayData] = await Promise.all([
        attendanceApi.getMySummary(),
        attendanceApi.getTodayStatus() 
      ]);

      console.log(statsData);
      
      setStats(statsData || { present: 0, late: 0, absent: 0, halfDay: 0, totalHours: 0 });
      setTodayRecord(todayData.data);
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  const handleCheckIn = async () => {
    try {
      await attendanceApi.checkIn();
      alert("Checked In Successfully!");
      refreshDashboard();
    } catch (error) {
      alert("Check-in failed: " + (error.response?.data?.message || error.message));
    }
  };

  // 4. Handle Check Out
  const handleCheckOut = async () => {
    try {
      await attendanceApi.checkOut();
      alert("👋 Checked Out Successfully! See you tomorrow.");
      refreshDashboard(); // Reload UI to show "Day Complete"
    } catch (error) {
      alert("❌ Check-out failed: " + (error.response?.data?.message || error.message));
    }
  };

  // 5. Determine Current Status for UI
  const isCheckedIn = !!todayRecord?.checkInTime;
  const isCheckedOut = !!todayRecord?.checkOutTime;

  if (loading) return <div className="p-10 text-center text-slate-500 animate-pulse">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      
      <TodayStatusCard />

      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {isCheckedOut 
                ? "You're all done for today! 🎉" 
                : isCheckedIn 
                  ? "You are currently working 👨‍💻" 
                  : `Good Morning, ${user?.name?.split(' ')[0]}! 👋`}
            </h2>
            <p className="text-indigo-100 text-lg flex items-center gap-2">
              <Clock size={20} />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              <span className="text-sm bg-white/20 px-2 py-0.5 rounded text-white ml-2">
                {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' })}
              </span>
            </p>
          </div>

          <div className="flex gap-4">
            {!isCheckedIn && !isCheckedOut && (
              <button 
                onClick={handleCheckIn}
                className="group bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-3 transform hover:scale-105"
              >
                <div className="p-1 bg-indigo-100 rounded-full group-hover:bg-indigo-200">
                  <LogIn size={20} className="text-indigo-600" />
                </div>
                Check In Now
              </button>
            )}

            {isCheckedIn && !isCheckedOut && (
              <div className="flex flex-col items-end gap-2">
                <div className="text-sm text-indigo-100 font-medium">
                  Started at: {new Date(todayRecord.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <button 
                  onClick={handleCheckOut}
                  className="group bg-rose-500 border border-rose-400 text-white px-8 py-4 rounded-xl font-bold hover:bg-rose-400 transition-all shadow-lg flex items-center gap-3"
                >
                  <div className="p-1 bg-rose-600 rounded-full">
                    <LogOut size={20} className="text-white" />
                  </div>
                  Check Out
                </button>
              </div>
            )}

            {isCheckedOut && (
              <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30 flex items-center gap-3">
                <div className="p-2 bg-green-400 rounded-full text-white shadow-sm">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="text-xs text-indigo-100 font-semibold uppercase">Total Hours</p>
                  <p className="text-xl font-bold">{todayRecord.totalHours || 0} hrs</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800">Monthly Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Present Days" value={stats.present} icon={CheckCircle} color="bg-emerald-500" />
        <StatCard label="Late Arrivals" value={stats.late} icon={Clock} color="bg-amber-500" />
        <StatCard label="Half Days" value={stats.halfDay} icon={Coffee} color="bg-orange-500" />
        <StatCard label="Absences" value={stats.absent} icon={AlertCircle} color="bg-rose-500" />
        <StatCard label="Total Hours" value={stats.totalHours} icon={Clock} color="bg-rose-500" />
      </div>
    </div>
  );
};

export default EmployeeDashboard;