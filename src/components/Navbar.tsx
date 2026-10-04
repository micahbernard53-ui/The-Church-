import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  Search, Bell, Cake, WifiOff, ShieldCheck, 
  UserCheck, Sparkles, X, CheckCircle, RefreshCw, 
  Building2, LogOut, ArrowLeftRight, Shield
} from 'lucide-react';
import { UserRole } from '../types';
import { ChurchLogo } from './ChurchLogo';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenBirthdayModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenBirthdayModal }) => {
  const { 
    currentUser, 
    switchUserRole, 
    churchSettings, 
    members, 
    isOffline, 
    prayerRequests, 
    announcements,
    activeView,
    setActiveView,
    logout
  } = useChurch();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Check today's birthdays (month-day matching 10-04)
  const todayBirthdays = members.filter(m => {
    if (!m.dateOfBirth) return false;
    const parts = m.dateOfBirth.split('-');
    return parts[1] === '10' && parts[2] === '04';
  });

  const pendingPrayers = prayerRequests.filter(p => p.status === 'new').length;
  const recentAnnouncements = announcements.slice(0, 3);
  const totalNotifications = pendingPrayers + recentAnnouncements.length;

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Offline Alert Strip */}
      {isOffline && (
        <div className="bg-amber-500 text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5" />
            <span>You are currently offline. Accessing cached devotionals, sermons & member data.</span>
          </div>
          <span className="text-[11px] bg-amber-600 px-2 py-0.5 rounded">Offline Mode</span>
        </div>
      )}

      {/* Birthday Banner Strip if any birthdays today */}
      {todayBirthdays.length > 0 && currentUser.role !== 'member' && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cake className="w-4 h-4 animate-bounce" />
            <span>
              <strong>Celebration Alert:</strong> Today is {todayBirthdays.length} members' birthdays! ({todayBirthdays.map(m => m.firstName).join(', ')})
            </span>
          </div>
          <button
            onClick={onOpenBirthdayModal}
            className="bg-white text-rose-700 hover:bg-rose-50 font-semibold px-2.5 py-0.5 rounded text-[11px] transition-all flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3 h-3" />
            Review & Send Greetings
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Exact Church Brand & Logo */}
        <div 
          onClick={() => setActiveView(currentUser.role === 'member' ? 'member-portal' : 'dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo icon/emblem */}
          <div className="relative w-11 h-11 shrink-0 rounded-2xl bg-white p-0.5 shadow-sm border border-slate-200 flex items-center justify-center overflow-hidden">
            <img 
              src="/church-logo.jpg" 
              alt="The Church Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to vector SVG if raster image fails
                (e.target as HTMLElement).style.display = 'none';
              }} 
            />
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <ChurchLogo variant="icon" size={40} />
            </div>
          </div>

          <div>
            <div className="leading-tight text-lg sm:text-xl font-black flex items-center gap-1.5 tracking-tight">
              <span className="text-[#0a3678]">The</span>
              <span className="text-[#df991d]">Church</span>
              {currentUser.role === 'super_admin' && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded ml-1">Pastor</span>
              )}
              {currentUser.role === 'staff_admin' && (
                <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.5 rounded ml-1">Staff</span>
              )}
              {currentUser.role === 'member' && (
                <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-1.5 py-0.5 rounded ml-1">Member</span>
              )}
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 font-medium tracking-tight truncate max-w-xs">
              Connecting the Church. Caring for People. Growing Together.
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-500 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-lg transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search sermons, scriptures, members, events...</span>
            </div>
            <kbd className="hidden lg:inline-block text-[10px] bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-500">⌘K</kbd>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {totalNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Church Notifications</h4>
                  <button 
                    onClick={() => setShowNotificationMenu(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {todayBirthdays.length > 0 && (
                    <div 
                      onClick={() => { setShowNotificationMenu(false); onOpenBirthdayModal(); }}
                      className="p-3 hover:bg-amber-50 cursor-pointer flex gap-3 items-start"
                    >
                      <Cake className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-900">Today's Birthdays</p>
                        <p className="text-[11px] text-slate-500">{todayBirthdays.length} members celebrating today.</p>
                      </div>
                    </div>
                  )}
                  {pendingPrayers > 0 && (
                    <div 
                      onClick={() => { setShowNotificationMenu(false); setActiveView('prayer-followup'); }}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex gap-3 items-start"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-900">{pendingPrayers} New Prayer Requests</p>
                        <p className="text-[11px] text-slate-500">Awaiting pastoral review and intercession.</p>
                      </div>
                    </div>
                  )}
                  {recentAnnouncements.map(ann => (
                    <div 
                      key={ann.id}
                      onClick={() => { setShowNotificationMenu(false); setActiveView('events'); }}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex gap-3 items-start"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-slate-900 line-clamp-1">{ann.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{ann.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Master Owner Admin Quick Link */}
          <button
            onClick={() => setActiveView('owner-backend')}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 text-xs font-semibold transition-colors cursor-pointer"
            title="Open Platform Owner Backend"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Owner Admin</span>
          </button>

          {/* Role Switcher (Crucial for exploring Pastor, Staff & Member views) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <img 
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'} 
                alt={currentUser.name} 
                className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[120px]">
                  {currentUser.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Experience View</p>
                  <p className="text-xs text-slate-600 font-medium">Explore as any role instantly:</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { switchUserRole('super_admin'); setShowRoleMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${currentUser.role === 'super_admin' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">👑</span>
                      <div>
                        <p className="font-medium">Head Pastor (Admin)</p>
                        <p className="text-[10px] text-slate-400">{churchSettings.pastorName}</p>
                      </div>
                    </div>
                    {currentUser.role === 'super_admin' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => { switchUserRole('staff_admin'); setShowRoleMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${currentUser.role === 'staff_admin' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">👥</span>
                      <div>
                        <p className="font-medium">Staff / Media Admin</p>
                        <p className="text-[10px] text-slate-400">Sarah Jenkins</p>
                      </div>
                    </div>
                    {currentUser.role === 'staff_admin' && <CheckCircle className="w-4 h-4 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => { switchUserRole('member', members[0]?.id); setShowRoleMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${currentUser.role === 'member' ? 'bg-purple-50 text-purple-800 font-semibold' : 'text-slate-700'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📱</span>
                      <div>
                        <p className="font-medium">Member Portal</p>
                        <p className="text-[10px] text-slate-400">{members[0]?.fullName || 'Congregant'}</p>
                      </div>
                    </div>
                    {currentUser.role === 'member' && <CheckCircle className="w-4 h-4 text-purple-600" />}
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  {/* Owner backend entry */}
                  <button
                    onClick={() => { setActiveView('owner-backend'); setShowRoleMenu(false); }}
                    className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 text-amber-800 hover:bg-amber-50 font-semibold"
                  >
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <div>
                      <p>Owner Admin / Backend</p>
                      <p className="text-[10px] text-slate-400 font-normal">Manage all churches & upload logos</p>
                    </div>
                  </button>

                  {/* Switch Church */}
                  <button
                    onClick={() => { setActiveView('login'); setShowRoleMenu(false); }}
                    className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-slate-400" />
                    <span>Switch Church / Sanctuary</span>
                  </button>

                  {/* Logout */}
                  <button
                    onClick={() => { logout(); setShowRoleMenu(false); }}
                    className="w-full text-left px-4 py-2 text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log Out (Lock Session)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
