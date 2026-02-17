import React, { useEffect, useState } from 'react';
import { attendanceApi } from '../../api/attendanceApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, UserCheck, UserX, Building2, Mail } from 'lucide-react';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ManagerDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await attendanceApi.getTeamSummary();
      setData(res);
    };
    loadData();
  }, []);

  if (!data) return <div className="p-10 text-center animate-pulse">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Manager Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Users/>} label="Total Team" value={data.totalEmployees} color="indigo" />
        <StatCard icon={<UserCheck/>} label="Present Today" value={data.presentToday} color="emerald" />
        <StatCard icon={<UserX/>} label="Absent" value={data.absentToday} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-96">
          <h3 className="font-bold text-slate-800 mb-4">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.weeklyTrend}>
              <XAxis dataKey="_id" tick={{fontSize: 10}} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-96">
          <h3 className="font-bold text-slate-800 mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.departmentStats} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" nameKey="department">
                {data.departmentStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <UserX size={18} className="text-rose-500" /> Absent Employees Today
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
            {data.absentEmployees.map(user => (
              <div key={user._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">{user.department}</p>
                  </div>
                </div>
                <button className="text-indigo-500 hover:text-indigo-700"><Mail size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className={`p-6 rounded-3xl border border-slate-100 bg-white shadow-sm flex items-center gap-5`}>
    <div className={`p-4 bg-${color}-50 text-${color}-600 rounded-2xl`}>{icon}</div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{label}</p>
      <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

export default ManagerDashboard;