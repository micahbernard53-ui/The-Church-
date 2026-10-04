import React, { useState, useMemo } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  Users, UserPlus, Search, Filter, Download, 
  Upload, Phone, Mail, Sparkles, Send, Edit2, 
  Trash2, Eye, X, Check, CheckCircle, Shield
} from 'lucide-react';
import { Member } from '../types';

export const MembersManagementView: React.FC = () => {
  const { members, addMember, updateMember, deleteMember, importMembers, departments, churchSettings, sendWhatsAppMessage } = useChurch();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [activeSegment, setActiveSegment] = useState<'all' | 'workers' | 'youth' | 'birthdays' | 'absent'>('all');

  // Modals & Drawers
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showCSVModal, setShowCSVModal] = useState(false);

  // New Member Form State
  const [formData, setFormData] = useState({
    fullName: '',
    firstName: '',
    lastName: '',
    gender: 'male' as 'male' | 'female',
    dateOfBirth: '1995-05-15',
    phoneNumber: '',
    whatsAppNumber: '',
    email: '',
    residentialAddress: '',
    occupation: '',
    maritalStatus: 'single' as 'single' | 'married' | 'widowed' | 'divorced',
    weddingAnniversary: '',
    dateJoined: '2026-01-10',
    baptismStatus: 'baptized' as 'baptized' | 'not_baptized' | 'scheduled',
    departmentId: departments[0]?.id || 'dept-1',
    cellGroup: 'Sanctuary Cell',
    emergencyName: '',
    emergencyRelationship: 'Family',
    emergencyPhone: '',
    memberStatus: 'active' as 'active' | 'inactive' | 'visitor' | 'worker',
    notes: '',
  });

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchSearch = searchQuery === '' || 
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phoneNumber.includes(searchQuery) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = selectedDeptFilter === 'all' || m.departmentId === selectedDeptFilter;
      const matchStatus = selectedStatusFilter === 'all' || m.memberStatus === selectedStatusFilter;

      let matchSegment = true;
      if (activeSegment === 'workers') matchSegment = m.memberStatus === 'worker';
      if (activeSegment === 'youth') matchSegment = m.departmentName.toLowerCase().includes('youth') || m.departmentId === 'dept-3';
      if (activeSegment === 'birthdays') {
        const parts = m.dateOfBirth.split('-');
        matchSegment = parts[1] === '10'; // October celebrants
      }
      if (activeSegment === 'absent') matchSegment = m.memberStatus === 'inactive' || m.id === 'mem-13';

      return matchSearch && matchDept && matchStatus && matchSegment;
    });
  }, [members, searchQuery, selectedDeptFilter, selectedStatusFilter, activeSegment]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find(d => d.id === formData.departmentId);
    const names = formData.fullName.trim().split(' ');
    const fName = names[0] || 'Member';
    const lName = names.slice(1).join(' ') || '';

    addMember({
      fullName: formData.fullName,
      firstName: fName,
      lastName: lName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      phoneNumber: formData.phoneNumber,
      whatsAppNumber: formData.whatsAppNumber || formData.phoneNumber,
      email: formData.email,
      residentialAddress: formData.residentialAddress,
      occupation: formData.occupation,
      maritalStatus: formData.maritalStatus,
      weddingAnniversary: formData.weddingAnniversary || undefined,
      dateJoined: formData.dateJoined,
      baptismStatus: formData.baptismStatus,
      departmentId: formData.departmentId,
      departmentName: dept?.name || 'General Congregation',
      cellGroup: formData.cellGroup,
      emergencyContact: {
        name: formData.emergencyName || 'Church Protocol',
        relationship: formData.emergencyRelationship,
        phone: formData.emergencyPhone || formData.phoneNumber,
      },
      memberStatus: formData.memberStatus,
      notes: formData.notes,
      privacy: {
        showPhone: true,
        showEmail: true,
        showBirthday: true,
        showAddress: false,
        showPhoto: true,
      },
      journey: {
        dateJoined: formData.dateJoined,
        completedDiscipleship: false,
      },
    });

    setShowAddModal(false);
  };

  const handleImportSampleCSV = () => {
    const sampleBatch: Omit<Member, 'id'>[] = [
      {
        fullName: 'Daniel Adebisi',
        firstName: 'Daniel',
        lastName: 'Adebisi',
        gender: 'male',
        dateOfBirth: '1992-06-14',
        phoneNumber: '+1-555-0240',
        whatsAppNumber: '+15550240',
        email: 'daniel.adebisi@example.com',
        residentialAddress: '19 Palmview Heights',
        occupation: 'Banker',
        maritalStatus: 'married',
        dateJoined: '2026-03-01',
        baptismStatus: 'baptized',
        departmentId: 'dept-2',
        departmentName: 'Ushering & Protocol',
        cellGroup: 'Kingsway Cell',
        emergencyContact: { name: 'Grace Adebisi', relationship: 'Spouse', phone: '+1-555-0241' },
        memberStatus: 'active',
        notes: 'Imported via CSV upload.',
        privacy: { showPhone: true, showEmail: true, showBirthday: true, showAddress: false, showPhoto: true },
        journey: { dateJoined: '2026-03-01', completedDiscipleship: true },
      },
      {
        fullName: 'Evelyn Mensah',
        firstName: 'Evelyn',
        lastName: 'Mensah',
        gender: 'female',
        dateOfBirth: '2001-11-20',
        phoneNumber: '+1-555-0242',
        whatsAppNumber: '+15550242',
        email: 'evelyn.mensah@example.com',
        residentialAddress: '44 Hilltop Avenue',
        occupation: 'Graphic Designer',
        maritalStatus: 'single',
        dateJoined: '2026-02-15',
        baptismStatus: 'baptized',
        departmentId: 'dept-1',
        departmentName: 'Sanctuary Choir',
        cellGroup: 'Campus Ignite',
        emergencyContact: { name: 'Kofi Mensah', relationship: 'Father', phone: '+1-555-0243' },
        memberStatus: 'worker',
        notes: 'Choir soprano singer.',
        privacy: { showPhone: true, showEmail: true, showBirthday: true, showAddress: false, showPhoto: true },
        journey: { dateJoined: '2026-02-15', completedDiscipleship: true },
      }
    ];

    importMembers(sampleBatch);
    setShowCSVModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Member Directory & Care</h1>
          <p className="text-xs text-slate-500">
            Managing {members.length} registered members, workers, and visitors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCSVModal(true)}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Member</span>
          </button>
        </div>
      </div>

      {/* Smart Segmentation Tabs (Requirement 50) */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { id: 'all', label: `All Members (${members.length})` },
          { id: 'workers', label: `Church Workers (${members.filter(m => m.memberStatus === 'worker').length})` },
          { id: 'youth', label: 'Ignite Youth' },
          { id: 'birthdays', label: 'October Birthdays' },
          { id: 'absent', label: 'Absent (Care Follow-up)' },
        ].map(seg => (
          <button
            key={seg.id}
            onClick={() => setActiveSegment(seg.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeSegment === seg.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {seg.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-1 focus:ring-teal-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 outline-hidden w-full sm:w-auto"
          >
            <option value="all">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 outline-hidden w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="worker">Worker</option>
            <option value="visitor">Visitor</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Members Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map(member => (
          <div
            key={member.id}
            className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={member.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                  alt={member.fullName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">{member.fullName}</h3>
                  <p className="text-xs text-teal-700 font-medium">{member.departmentName}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{member.occupation || 'Member'}</p>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                member.memberStatus === 'worker' 
                  ? 'bg-purple-100 text-purple-800' 
                  : member.memberStatus === 'active' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {member.memberStatus}
              </span>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span>Phone / WhatsApp:</span>
                <span className="font-mono font-medium">{member.phoneNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Birthday:</span>
                <span>{member.dateOfBirth}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedMember(member)}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>View Profile</span>
              </button>

              <button
                onClick={() => {
                  sendWhatsAppMessage({
                    recipientName: member.fullName,
                    recipientPhone: member.whatsAppNumber || member.phoneNumber,
                    messageText: `Dear ${member.firstName}, warm greetings from ${churchSettings.churchName}. Praying for God's blessings over your home!`,
                    messageType: 'encouragement',
                    memberId: member.id,
                  });
                }}
                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                title="Send Instant WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selectedMember.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/20" />
                <div>
                  <h3 className="text-base font-bold">{selectedMember.fullName}</h3>
                  <p className="text-xs text-teal-300">{selectedMember.departmentName} · {selectedMember.memberStatus}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Phone Number</p>
                  <p className="font-mono text-slate-800 font-bold">{selectedMember.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">WhatsApp</p>
                  <p className="font-mono text-slate-800 font-bold">{selectedMember.whatsAppNumber}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Email</p>
                  <p className="text-slate-800 font-bold truncate">{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Date of Birth</p>
                  <p className="text-slate-800 font-bold">{selectedMember.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Marital Status</p>
                  <p className="text-slate-800 font-bold capitalize">{selectedMember.maritalStatus}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Baptism Status</p>
                  <p className="text-slate-800 font-bold capitalize">{selectedMember.baptismStatus}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Residential Address</h4>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {selectedMember.residentialAddress || 'Not specified'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Emergency Contact</h4>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {selectedMember.emergencyContact.name} ({selectedMember.emergencyContact.relationship}) — {selectedMember.emergencyContact.phone}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Pastoral Notes</h4>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {selectedMember.notes || 'No notes added yet.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  deleteMember(selectedMember.id);
                  setSelectedMember(null);
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Member</span>
              </button>

              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="text-base font-bold">Register New Church Member</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Solomon"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 555-0199"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="+15550199"
                    value={formData.whatsAppNumber}
                    onChange={(e) => setFormData({ ...formData, whatsAppNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street, City"
                  value={formData.residentialAddress}
                  onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl"
                >
                  Save Member Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Import Members via CSV / Excel</h3>
            <p className="text-xs text-slate-500">
              Easily upload spreadsheets containing name, phone, birthday, department, and email.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50">
              <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Drop members.csv here</p>
              <p className="text-[11px] text-slate-400">or click below to load pre-formatted sample</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCSVModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSampleCSV}
                className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Load Sample Batch (2 Members)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
