import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { X, Calendar, Clock, Award } from 'lucide-react';

const UserHistoryModal = ({ user, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const data = await attendanceApi.getSingleEmployeeAttendance(user._id);
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchUserHistory();
  }, [user]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
            <p className="text-sm text-slate-500">{user.department} • {user.email}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-200">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-slate-400 animate-pulse">Loading history...</div>
          ) : (
            <div className="space-y-3">
              {history.map((record) => (
                <div key={record._id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">{new Date(record.date).toLocaleDateString('en-GB')}</p>
                      <p className="text-xs text-slate-400 uppercase font-semibold">{record.status}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="text-sm font-bold text-slate-600">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--'}</p>
                      <p className="text-[10px] text-slate-400 uppercase">In</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-600">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--'}</p>
                      <p className="text-[10px] text-slate-400 uppercase">Out</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 italic">Showing all historical records for this employee.</p>
        </div>
      </div>
    </div>
  );
};

export default UserHistoryModal;