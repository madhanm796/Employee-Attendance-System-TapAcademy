import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { UserCheck, UserX, Search, Building2 } from 'lucide-react';

const TodayPresence = () => {
  const [data, setData] = useState({ present: [], absent: [], counts: { present: 0, absent: 0, total: 0 } });
  const [activeTab, setActiveTab] = useState('present');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const result = await attendanceApi.getTodayPresence();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPresence();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading real-time status...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Today's Presence</h2>
          <p className="text-slate-500 text-sm">Real-time tracking for {new Date().toLocaleDateString()}</p>
        </div>

        <div className="flex gap-2">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-bold text-sm">
            {data.counts.present} Present
          </div>
          <div className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl border border-rose-100 font-bold text-sm">
            {data.counts.absent} Absent
          </div>
        </div>
      </div>


      <div className="flex p-1 bg-slate-100 rounded-2xl w-full max-w-md">
        <button 
          onClick={() => setActiveTab('present')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'present' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <UserCheck size={18} /> Present
        </button>
        <button 
          onClick={() => setActiveTab('absent')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'absent' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <UserX size={18} /> Absent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'present' ? (
          data.present.map(record => (
            <div key={record._id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                  {record.userId.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{record.userId.name}</h4>
                  <p className="text-xs text-slate-400">{record.userId.department}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                  {new Date(record.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">Checked In</p>
              </div>
            </div>
          ))
        ) : (
          data.absent.map(user => (
            <div key={user._id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 grayscale opacity-70">
              <div className="h-10 w-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                <p className="text-xs text-slate-500">{user.department}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {activeTab === 'absent' && data.absent.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
           <UserCheck size={48} className="mx-auto text-emerald-200 mb-4" />
           <p className="text-slate-500 font-medium">Everyone is present today! 👏</p>
        </div>
      )}
    </div>
  );
};

export default TodayPresence;