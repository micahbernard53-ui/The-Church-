import React from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  Users, UserPlus, HeartHandshake, Calendar, Cake, Send, 
  Sparkles, CheckCircle, ArrowUpRight, Clock, AlertTriangle, 
  TrendingUp, QrCode, Video, PlusCircle, ShieldCheck
} from 'lucide-react';

interface AdminDashboardViewProps {
  onOpenBirthdayModal: () => void;
  onOpenQRCheckIn: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ 
  onOpenBirthdayModal, 
  onOpenQRCheckIn 
}) => {
  const { 
    churchSettings, 
    members, 
    events, 
    prayerRequests, 
    announcements, 
    whatsAppMessages,
    setActiveView,
    followUps,
    auditLogs
  } = useChurch();

  // Calculate statistics
  const totalMembersCount = 1248; // Baseline congregation count as requested
  const newThisMonth = 43;
  const activeMembersCount = members.filter(m => m.memberStatus === 'active' || m.memberStatus === 'worker').length;
  const pendingPrayers = prayerRequests.filter(p => p.status === 'new').length;
  
  // Today's birthdays (Oct 4)
  const todayBirthdays = members.filter(m => {
    if (!m.dateOfBirth) return false;
    const parts = m.dateOfBirth.split('-');
    return parts[1] === '10' && parts[2] === '04';
  });

  // Absent members requiring care (missed 3 services)
  const absentMembers = members.filter(m => m.memberStatus === 'inactive' || m.id === 'mem-13');

  // WhatsApp delivery statistics
  const totalMessagesSent = whatsAppMessages.length;
  const deliveredMessages = whatsAppMessages.filter(m => m.status === 'delivered' || m.status === 'read').length;
  const deliveryRate = totalMessagesSent > 0 ? Math.round((deliveredMessages / totalMessagesSent) * 100) : 100;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-teal-300 bg-teal-900/60 px-2.5 py-1 rounded-md border border-teal-700/50">
              Sanctuary Leadership Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Good morning, {churchSettings.pastorName.split(' ')[0]} {churchSettings.pastorName.split(' ')[1]} 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Here is your church overview for today. You have {todayBirthdays.length} celebrants, {pendingPrayers} new prayer requests, and Sunday worship preparation underway.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onOpenBirthdayModal}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Cake className="w-4 h-4 text-slate-950" />
              <span>Celebrate Birthdays ({todayBirthdays.length})</span>
            </button>
            <button
              onClick={() => setActiveView('ai-messages')}
              className="bg-white/10 hover:bg-white/20 text-white font-medium text-xs px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>AI Pastoral Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div 
          onClick={() => setActiveView('members')}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Congregation</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalMembersCount.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{newThisMonth} new this month</span>
            </div>
          </div>
        </div>

        {/* Today's Birthdays */}
        <div 
          onClick={onOpenBirthdayModal}
          className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Birthdays</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Cake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{todayBirthdays.length}</div>
            <p className="text-[11px] text-rose-600 font-semibold mt-1">
              Tap to review & dispatch AI greetings
            </p>
          </div>
        </div>

        {/* Prayer Requests */}
        <div 
          onClick={() => setActiveView('prayer-followup')}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Prayer Petitions</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{prayerRequests.length}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {pendingPrayers} pending pastoral review
            </p>
          </div>
        </div>

        {/* WhatsApp Delivery Rate */}
        <div 
          onClick={() => setActiveView('whatsapp')}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">WhatsApp Delivery</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{deliveryRate}%</div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Cloud API Active · Official sender
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts Toolbar */}
      <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Quick Pastoral Operations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          <button
            onClick={onOpenBirthdayModal}
            className="flex flex-col items-center justify-center p-3 bg-white hover:bg-slate-100/80 border border-slate-200 rounded-xl text-center transition-all cursor-pointer"
          >
            <Cake className="w-5 h-5 text-rose-600 mb-1" />
            <span className="text-xs font-semibold text-slate-800">Birthday AI</span>
            <span className="text-[10px] text-slate-400">3 Celebrants</span>
          </button>

          <button
            onClick={() => setActiveView('whatsapp')}
            className="flex flex-col items-center justify-center p-3 bg-white hover:bg-slate-100/80 border border-slate-200 rounded-xl text-center transition-all cursor-pointer"
          >
            <Send className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-xs font-semibold text-slate-800">Broadcast</span>
            <span className="text-[10px] text-slate-400">WhatsApp Blast</span>
          </button>

          <button
            onClick={() => setActiveView('events')}
            className="flex flex-col items-center justify-center p-3 bg-white hover:bg-slate-100/80 border border-slate-200 rounded-xl text-center transition-all cursor-pointer"
          >
            <Calendar className="w-5 h-5 text-purple-600 mb-1" />
            <span className="text-xs font-semibold text-slate-800">Schedule</span>
            <span className="text-[10px] text-slate-400">Sunday Service</span>
          </button>

          <button
            onClick={() => setActiveView('sermons-media')}
            className="flex flex-col items-center justify-center p-3 bg-white hover:bg-slate-100/80 border border-slate-200 rounded-xl text-center transition-all cursor-pointer"
          >
            <Video className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-xs font-semibold text-slate-800">Upload Sermon</span>
            <span className="text-[10px] text-slate-400">Audio & PDF</span>
          </button>

          <button
            onClick={onOpenQRCheckIn}
            className="flex flex-col items-center justify-center p-3 bg-white hover:bg-slate-100/80 border border-slate-200 rounded-xl text-center transition-all cursor-pointer"
          >
            <QrCode className="w-5 h-5 text-slate-800 mb-1" />
            <span className="text-xs font-semibold text-slate-800">QR Check-in</span>
            <span className="text-[10px] text-slate-400">Sanctuary Entrance</span>
          </button>

          <button
            onClick={() => setActiveView('members')}
            className="flex flex-col items-center justify-center p-3 bg-white hover:bg-slate-100/80 border border-slate-200 rounded-xl text-center transition-all cursor-pointer"
          >
            <UserPlus className="w-5 h-5 text-teal-600 mb-1" />
            <span className="text-xs font-semibold text-slate-800">Register</span>
            <span className="text-[10px] text-slate-400">New Member</span>
          </button>
        </div>
      </div>

      {/* Split Section: Today's Celebrants & Absent Member Care */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Celebrants Spotlight */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                <Cake className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today's Celebrants ({todayBirthdays.length})</h3>
                <p className="text-xs text-slate-500">October 4th, 2026</p>
              </div>
            </div>
            <button
              onClick={onOpenBirthdayModal}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
            >
              Open Birthday Center →
            </button>
          </div>

          <div className="space-y-3">
            {todayBirthdays.map(m => (
              <div 
                key={m.id} 
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-rose-50/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={m.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                    alt={m.fullName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-100" 
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{m.fullName}</h4>
                    <p className="text-[11px] text-slate-500">{m.departmentName} · {m.phoneNumber}</p>
                  </div>
                </div>
                <button
                  onClick={onOpenBirthdayModal}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-rose-600" />
                  <span>Bless Member</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Absent Member Care & Pastoral Follow-Up */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Absent Member Care Alert</h3>
                <p className="text-xs text-slate-500">Members needing loving follow-up</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('prayer-followup')}
              className="text-xs text-amber-700 hover:text-amber-900 font-semibold"
            >
              View All Follow-ups →
            </button>
          </div>

          <div className="space-y-3">
            {absentMembers.slice(0, 2).map(m => (
              <div 
                key={m.id}
                className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={m.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{m.fullName}</p>
                      <p className="text-[11px] text-amber-900 font-medium">Missed last 3 Sunday services</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-200/80 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                    Welfare Care
                  </span>
                </div>
                <p className="text-xs text-slate-600 bg-white/80 p-2 rounded-lg border border-amber-100">
                  "Dear Marcus, we missed your warm presence at Sunday service! Praying for God's strength over your week..."
                </p>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setActiveView('ai-messages')}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Caring WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Countdown Strip */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Upcoming Services & Gatherings</h3>
            <p className="text-xs text-slate-500">Automated WhatsApp & in-app reminders active</p>
          </div>
          <button
            onClick={() => setActiveView('events')}
            className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
          >
            Manage Events →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.slice(0, 3).map((event, idx) => {
            const countdownBadge = idx === 0 ? 'Tomorrow, 09:00 AM' : idx === 1 ? 'In 3 days' : 'In 6 days';
            return (
              <div 
                key={event.id}
                className="border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                      {event.category.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {countdownBadge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">{event.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{event.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                  <span>Minister: {event.speaker.split(' ')[0]} {event.speaker.split(' ')[1]}</span>
                  <span className="font-semibold">{event.registeredCount || 380} Expected</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Church Audit Activity Log */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Recent Ministry Activity & Audit Trail</h3>
        <div className="divide-y divide-slate-100 text-xs">
          {auditLogs.slice(0, 4).map(log => (
            <div key={log.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                <div>
                  <span className="font-semibold text-slate-800">{log.action}</span>
                  <span className="text-slate-500 ml-1.5">— {log.details}</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
