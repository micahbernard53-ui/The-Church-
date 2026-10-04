import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, ChurchTenant, Member, Department, ChurchEvent, 
  Devotional, Sermon, DocumentItem, GalleryItem, Announcement, 
  PrayerRequest, PrayerJournalEntry, PastoralFollowUp, AttendanceRecord,
  WhatsAppConfig, WhatsAppTemplate, WhatsAppMessage, WhatsAppCampaign, 
  ChurchSettings, AuditLog, ReadingPlan 
} from '../types';
import {
  INITIAL_TENANTS, INITIAL_SETTINGS, INITIAL_DEPARTMENTS, INITIAL_MEMBERS, 
  INITIAL_EVENTS, INITIAL_DEVOTIONALS, INITIAL_SERMONS, 
  INITIAL_DOCUMENTS, INITIAL_GALLERY, INITIAL_ANNOUNCEMENTS, 
  INITIAL_PRAYER_REQUESTS, INITIAL_FOLLOW_UPS, INITIAL_WHATSAPP_CONFIG, 
  INITIAL_WHATSAPP_TEMPLATES, INITIAL_WHATSAPP_MESSAGES, 
  INITIAL_AUDIT_LOGS, INITIAL_READING_PLANS 
} from '../mockData';

interface ChurchContextType {
  // Multi-Tenant Management
  tenants: ChurchTenant[];
  activeTenantId: string;
  activeTenant: ChurchTenant;
  switchTenant: (tenantId: string) => void;
  createTenant: (tenantData: Omit<ChurchTenant, 'id' | 'createdAt'>) => ChurchTenant;
  updateTenant: (tenantId: string, updates: Partial<ChurchTenant>) => void;
  deleteTenant: (tenantId: string) => void;

  // Authentication & Session
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (params: { tenantId?: string; role: UserRole; email: string; password?: string; memberId?: string; name?: string }) => boolean;
  logout: () => void;
  switchUserRole: (role: UserRole, memberId?: string) => void;

  // Tenant-Scoped Data
  churchSettings: ChurchSettings;
  updateChurchSettings: (settings: Partial<ChurchSettings>) => void;
  members: Member[];
  addMember: (member: Omit<Member, 'id'>) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  importMembers: (newMembers: Omit<Member, 'id'>[]) => void;
  departments: Department[];
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  events: ChurchEvent[];
  addEvent: (event: Omit<ChurchEvent, 'id' | 'registeredCount' | 'remindersSent'>) => void;
  updateEvent: (id: string, updates: Partial<ChurchEvent>) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (eventId: string, memberId: string) => void;
  attendance: AttendanceRecord[];
  recordAttendance: (record: Omit<AttendanceRecord, 'id' | 'checkInTime'>) => void;
  devotionals: Devotional[];
  addDevotional: (dev: Omit<Devotional, 'id' | 'likes'>) => void;
  likeDevotional: (id: string) => void;
  sermons: Sermon[];
  addSermon: (sermon: Omit<Sermon, 'id'>) => void;
  documents: DocumentItem[];
  addDocument: (doc: Omit<DocumentItem, 'id' | 'downloadCount' | 'uploadedDate'>) => void;
  announcements: Announcement[];
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'publishedDate' | 'readCount'>) => void;
  deleteAnnouncement: (id: string) => void;
  prayerRequests: PrayerRequest[];
  submitPrayerRequest: (req: Omit<PrayerRequest, 'id' | 'submittedAt' | 'status'>) => void;
  updatePrayerRequestStatus: (id: string, status: PrayerRequest['status'], pastoralNotes?: string) => void;
  prayerJournal: PrayerJournalEntry[];
  addPrayerJournalEntry: (entry: Omit<PrayerJournalEntry, 'id' | 'dateCreated' | 'answered'>) => void;
  togglePrayerJournalAnswered: (id: string) => void;
  deletePrayerJournalEntry: (id: string) => void;
  followUps: PastoralFollowUp[];
  addFollowUp: (fu: Omit<PastoralFollowUp, 'id'>) => void;
  updateFollowUp: (id: string, updates: Partial<PastoralFollowUp>) => void;
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  whatsAppConfig: WhatsAppConfig;
  updateWhatsAppConfig: (config: Partial<WhatsAppConfig>) => Promise<boolean>;
  whatsAppTemplates: WhatsAppTemplate[];
  whatsAppMessages: WhatsAppMessage[];
  sendWhatsAppMessage: (msg: { recipientName: string; recipientPhone: string; messageText: string; messageType: WhatsAppMessage['messageType']; memberId?: string }) => Promise<boolean>;
  whatsAppCampaigns: WhatsAppCampaign[];
  createWhatsAppCampaign: (campaign: Omit<WhatsAppCampaign, 'id' | 'status' | 'deliveredCount' | 'readCount' | 'failedCount'>) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, details: string) => void;
  readingPlans: ReadingPlan[];
  toggleReadingPlanDay: (planId: string, day: number) => void;
  isOffline: boolean;
  activeView: string;
  setActiveView: (view: string) => void;
  resetDemoData: () => void;

  // AI Helpers
  generateAIGreeting: (params: { occasion: string; recipientName: string; tone?: string; department?: string; customNotes?: string; length?: string }) => Promise<string>;
  analyzeSermonAI: (params: { title: string; speaker: string; bibleReferences: string[]; contentOrNotes?: string }) => Promise<any>;
  generateDevotionalAI: (params: { scripture?: string; topic?: string }) => Promise<any>;
}

const ChurchContext = createContext<ChurchContextType | null>(null);

export const ChurchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Multi-Tenant Churches List
  const [tenants, setTenants] = useState<ChurchTenant[]>(() => {
    const saved = localStorage.getItem('the_church_tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });

  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    const saved = localStorage.getItem('the_church_active_tenant_id');
    return saved || 'tenant-1';
  });

  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];

  // 2. Authentication: App starts with Login Interface if not logged in
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('the_church_user');
    return saved ? JSON.parse(saved) : null; // Starts unauthenticated
  });

  const isAuthenticated = Boolean(currentUser);
  const [activeView, setActiveView] = useState<string>(() => {
    if (!currentUser) return 'login';
    if (currentUser.role === 'platform_owner') return 'owner-backend';
    if (currentUser.role === 'member') return 'member-portal';
    return 'dashboard';
  });

  // 3. Isolated State per Tenant
  const getStorageKey = (key: string) => `tenant_${activeTenantId}_${key}`;

  const [churchSettings, setChurchSettings] = useState<ChurchSettings>(() => {
    const saved = localStorage.getItem(getStorageKey('settings'));
    if (saved) return JSON.parse(saved);
    return {
      ...INITIAL_SETTINGS,
      churchName: activeTenant.name,
      slogan: activeTenant.slogan,
      logoUrl: activeTenant.logoUrl,
      address: activeTenant.address,
      phone: activeTenant.phone,
      email: activeTenant.email,
      website: activeTenant.website,
      pastorName: activeTenant.pastorName,
      pastorEmail: activeTenant.pastorEmail,
      primaryColor: activeTenant.primaryColor,
      secondaryColor: activeTenant.secondaryColor,
    };
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(getStorageKey('members'));
    if (saved) return JSON.parse(saved);
    if (activeTenantId === 'tenant-1') return INITIAL_MEMBERS;
    // Generate starter isolated members for other tenants
    return [
      {
        id: `mem-${activeTenantId}-1`,
        fullName: `${activeTenant.pastorName}`,
        firstName: activeTenant.pastorName.split(' ')[1] || activeTenant.pastorName,
        lastName: activeTenant.pastorName.split(' ')[2] || '',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        gender: 'male',
        dateOfBirth: '1980-05-12',
        phoneNumber: activeTenant.phone,
        whatsAppNumber: activeTenant.phone.replace(/[^0-9]/g, ''),
        email: activeTenant.pastorEmail,
        residentialAddress: activeTenant.address,
        occupation: 'Senior Pastor',
        maritalStatus: 'married',
        dateJoined: '2020-01-01',
        baptismStatus: 'baptized',
        departmentId: 'dept-1',
        departmentName: 'Pastoral Council',
        cellGroup: 'Sanctuary Cell',
        emergencyContact: { name: 'Church Office', relationship: 'Ministry', phone: activeTenant.phone },
        memberStatus: 'worker',
        notes: `Senior leader of ${activeTenant.name}.`,
        privacy: { showPhone: true, showEmail: true, showBirthday: true, showAddress: false, showPhoto: true },
        journey: { dateJoined: '2020-01-01', completedDiscipleship: true },
      },
      {
        id: `mem-${activeTenantId}-2`,
        fullName: 'Grace Johnson',
        firstName: 'Grace',
        lastName: 'Johnson',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        gender: 'female',
        dateOfBirth: '1992-10-04', // Birthday Today!
        phoneNumber: '+1-555-0322',
        whatsAppNumber: '+15550322',
        email: 'grace.j@example.com',
        residentialAddress: '88 Faith Crescent',
        occupation: 'Teacher',
        maritalStatus: 'single',
        dateJoined: '2022-03-15',
        baptismStatus: 'baptized',
        departmentId: 'dept-1',
        departmentName: 'Sanctuary Choir',
        cellGroup: 'Youth Fellowship',
        emergencyContact: { name: 'Peter Johnson', relationship: 'Father', phone: '+1-555-0323' },
        memberStatus: 'active',
        notes: 'Choir member and worker.',
        privacy: { showPhone: true, showEmail: true, showBirthday: true, showAddress: false, showPhoto: true },
        journey: { dateJoined: '2022-03-15', completedDiscipleship: true },
      }
    ];
  });

  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem(getStorageKey('departments'));
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [events, setEvents] = useState<ChurchEvent[]>(() => {
    const saved = localStorage.getItem(getStorageKey('events'));
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(getStorageKey('attendance'));
    return saved ? JSON.parse(saved) : [
      { id: `att-${activeTenantId}-1`, eventId: 'evt-1', eventName: 'Sunday Celebration Service', eventDate: '2026-09-28', memberId: `mem-${activeTenantId}-1`, memberName: activeTenant.pastorName, checkInTime: '08:45 AM', checkInMethod: 'qr_code', isFirstTimer: false },
    ];
  });

  const [devotionals, setDevotionals] = useState<Devotional[]>(() => {
    const saved = localStorage.getItem(getStorageKey('devotionals'));
    return saved ? JSON.parse(saved) : INITIAL_DEVOTIONALS;
  });

  const [sermons, setSermons] = useState<Sermon[]>(() => {
    const saved = localStorage.getItem(getStorageKey('sermons'));
    return saved ? JSON.parse(saved) : INITIAL_SERMONS;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem(getStorageKey('documents'));
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(getStorageKey('announcements'));
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(() => {
    const saved = localStorage.getItem(getStorageKey('prayer_requests'));
    return saved ? JSON.parse(saved) : INITIAL_PRAYER_REQUESTS;
  });

  const [prayerJournal, setPrayerJournal] = useState<PrayerJournalEntry[]>(() => {
    const saved = localStorage.getItem(getStorageKey('prayer_journal'));
    return saved ? JSON.parse(saved) : [
      { id: 'pj-1', title: 'Wisdom for Career Transition', content: 'Seeking the Lord for clarity on leading the tech outreach initiative. Praying for peace in my spirit.', answered: false, dateCreated: '2026-10-01', scripture: 'James 1:5' },
      { id: 'pj-2', title: 'Healing for Aunt Margaret', content: 'Believing God for speedy recovery and normal lab results.', answered: true, dateCreated: '2026-09-15', answeredDate: '2026-09-29', scripture: 'Jeremiah 30:17' },
    ];
  });

  const [followUps, setFollowUps] = useState<PastoralFollowUp[]>(() => {
    const saved = localStorage.getItem(getStorageKey('follow_ups'));
    return saved ? JSON.parse(saved) : INITIAL_FOLLOW_UPS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem(getStorageKey('gallery'));
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [whatsAppConfig, setWhatsAppConfig] = useState<WhatsAppConfig>(() => {
    const saved = localStorage.getItem(getStorageKey('whatsapp_config'));
    if (saved) return JSON.parse(saved);
    return {
      ...INITIAL_WHATSAPP_CONFIG,
      businessName: `${activeTenant.name} Official`,
      verifiedNumber: activeTenant.phone,
    };
  });

  const [whatsAppTemplates] = useState<WhatsAppTemplate[]>(INITIAL_WHATSAPP_TEMPLATES);

  const [whatsAppMessages, setWhatsAppMessages] = useState<WhatsAppMessage[]>(() => {
    const saved = localStorage.getItem(getStorageKey('whatsapp_messages'));
    return saved ? JSON.parse(saved) : INITIAL_WHATSAPP_MESSAGES;
  });

  const [whatsAppCampaigns, setWhatsAppCampaigns] = useState<WhatsAppCampaign[]>([
    {
      id: 'cmp-1',
      title: 'October Birthdays Celebration Broadcast',
      targetSegment: 'October Celebrants',
      recipientCount: 3,
      messageTemplate: 'pastoral_birthday_blessing',
      status: 'completed',
      scheduledTime: '2026-10-04 07:00 AM',
      sentTime: '2026-10-04 07:15 AM',
      deliveredCount: 3,
      readCount: 2,
      failedCount: 0,
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(getStorageKey('audit_logs'));
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [readingPlans, setReadingPlans] = useState<ReadingPlan[]>(() => {
    const saved = localStorage.getItem(getStorageKey('reading_plans'));
    return saved ? JSON.parse(saved) : INITIAL_READING_PLANS;
  });

  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save Tenant Lists
  useEffect(() => {
    localStorage.setItem('the_church_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('the_church_active_tenant_id', activeTenantId);
  }, [activeTenantId]);

  // Save Current User
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('the_church_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('the_church_user');
    }
  }, [currentUser]);

  // Re-load tenant data whenever activeTenantId changes
  const reloadTenantData = (tenantId: string) => {
    const t = tenants.find(item => item.id === tenantId) || tenants[0];
    const key = (k: string) => `tenant_${tenantId}_${k}`;

    const savedSettings = localStorage.getItem(key('settings'));
    if (savedSettings) {
      setChurchSettings(JSON.parse(savedSettings));
    } else {
      setChurchSettings({
        ...INITIAL_SETTINGS,
        churchName: t.name,
        slogan: t.slogan,
        logoUrl: t.logoUrl,
        address: t.address,
        phone: t.phone,
        email: t.email,
        website: t.website,
        pastorName: t.pastorName,
        pastorEmail: t.pastorEmail,
        primaryColor: t.primaryColor,
        secondaryColor: t.secondaryColor,
      });
    }

    const savedMembers = localStorage.getItem(key('members'));
    setMembers(savedMembers ? JSON.parse(savedMembers) : (tenantId === 'tenant-1' ? INITIAL_MEMBERS : []));

    const savedEvents = localStorage.getItem(key('events'));
    setEvents(savedEvents ? JSON.parse(savedEvents) : INITIAL_EVENTS);

    const savedDepts = localStorage.getItem(key('departments'));
    setDepartments(savedDepts ? JSON.parse(savedDepts) : INITIAL_DEPARTMENTS);

    const savedAtt = localStorage.getItem(key('attendance'));
    setAttendance(savedAtt ? JSON.parse(savedAtt) : []);

    const savedDev = localStorage.getItem(key('devotionals'));
    setDevotionals(savedDev ? JSON.parse(savedDev) : INITIAL_DEVOTIONALS);

    const savedSermons = localStorage.getItem(key('sermons'));
    setSermons(savedSermons ? JSON.parse(savedSermons) : INITIAL_SERMONS);

    const savedPrayers = localStorage.getItem(key('prayer_requests'));
    setPrayerRequests(savedPrayers ? JSON.parse(savedPrayers) : INITIAL_PRAYER_REQUESTS);

    const savedWhatsApp = localStorage.getItem(key('whatsapp_messages'));
    setWhatsAppMessages(savedWhatsApp ? JSON.parse(savedWhatsApp) : []);
  };

  // Sync state to local storage under tenant isolation
  useEffect(() => {
    localStorage.setItem(getStorageKey('settings'), JSON.stringify(churchSettings));
  }, [churchSettings, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(getStorageKey('members'), JSON.stringify(members));
  }, [members, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(getStorageKey('events'), JSON.stringify(events));
  }, [events, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(getStorageKey('whatsapp_messages'), JSON.stringify(whatsAppMessages));
  }, [whatsAppMessages, activeTenantId]);

  useEffect(() => {
    localStorage.setItem(getStorageKey('prayer_requests'), JSON.stringify(prayerRequests));
  }, [prayerRequests, activeTenantId]);

  const switchTenant = (tenantId: string) => {
    setActiveTenantId(tenantId);
    reloadTenantData(tenantId);
    addAuditLog('Church Tenant Switched', `Switched active church to ${tenantId}.`);
  };

  // 4. Multi-Tenant Creation & Management (Owner Admin)
  const createTenant = (tenantData: Omit<ChurchTenant, 'id' | 'createdAt'>): ChurchTenant => {
    const newId = `tenant-${Date.now()}`;
    const newTenant: ChurchTenant = {
      ...tenantData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
      memberCount: tenantData.memberCount || 1,
    };

    setTenants(prev => [...prev, newTenant]);

    // Initialize isolated church settings
    const initialTenantSettings: ChurchSettings = {
      churchName: newTenant.name,
      slogan: newTenant.slogan,
      logoUrl: newTenant.logoUrl || '/church-logo.jpg',
      address: newTenant.address,
      phone: newTenant.phone,
      email: newTenant.email,
      website: newTenant.website,
      pastorName: newTenant.pastorName,
      pastorEmail: newTenant.pastorEmail,
      primaryColor: newTenant.primaryColor || '#0a3678',
      secondaryColor: newTenant.secondaryColor || '#df991d',
      socialLinks: {},
      serviceTimes: [
        { day: 'Sunday', name: 'Worship Celebration', time: '09:30 AM' },
        { day: 'Wednesday', name: 'Bible Study', time: '06:30 PM' },
      ],
      setupCompleted: true,
    };

    localStorage.setItem(`tenant_${newId}_settings`, JSON.stringify(initialTenantSettings));
    return newTenant;
  };

  const updateTenant = (tenantId: string, updates: Partial<ChurchTenant>) => {
    setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, ...updates } : t));
    if (tenantId === activeTenantId) {
      setChurchSettings(prev => ({
        ...prev,
        churchName: updates.name !== undefined ? updates.name : prev.churchName,
        slogan: updates.slogan !== undefined ? updates.slogan : prev.slogan,
        logoUrl: updates.logoUrl !== undefined ? updates.logoUrl : prev.logoUrl,
        address: updates.address !== undefined ? updates.address : prev.address,
        phone: updates.phone !== undefined ? updates.phone : prev.phone,
        email: updates.email !== undefined ? updates.email : prev.email,
        website: updates.website !== undefined ? updates.website : prev.website,
        pastorName: updates.pastorName !== undefined ? updates.pastorName : prev.pastorName,
        pastorEmail: updates.pastorEmail !== undefined ? updates.pastorEmail : prev.pastorEmail,
        primaryColor: updates.primaryColor !== undefined ? updates.primaryColor : prev.primaryColor,
        secondaryColor: updates.secondaryColor !== undefined ? updates.secondaryColor : prev.secondaryColor,
      }));
    }
  };

  const deleteTenant = (tenantId: string) => {
    if (tenants.length <= 1) return;
    setTenants(prev => prev.filter(t => t.id !== tenantId));
    if (activeTenantId === tenantId) {
      const fallback = tenants.find(t => t.id !== tenantId) || tenants[0];
      switchTenant(fallback.id);
    }
  };

  // 5. Authentication & Login
  const login = (params: { tenantId?: string; role: UserRole; email: string; password?: string; memberId?: string; name?: string }): boolean => {
    const targetTenantId = params.tenantId || activeTenantId || 'tenant-1';
    const targetTenant = tenants.find(t => t.id === targetTenantId) || tenants[0];

    setActiveTenantId(targetTenantId);
    reloadTenantData(targetTenantId);

    if (params.role === 'platform_owner') {
      const ownerUser: User = {
        id: 'usr-owner-root',
        name: 'Master Platform Administrator',
        email: params.email || 'admin@thechurchplatform.com',
        phone: '+1 (800) 555-CHURCH',
        role: 'platform_owner',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      };
      setCurrentUser(ownerUser);
      setActiveView('owner-backend');
      return true;
    }

    if (params.role === 'super_admin' || params.role === 'staff_admin') {
      const adminUser: User = {
        id: `usr-admin-${targetTenantId}`,
        name: params.name || targetTenant.pastorName,
        email: params.email || targetTenant.pastorEmail,
        phone: targetTenant.phone,
        role: params.role,
        tenantId: targetTenantId,
        memberId: `mem-${targetTenantId}-1`,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      };
      setCurrentUser(adminUser);
      setActiveView('dashboard');
      return true;
    }

    // Member Login
    const targetMember = members.find(m => m.id === params.memberId || m.email.toLowerCase() === params.email.toLowerCase()) || members[0];
    const memberUser: User = {
      id: `usr-mem-${targetMember.id}`,
      name: targetMember.fullName,
      email: targetMember.email,
      phone: targetMember.phoneNumber,
      role: 'member',
      tenantId: targetTenantId,
      memberId: targetMember.id,
      avatarUrl: targetMember.avatarUrl,
    };
    setCurrentUser(memberUser);
    setActiveView('member-portal');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('the_church_user');
    setActiveView('login');
  };

  const switchUserRole = (role: UserRole, memberId?: string) => {
    if (!currentUser) return;
    if (role === 'platform_owner') {
      setCurrentUser({
        ...currentUser,
        role: 'platform_owner',
      });
      setActiveView('owner-backend');
    } else if (role === 'super_admin') {
      setCurrentUser({
        ...currentUser,
        role: 'super_admin',
      });
      setActiveView('dashboard');
    } else if (role === 'staff_admin') {
      setCurrentUser({
        ...currentUser,
        role: 'staff_admin',
      });
      setActiveView('dashboard');
    } else {
      const selectedMember = members.find(m => m.id === memberId) || members[0];
      setCurrentUser({
        id: `usr-${selectedMember?.id || 'mem'}`,
        name: selectedMember?.fullName || 'Church Member',
        email: selectedMember?.email || 'member@thechurch.org',
        phone: selectedMember?.phoneNumber || '+1 555-0100',
        role: 'member',
        tenantId: activeTenantId,
        memberId: selectedMember?.id,
        avatarUrl: selectedMember?.avatarUrl,
      });
      setActiveView('member-portal');
    }
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userName: currentUser ? currentUser.name : 'System Automation',
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const updateChurchSettings = (updates: Partial<ChurchSettings>) => {
    setChurchSettings(prev => {
      const next = { ...prev, ...updates };
      // Also sync to active tenant record
      updateTenant(activeTenantId, {
        name: updates.churchName !== undefined ? updates.churchName : activeTenant.name,
        slogan: updates.slogan !== undefined ? updates.slogan : activeTenant.slogan,
        logoUrl: updates.logoUrl !== undefined ? updates.logoUrl : activeTenant.logoUrl,
        address: updates.address !== undefined ? updates.address : activeTenant.address,
        phone: updates.phone !== undefined ? updates.phone : activeTenant.phone,
        email: updates.email !== undefined ? updates.email : activeTenant.email,
        website: updates.website !== undefined ? updates.website : activeTenant.website,
        pastorName: updates.pastorName !== undefined ? updates.pastorName : activeTenant.pastorName,
        pastorEmail: updates.pastorEmail !== undefined ? updates.pastorEmail : activeTenant.pastorEmail,
        primaryColor: updates.primaryColor !== undefined ? updates.primaryColor : activeTenant.primaryColor,
        secondaryColor: updates.secondaryColor !== undefined ? updates.secondaryColor : activeTenant.secondaryColor,
      });
      addAuditLog('Settings Updated', 'Church branding or profile updated.');
      return next;
    });
  };

  const addMember = (newMemData: Omit<Member, 'id'>): Member => {
    const newMember: Member = {
      ...newMemData,
      id: `mem-${activeTenantId}-${Date.now()}`,
    };
    setMembers(prev => [newMember, ...prev]);
    // update tenant member count
    updateTenant(activeTenantId, { memberCount: members.length + 1 });
    addAuditLog('Member Registered', `Registered ${newMember.fullName} (${newMember.departmentName}).`);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    addAuditLog('Member Updated', `Updated profile of member ID: ${id}.`);
  };

  const deleteMember = (id: string) => {
    const target = members.find(m => m.id === id);
    setMembers(prev => prev.filter(m => m.id !== id));
    updateTenant(activeTenantId, { memberCount: Math.max(1, members.length - 1) });
    addAuditLog('Member Deleted', `Removed ${target?.fullName || id} from directory.`);
  };

  const importMembers = (newMembers: Omit<Member, 'id'>[]) => {
    const formatted = newMembers.map((m, idx) => ({
      ...m,
      id: `mem-import-${activeTenantId}-${Date.now()}-${idx}`,
    }));
    setMembers(prev => [...formatted, ...prev]);
    updateTenant(activeTenantId, { memberCount: members.length + newMembers.length });
    addAuditLog('Members Batch Imported', `Imported ${newMembers.length} members via CSV/Excel.`);
  };

  const addDepartment = (dept: Omit<Department, 'id'>) => {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now()}`,
    };
    setDepartments(prev => [...prev, newDept]);
    addAuditLog('Department Created', `Created department ${dept.name}.`);
  };

  const addEvent = (eventData: Omit<ChurchEvent, 'id' | 'registeredCount' | 'remindersSent'>) => {
    const newEvent: ChurchEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      registeredCount: 0,
      remindersSent: [],
    };
    setEvents(prev => [newEvent, ...prev]);
    addAuditLog('Event Scheduled', `Created ${newEvent.title} for ${newEvent.date}.`);
  };

  const updateEvent = (id: string, updates: Partial<ChurchEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addAuditLog('Event Updated', `Updated event ID: ${id}.`);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    addAuditLog('Event Cancelled', `Removed event ID: ${id}.`);
  };

  const registerForEvent = (eventId: string, memberId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, registeredCount: e.registeredCount + 1 };
      }
      return e;
    }));
    addAuditLog('Event Registration', `Member ${memberId} registered for event ${eventId}.`);
  };

  const recordAttendance = (record: Omit<AttendanceRecord, 'id' | 'checkInTime'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
      checkInTime: timeStr,
    };
    setAttendance(prev => [newRecord, ...prev]);
    addAuditLog('Attendance Recorded', `${record.memberName} checked in for ${record.eventName} via ${record.checkInMethod}.`);
  };

  const addDevotional = (dev: Omit<Devotional, 'id' | 'likes'>) => {
    const newDev: Devotional = {
      ...dev,
      id: `dev-${Date.now()}`,
      likes: 0,
    };
    setDevotionals(prev => [newDev, ...prev]);
    addAuditLog('Devotional Published', `Published daily word: "${dev.title}".`);
  };

  const likeDevotional = (id: string) => {
    setDevotionals(prev => prev.map(d => d.id === id ? { ...d, likes: d.likes + 1 } : d));
  };

  const addSermon = (sermonData: Omit<Sermon, 'id'>) => {
    const newSermon: Sermon = {
      ...sermonData,
      id: `sermon-${Date.now()}`,
    };
    setSermons(prev => [newSermon, ...prev]);
    addAuditLog('Sermon Uploaded', `Uploaded sermon "${sermonData.title}" by ${sermonData.speaker}.`);
  };

  const addDocument = (docData: Omit<DocumentItem, 'id' | 'downloadCount' | 'uploadedDate'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      downloadCount: 0,
      uploadedDate: new Date().toISOString().split('T')[0],
    };
    setDocuments(prev => [newDoc, ...prev]);
    addAuditLog('Document Uploaded', `Added ${newDoc.title} to digital library.`);
  };

  const addAnnouncement = (annData: Omit<Announcement, 'id' | 'publishedDate' | 'readCount'>) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      publishedDate: new Date().toISOString().split('T')[0],
      readCount: 0,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    addAuditLog('Announcement Published', `Published announcement: ${newAnn.title}.`);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    addAuditLog('Announcement Deleted', `Deleted announcement ID: ${id}.`);
  };

  const submitPrayerRequest = (reqData: Omit<PrayerRequest, 'id' | 'submittedAt' | 'status'>) => {
    const newReq: PrayerRequest = {
      ...reqData,
      id: `pr-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'new',
    };
    setPrayerRequests(prev => [newReq, ...prev]);
    addAuditLog('Prayer Request Submitted', `Submitted prayer request (${newReq.category}) - ${newReq.isAnonymous ? 'Anonymous' : newReq.memberName}.`);
  };

  const updatePrayerRequestStatus = (id: string, status: PrayerRequest['status'], pastoralNotes?: string) => {
    setPrayerRequests(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status,
          pastoralNotes: pastoralNotes !== undefined ? pastoralNotes : p.pastoralNotes,
        };
      }
      return p;
    }));
    addAuditLog('Prayer Status Updated', `Prayer request ${id} updated to status "${status}".`);
  };

  const addPrayerJournalEntry = (entry: Omit<PrayerJournalEntry, 'id' | 'dateCreated' | 'answered'>) => {
    const newEntry: PrayerJournalEntry = {
      ...entry,
      id: `pj-${Date.now()}`,
      dateCreated: new Date().toISOString().split('T')[0],
      answered: false,
    };
    setPrayerJournal(prev => [newEntry, ...prev]);
  };

  const togglePrayerJournalAnswered = (id: string) => {
    setPrayerJournal(prev => prev.map(pj => {
      if (pj.id === id) {
        const nextAnswered = !pj.answered;
        return {
          ...pj,
          answered: nextAnswered,
          answeredDate: nextAnswered ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return pj;
    }));
  };

  const deletePrayerJournalEntry = (id: string) => {
    setPrayerJournal(prev => prev.filter(pj => pj.id !== id));
  };

  const addFollowUp = (fu: Omit<PastoralFollowUp, 'id'>) => {
    const newFu: PastoralFollowUp = {
      ...fu,
      id: `fu-${Date.now()}`,
    };
    setFollowUps(prev => [newFu, ...prev]);
    addAuditLog('Follow-up Created', `Assigned ${newFu.type} for ${newFu.memberName} to ${newFu.assignedToName}.`);
  };

  const updateFollowUp = (id: string, updates: Partial<PastoralFollowUp>) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
    addAuditLog('Follow-up Updated', `Updated follow-up ID: ${id}.`);
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
    };
    setGallery(prev => [newItem, ...prev]);
  };

  const updateWhatsAppConfig = async (newConfig: Partial<WhatsAppConfig>): Promise<boolean> => {
    try {
      const merged = { ...whatsAppConfig, ...newConfig };
      setWhatsAppConfig(merged);
      localStorage.setItem(getStorageKey('whatsapp_config'), JSON.stringify(merged));

      await fetch('/api/whatsapp/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig),
      });

      addAuditLog('WhatsApp Config Updated', 'Updated WhatsApp Cloud API settings.');
      return true;
    } catch (e) {
      console.error('Failed to update WhatsApp config:', e);
      return false;
    }
  };

  const sendWhatsAppMessage = async (msg: { 
    recipientName: string; 
    recipientPhone: string; 
    messageText: string; 
    messageType: WhatsAppMessage['messageType']; 
    memberId?: string 
  }): Promise<boolean> => {
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: msg.recipientName,
          recipientPhone: msg.recipientPhone,
          messageText: msg.messageText,
        }),
      });

      const resData = await response.json();

      const newMsg: WhatsAppMessage = {
        id: resData.messageId || `wmsg-${Date.now()}`,
        recipientName: msg.recipientName,
        recipientPhone: msg.recipientPhone,
        memberId: msg.memberId,
        messageType: msg.messageType,
        messageText: msg.messageText,
        status: resData.status || 'delivered',
        timestamp: new Date().toISOString(),
      };

      setWhatsAppMessages(prev => [newMsg, ...prev]);
      addAuditLog('WhatsApp Message Sent', `Sent message to ${msg.recipientName} (${msg.recipientPhone}). Status: ${newMsg.status}.`);
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  };

  const createWhatsAppCampaign = (campaignData: Omit<WhatsAppCampaign, 'id' | 'status' | 'deliveredCount' | 'readCount' | 'failedCount'>) => {
    const newCamp: WhatsAppCampaign = {
      ...campaignData,
      id: `cmp-${Date.now()}`,
      status: 'scheduled',
      deliveredCount: 0,
      readCount: 0,
      failedCount: 0,
    };
    setWhatsAppCampaigns(prev => [newCamp, ...prev]);
    addAuditLog('WhatsApp Campaign Created', `Scheduled campaign "${newCamp.title}".`);
  };

  const toggleReadingPlanDay = (planId: string, day: number) => {
    setReadingPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const completed = p.completedDays.includes(day)
          ? p.completedDays.filter(d => d !== day)
          : [...p.completedDays, day];
        return {
          ...p,
          completedDays: completed,
          currentDay: Math.min(p.totalDays, Math.max(1, Math.max(...completed, 0) + 1)),
        };
      }
      return p;
    }));
  };

  const resetDemoData = () => {
    localStorage.clear();
    setTenants(INITIAL_TENANTS);
    setActiveTenantId('tenant-1');
    setChurchSettings(INITIAL_SETTINGS);
    setMembers(INITIAL_MEMBERS);
    setDepartments(INITIAL_DEPARTMENTS);
    setEvents(INITIAL_EVENTS);
    setDevotionals(INITIAL_DEVOTIONALS);
    setSermons(INITIAL_SERMONS);
    setDocuments(INITIAL_DOCUMENTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setPrayerRequests(INITIAL_PRAYER_REQUESTS);
    setFollowUps(INITIAL_FOLLOW_UPS);
    setGallery(INITIAL_GALLERY);
    setWhatsAppConfig(INITIAL_WHATSAPP_CONFIG);
    setWhatsAppMessages(INITIAL_WHATSAPP_MESSAGES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setReadingPlans(INITIAL_READING_PLANS);
    setCurrentUser(null);
    setActiveView('login');
  };

  // AI Service Helpers
  const generateAIGreeting = async (params: { 
    occasion: string; 
    recipientName: string; 
    tone?: string; 
    department?: string; 
    customNotes?: string; 
    length?: string 
  }): Promise<string> => {
    try {
      const res = await fetch('/api/ai/generate-greeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          churchName: churchSettings.churchName,
          pastorName: churchSettings.pastorName,
        }),
      });
      const data = await res.json();
      return data.message || '';
    } catch (err) {
      console.error('Error generating AI greeting:', err);
      return `Happy ${params.occasion}, ${params.recipientName}! May the Lord continue to strengthen and bless you in Jesus' name. — ${churchSettings.pastorName}`;
    }
  };

  const analyzeSermonAI = async (params: { 
    title: string; 
    speaker: string; 
    bibleReferences: string[]; 
    contentOrNotes?: string 
  }): Promise<any> => {
    try {
      const res = await fetch('/api/ai/analyze-sermon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.error('Error analyzing sermon:', err);
      return null;
    }
  };

  const generateDevotionalAI = async (params: { scripture?: string; topic?: string }): Promise<any> => {
    try {
      const res = await fetch('/api/ai/generate-devotional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, date: new Date().toISOString().split('T')[0] }),
      });
      const data = await res.json();
      return data.devotional;
    } catch (err) {
      console.error('Error generating devotional:', err);
      return null;
    }
  };

  return (
    <ChurchContext.Provider value={{
      tenants,
      activeTenantId,
      activeTenant,
      switchTenant,
      createTenant,
      updateTenant,
      deleteTenant,
      currentUser,
      isAuthenticated,
      login,
      logout,
      switchUserRole,
      churchSettings,
      updateChurchSettings,
      members,
      addMember,
      updateMember,
      deleteMember,
      importMembers,
      departments,
      addDepartment,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      registerForEvent,
      attendance,
      recordAttendance,
      devotionals,
      addDevotional,
      likeDevotional,
      sermons,
      addSermon,
      documents,
      addDocument,
      announcements,
      addAnnouncement,
      deleteAnnouncement,
      prayerRequests,
      submitPrayerRequest,
      updatePrayerRequestStatus,
      prayerJournal,
      addPrayerJournalEntry,
      togglePrayerJournalAnswered,
      deletePrayerJournalEntry,
      followUps,
      addFollowUp,
      updateFollowUp,
      gallery,
      addGalleryItem,
      whatsAppConfig,
      updateWhatsAppConfig,
      whatsAppTemplates,
      whatsAppMessages,
      sendWhatsAppMessage,
      whatsAppCampaigns,
      createWhatsAppCampaign,
      auditLogs,
      addAuditLog,
      readingPlans,
      toggleReadingPlanDay,
      isOffline,
      activeView,
      setActiveView,
      resetDemoData,
      generateAIGreeting,
      analyzeSermonAI,
      generateDevotionalAI,
    }}>
      {children}
    </ChurchContext.Provider>
  );
};

export const useChurch = () => {
  const context = useContext(ChurchContext);
  if (!context) {
    throw new Error('useChurch must be used within a ChurchProvider');
  }
  return context;
};
