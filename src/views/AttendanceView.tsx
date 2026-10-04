import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  QrCode, Users, UserCheck, TrendingUp, Calendar, 
  CheckCircle, Plus, Search, ShieldCheck 
} from 'lucide-react';
import { QRCodeCheckInModal } from '../components/QRCodeCheckInModal';

export const AttendanceView: React.FC = () => {
  const { attendance, events, members } = useChurch();
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');

  const filteredAttendance = selectedEventId === 'all'
    ? attendance
    : attendance.filter(a => a.eventId === selectedEventId);

  const totalAttendees = filteredAttendance.length;
  const firstTimersCount = filteredAttendance.filter(a => a.isFirstTimer).length;
  const regularMembersCount = totalAttendees - firstTimersCount;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Sanctuary Attendance & Check-In</h1>
          <p className="text-xs text-slate-500">Real-time attendance ledger, QR entrance scanning, and visitor assimilation</p>
        </div>

        <button
          onClick={() => setShowQRModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <QrCode className="w-4 h-4 text-teal-400" />
          <span>Launch QR Scanner / Check-in</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Recorded Service Check-ins</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalAttendees}</div>
          <p className="text-[11px] text-teal-700 font-semibold mt-1">Verified via QR & Portal</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">First-Time Visitors</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-700 mt-2">{firstTimersCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Queued for welcome follow-up</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Returning Members</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{regularMembersCount}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Consistent worship attendance</p>
        </div>
      </div>

      {/* Service Filter */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Filter by Service:</span>
        </div>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 outline-hidden"
        >
          <option value="all">All Recent Services</option>
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.title} ({ev.date})</option>
          ))}
        </select>
      </div>

      {/* Attendance Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Service Attendance Records</h3>
          <span className="text-xs text-slate-400">{filteredAttendance.length} Total Check-ins</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3.5">Member Name</th>
                <th className="p-3.5">Service Gathering</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Check-in Time</th>
                <th className="p-3.5">Check-in Mode</th>
                <th className="p-3.5">Visitor Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.map(att => (
                <tr key={att.id} className="hover:bg-slate-50/50">
                  <td className="p-3.5 font-bold text-slate-900">{att.memberName}</td>
                  <td className="p-3.5 text-slate-700">{att.eventName}</td>
                  <td className="p-3.5 text-slate-500 font-mono text-[11px]">{att.eventDate}</td>
                  <td className="p-3.5 text-slate-600 font-mono text-[11px]">{att.checkInTime}</td>
                  <td className="p-3.5">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                      {att.checkInMethod.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {att.isFirstTimer ? (
                      <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        ★ First-Timer
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Regular Member</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <QRCodeCheckInModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  );
};
