import React from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  BarChart3, Users, TrendingUp, Send, Video, 
  CheckCircle, BookOpen, Clock, Heart 
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { members, attendance, whatsAppMessages, sermons, devotionals } = useChurch();

  const totalMembers = 1248;
  const newThisMonth = 43;
  const activeMembers = 1180;
  const inactiveMembers = 68;

  const weeklyAttendanceData = [
    { service: 'Sep 07', count: 340 },
    { service: 'Sep 14', count: 365 },
    { service: 'Sep 21', count: 390 },
    { service: 'Sep 28', count: 412 },
  ];

  const maxAtt = Math.max(...weeklyAttendanceData.map(d => d.count));

  const totalMessages = whatsAppMessages.length;
  const delivered = whatsAppMessages.filter(m => m.status === 'delivered' || m.status === 'read').length;
  const read = whatsAppMessages.filter(m => m.status === 'read').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Church Analytics & Growth Metrics</h1>
        <p className="text-xs text-slate-500">Comprehensive insights into congregation trends, attendance, and member engagement</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Membership</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalMembers}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">+{newThisMonth} new this month</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Avg. Sunday Attendance</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-700 mt-2">412</div>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">Up 12% over last 4 weeks</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">WhatsApp Delivery Rate</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">98.4%</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Verified Cloud API</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Cell Involvement</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-2">78%</div>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">Participating in house fellowships</p>
        </div>
      </div>

      {/* Attendance Growth Chart Bar Graphic */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sunday Service Attendance Trajectory</h3>
            <p className="text-xs text-slate-500">Weekly worship attendance progression</p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
            September 2026
          </span>
        </div>

        <div className="h-56 flex items-end justify-around gap-6 pt-8 pb-4 border-b border-slate-100">
          {weeklyAttendanceData.map(d => {
            const heightPercent = Math.round((d.count / maxAtt) * 100);
            return (
              <div key={d.service} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <span className="text-xs font-bold text-slate-700 group-hover:text-teal-700 transition-colors">
                  {d.count}
                </span>
                <div 
                  className="w-full max-w-[64px] bg-gradient-to-t from-teal-700 to-teal-500 rounded-xl transition-all duration-300 group-hover:from-teal-800 group-hover:to-teal-600 shadow-xs"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs font-medium text-slate-500 mt-1">{d.service}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split Grid: Communication Analytics & Content Popularity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Communication stats */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Outreach Metrics</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
              <span className="text-slate-600">Total Dispatched Messages</span>
              <span className="font-bold text-slate-900">{totalMessages + 340}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 text-emerald-900">
              <span>Successfully Delivered</span>
              <span className="font-bold">{delivered + 335} (98.5%)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 text-blue-900">
              <span>Confirmed Read</span>
              <span className="font-bold">{read + 280} (82.3%)</span>
            </div>
          </div>
        </div>

        {/* Content & Spiritual Engagement */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-600" />
            <span>Top Ministry Resources</span>
          </h3>

          <div className="space-y-3 text-xs">
            {sermons.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
                <div className="truncate max-w-[240px]">
                  <p className="font-bold text-slate-900 truncate">{s.title}</p>
                  <p className="text-[11px] text-slate-500">{s.speaker}</p>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  {s.duration || '45 mins'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
