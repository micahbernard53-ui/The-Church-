import React, { useState } from 'react';
import { ChurchProvider, useChurch } from './context/ChurchContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { BirthdayModal } from './components/BirthdayModal';
import { QRCodeCheckInModal } from './components/QRCodeCheckInModal';

// Views
import { AdminDashboardView } from './views/AdminDashboardView';
import { MemberPortalView } from './views/MemberPortalView';
import { MembersManagementView } from './views/MembersManagementView';
import { AIPastoralAssistantView } from './views/AIPastoralAssistantView';
import { WhatsAppCenterView } from './views/WhatsAppCenterView';
import { EventsView } from './views/EventsView';
import { BibleDevotionalView } from './views/BibleDevotionalView';
import { SermonsMediaView } from './views/SermonsMediaView';
import { DepartmentsView } from './views/DepartmentsView';
import { AttendanceView } from './views/AttendanceView';
import { PrayerFollowUpView } from './views/PrayerFollowUpView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';
import { OwnerBackendView } from './views/OwnerBackendView';

const MainLayout: React.FC = () => {
  const { activeView, currentUser, isAuthenticated } = useChurch();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // If unauthenticated or activeView is login, start directly with the Login Interface
  if (!isAuthenticated || !currentUser || activeView === 'login') {
    return <LoginView />;
  }

  // If in platform owner master backend mode, display Owner Admin Portal
  if (activeView === 'owner-backend' || currentUser.role === 'platform_owner') {
    return <OwnerBackendView />;
  }

  // Render church views
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <AdminDashboardView
            onOpenBirthdayModal={() => setShowBirthdayModal(true)}
            onOpenQRCheckIn={() => setShowQRModal(true)}
          />
        );
      case 'member-portal':
        return <MemberPortalView />;
      case 'members':
        return <MembersManagementView />;
      case 'ai-messages':
        return <AIPastoralAssistantView />;
      case 'whatsapp':
        return <WhatsAppCenterView />;
      case 'events':
        return <EventsView />;
      case 'bible-devotional':
        return <BibleDevotionalView />;
      case 'sermons-media':
        return <SermonsMediaView />;
      case 'departments':
        return <DepartmentsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'prayer-followup':
        return <PrayerFollowUpView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <AdminDashboardView
            onOpenBirthdayModal={() => setShowBirthdayModal(true)}
            onOpenQRCheckIn={() => setShowQRModal(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenBirthdayModal={() => setShowBirthdayModal(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      <BottomNav />

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />

      <BirthdayModal
        isOpen={showBirthdayModal}
        onClose={() => setShowBirthdayModal(false)}
      />

      <QRCodeCheckInModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ChurchProvider>
      <MainLayout />
    </ChurchProvider>
  );
}

export default App;
