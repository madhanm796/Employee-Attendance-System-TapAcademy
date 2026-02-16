import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { User, Mail, Building2, Briefcase, Hash, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-indigo-800"></div>
        
        <div className="px-8 pb-8 flex flex-col md:flex-row items-center md:items-end -mt-4 gap-6">
          <div className="relative">
            <div className="h-28 w-28 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center text-4xl font-black text-indigo-600 shadow-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="text-center md:text-left flex-1 mb-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h2 className="text-3xl font-black text-slate-800">{user?.name}</h2>
              <ShieldCheck size={20} className="text-indigo-500" />
            </div>
            <p className="text-slate-500 font-medium">Official Employee Profile</p>
          </div>

          <div className="hidden md:block pb-2">
             <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-xs font-bold uppercase tracking-widest">
               Active Status
             </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-sm font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">
          Account Identification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <User size={12} /> Full Name
            </label>
            <p className="text-sm font-bold text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {user?.name}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Hash size={12} /> Employee ID
            </label>
            <p className="text-sm font-bold text-indigo-600 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
              {user?.employeeId || 'Not Assigned'}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Mail size={12} /> Email Address
            </label>
            <p className="text-sm font-bold text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {user?.email}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Building2 size={12} /> Department
            </label>
            <p className="text-sm font-bold text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              {user?.department || 'General'}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Briefcase size={12} /> Role
            </label>
            <p className="text-sm font-bold text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-slate-100 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;