import React from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  LayoutDashboard, Users, MessageSquareQuote, Send, 
  Calendar, BookOpen, Video, FolderTree, QrCode, 
  HeartHandshake, BarChart3, Settings, ShieldAlert, Sparkles, Compass,
  Building2, ArrowLeftRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, currentUser, churchSettings, members, prayerRequests } = useChurch();

  if (!currentUser) return null;

  // If viewing in member mode, sidebar is hidden on desktop or shows member links
  if (currentUser.role === 'member') {
    return (
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
        <div className="p-4 border-b border-slate-100">
          <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
            <p className="text-xs font-semibold text-purple-900">Member Space</p>
            <p className="text-[11px] text-purple-700">Connected to {churchSettings.churchName}</p>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {[
            { id: 'member-portal', label: 'My Sanctuary', icon: Compass },
            { id: 'bible-devotional', label: 'Daily Word & Bible', icon: BookOpen },
            { id: 'events', label: 'Church Events', icon: Calendar },
            { id: 'sermons-media', label: 'Sermon Library', icon: Video },
            { id: 'prayer-followup', label: 'Prayer & Journal', icon: HeartHandshake },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users, badge: members.length },
    { id: 'ai-messages', label: 'AI Pastoral Assistant', icon: Sparkles, highlight: true },
    { id: 'whatsapp', label: 'WhatsApp Center', icon: Send },
    { id: 'events', label: 'Events & Reminders', icon: Calendar },
    { id: 'bible-devotional', label: 'Daily Word & Bible', icon: BookOpen },
    { id: 'sermons-media', label: 'Sermons & Media', icon: Video },
    { id: 'departments', label: 'Departments & Groups', icon: FolderTree },
    { id: 'attendance', label: 'Attendance & QR', icon: QrCode },
    { id: 'prayer-followup', label: 'Prayer & Follow-ups', icon: HeartHandshake, badge: prayerRequests.filter(p => p.status === 'new').length || undefined },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'settings', label: 'Church Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-3 border-b border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 px-2 py-1">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Church Admin Portal</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">v1.0</span>
        </div>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : item.highlight
                  ? 'text-amber-900 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive 
                    ? 'text-white' 
                    : item.highlight 
                    ? 'text-amber-600' 
                    : 'text-slate-400'
                }`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Pastoral Care Status & Owner Admin Access */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <button
          onClick={() => setActiveView('owner-backend')}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-900 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-bold">Owner Admin Backend</span>
          </div>
          <span className="text-[10px] bg-amber-200/80 px-1 rounded font-semibold">Master</span>
        </button>

        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
            <span className="font-medium">Caring Status</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active
            </span>
          </div>
          <p className="text-[10px] text-slate-500 truncate">
            {churchSettings.pastorName}
          </p>
        </div>
      </div>
    </aside>
  );
};
