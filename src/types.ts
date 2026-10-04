export type UserRole = 'platform_owner' | 'super_admin' | 'staff_admin' | 'member';

export type StaffDepartmentRole = 
  | 'secretary'
  | 'media_admin'
  | 'welfare_admin'
  | 'youth_admin'
  | 'children_admin'
  | 'finance_admin'
  | 'pastoral_assistant';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  tenantId?: string;
  staffRole?: StaffDepartmentRole;
  permissions?: string[];
  memberId?: string;
  avatarUrl?: string;
}

export interface ChurchTenant {
  id: string;
  slug: string; // unique URL/code identifier
  name: string;
  slogan: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  pastorName: string;
  pastorEmail: string;
  primaryColor: string;
  secondaryColor: string;
  status: 'active' | 'pending' | 'suspended';
  plan: 'enterprise' | 'growth' | 'starter';
  createdAt: string;
  memberCount: number;
  adminEmail: string;
  adminPassword?: string;
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Member {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  gender: 'male' | 'female';
  dateOfBirth: string; // YYYY-MM-DD
  phoneNumber: string;
  whatsAppNumber: string;
  email: string;
  residentialAddress: string;
  occupation: string;
  maritalStatus: 'single' | 'married' | 'widowed' | 'divorced';
  weddingAnniversary?: string; // YYYY-MM-DD
  dateJoined: string; // YYYY-MM-DD
  baptismStatus: 'baptized' | 'not_baptized' | 'scheduled';
  departmentId: string;
  departmentName: string;
  ministry?: string;
  cellGroup: string;
  houseFellowship?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  memberStatus: 'active' | 'inactive' | 'visitor' | 'worker';
  notes: string;
  privacy: {
    showPhone: boolean;
    showEmail: boolean;
    showBirthday: boolean;
    showAddress: boolean;
    showPhoto: boolean;
  };
  journey: {
    dateJoined: string;
    baptizedDate?: string;
    departmentJoinedDate?: string;
    completedDiscipleship?: boolean;
    workerOrdainedDate?: string;
  };
}

export interface Department {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  leaderName: string;
  assistantLeaderName?: string;
  memberCount: number;
  meetingDay: string;
  meetingTime: string;
  color: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  category: 'sunday_service' | 'bible_study' | 'prayer_meeting' | 'revival' | 'conference' | 'youth' | 'women' | 'men' | 'special';
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  speaker: string;
  posterUrl?: string;
  registrationRequired: boolean;
  targetAudience: string;
  registeredCount: number;
  isRecurring?: boolean;
  remindersSent: string[]; // e.g. ['7d', '1d']
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  checkInMethod: 'qr_code' | 'admin_manual' | 'self_portal';
  isFirstTimer: boolean;
}

export interface Devotional {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  bibleVerse: string;
  bibleReference: string;
  content: string;
  prayer: string;
  reflectionQuestion: string;
  author: string;
  likes: number;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  category: 'Sunday Worship' | 'Faith' | 'Prayer' | 'Spiritual Growth' | 'Family' | 'Leadership';
  description: string;
  bibleReferences: string[];
  thumbnailUrl: string;
  audioUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  duration?: string;
  summary?: string;
  discussionQuestions?: string[];
  prayerPoints?: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Sermon Notes' | 'Bible Study' | 'Church Manual' | 'Prayer Guide' | 'Devotional Material' | 'Conference';
  fileType: 'pdf' | 'doc' | 'sheet';
  fileSize: string;
  uploadedDate: string;
  downloadCount: number;
  description: string;
  contentSnippet: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  event: string;
  date: string;
  category: 'Sunday Service' | 'Youth' | 'Baptism' | 'Outreach' | 'Conference';
  imageUrl: string;
  caption: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'urgent' | 'department' | 'event';
  departmentName?: string;
  publishedDate: string;
  expiresDate?: string;
  isPinned: boolean;
  author: string;
  readCount: number;
}

export interface PrayerRequest {
  id: string;
  memberId?: string;
  memberName: string;
  contactPhone?: string;
  requestText: string;
  category: 'Healing' | 'Family' | 'Finance' | 'Deliverance' | 'Spiritual Growth' | 'Thanksgiving' | 'Other';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  isAnonymous: boolean;
  status: 'new' | 'being_prayed_for' | 'follow_up_required' | 'resolved';
  submittedAt: string;
  pastoralNotes?: string;
}

export interface PrayerJournalEntry {
  id: string;
  title: string;
  content: string;
  answered: boolean;
  dateCreated: string;
  answeredDate?: string;
  scripture?: string;
}

export interface PastoralFollowUp {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  type: 'new_member' | 'hospital_visit' | 'bereavement' | 'counseling' | 'birthday_visit' | 'absent_member' | 'welfare';
  assignedToName: string;
  assignedToEmail: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  notes: string;
  outcome?: string;
  nextFollowUpDate?: string;
}

export interface WhatsAppConfig {
  phoneNumberId: string;
  wabaId: string; // WhatsApp Business Account ID
  accessToken: string; // Server side secret
  verifiedNumber: string;
  businessName: string;
  isConnected: boolean;
  approvalMode: 'manual' | 'automatic';
  autoBirthdayEnabled: boolean;
  autoVisitorWelcomeEnabled: boolean;
  autoEventReminderEnabled: boolean;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'MARKETING' | 'UTILITY';
  language: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  body: string;
  exampleVariables: string[];
}

export interface WhatsAppMessage {
  id: string;
  recipientName: string;
  recipientPhone: string;
  memberId?: string;
  messageType: 'birthday' | 'anniversary' | 'event_reminder' | 'devotional' | 'encouragement' | 'absent_checkin' | 'announcement';
  messageText: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  scheduledFor?: string;
  campaignId?: string;
  failureReason?: string;
}

export interface WhatsAppCampaign {
  id: string;
  title: string;
  targetSegment: string;
  recipientCount: number;
  messageTemplate: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed';
  scheduledTime: string;
  sentTime?: string;
  deliveredCount: number;
  readCount: number;
  failedCount: number;
}

export interface ChurchSettings {
  churchName: string;
  slogan: string;
  logoUrl: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  pastorName: string;
  pastorEmail: string;
  primaryColor: string;
  secondaryColor: string;
  socialLinks: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
    twitter?: string;
  };
  serviceTimes: {
    day: string;
    name: string;
    time: string;
  }[];
  setupCompleted: boolean;
}

export interface AuditLog {
  id: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface BibleVerseItem {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  topic?: string;
}

export interface ReadingPlan {
  id: string;
  title: string;
  durationDays: number;
  description: string;
  currentDay: number;
  totalDays: number;
  completedDays: number[];
}
