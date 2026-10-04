import React from 'react';
import { useChurch } from '../context/ChurchContext';
import { Home, BookOpen, Calendar, Video, User, LayoutDashboard, Sparkles, Send } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, currentUser } = useChurch();

  if (!currentUser || activeView === 'login' || activeView === 'owner-backend') {
    return null;
  }

  if (currentUser.role === 'member') {
    const items = [
      { id: 'member-portal', label: 'Home', icon: Home },
      { id: 'bible-devotional', label: 'Bible', icon: BookOpen },
      { id: 'events', label: 'Events', icon: Calendar },
      { id: 'sermons-media', label: 'Sermons', icon: Video },
      { id: 'prayer-followup', label: 'Prayer', icon: User },
    ];

    return (
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around pb-safe">
        {items.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive ? 'text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  // Mobile Bottom Navigation for Admin / Pastoral Staff
  const adminItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'ai-messages', label: 'AI Greetings', icon: Sparkles },
    { id: 'whatsapp', label: 'WhatsApp', icon: Send },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'members', label: 'Members', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around pb-safe">
      {adminItems.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
              isActive ? 'text-slate-950 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
