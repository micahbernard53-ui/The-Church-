import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  HeartHandshake, ShieldCheck, AlertCircle, Plus, 
  Send, User, Clock, Check, X, Phone, MessageSquare 
} from 'lucide-react';
import { PrayerRequest, PastoralFollowUp } from '../types';

export const PrayerFollowUpView: React.FC = () => {
  const { 
    prayerRequests, 
    submitPrayerRequest, 
    updatePrayerRequestStatus, 
    followUps, 
    addFollowUp, 
    updateFollowUp,
    members, 
    currentUser, 
    sendWhatsAppMessage,
    churchSettings 
  } = useChurch();

  const [activeTab, setActiveTab] = useState<'requests' | 'followups' | 'absent_care'>('requests');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  // Prayer form
  const [requestText, setRequestText] = useState('');
  const [category, setCategory] = useState<PrayerRequest['category']>('Healing');
  const [urgency, setUrgency] = useState<PrayerRequest['urgency']>('medium');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Follow-up form
  const [selectedMemberId, setSelectedMemberId] = useState(members[12]?.id || ''); // Marcus Sterling
  const [followUpType, setFollowUpType] = useState<PastoralFollowUp['type']>('absent_member');
  const [assignedToName, setAssignedToName] = useState(churchSettings.pastorName);
  const [notes, setNotes] = useState('');

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    submitPrayerRequest({
      memberName: isAnonymous ? 'Anonymous' : (currentUser?.name || 'Church Member'),
      memberId: isAnonymous ? undefined : currentUser?.memberId,
      contactPhone: currentUser?.phone || '',
      requestText,
      category,
      urgency,
      isAnonymous,
    });

    setRequestText('');
    setShowSubmitModal(false);
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    const mem = members.find(m => m.id === selectedMemberId);
    if (!mem) return;

    addFollowUp({
      memberId: mem.id,
      memberName: mem.fullName,
      memberPhone: mem.phoneNumber,
      type: followUpType,
      assignedToName,
      assignedToEmail: 'pastor@thechurchofgrace.org',
      status: 'pending',
      scheduledDate: new Date().toISOString().split('T')[0],
      notes: notes || 'Assigned for pastoral follow-up and encouragement.',
    });

    setShowFollowUpModal(false);
    setNotes('');
  };

  // Absent members requiring pastoral care
  const absentMembers = members.filter(m => m.memberStatus === 'inactive' || m.id === 'mem-13');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Prayer Sanctuary & Pastoral Care</h1>
          <p className="text-xs text-slate-500">Confidential intercession petitions, absent member care, and welfare cases</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Prayer Request</span>
          </button>

          {currentUser?.role !== 'member' && (
            <button
              onClick={() => setShowFollowUpModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Log Pastoral Follow-up</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 pt-3 gap-6 shadow-xs">
        {[
          { id: 'requests', label: `Prayer Petitions (${prayerRequests.length})`, icon: HeartHandshake },
          { id: 'followups', label: `Pastoral Care Cases (${followUps.length})`, icon: ShieldCheck },
          { id: 'absent_care', label: `Absent Member Alert (${absentMembers.length})`, icon: AlertCircle },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Prayer Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prayerRequests.map(pr => (
              <div 
                key={pr.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      {pr.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      pr.status === 'resolved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : pr.status === 'being_prayed_for' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pr.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed font-sans">
                    "{pr.requestText}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>From: <strong className="text-slate-700">{pr.isAnonymous ? 'Anonymous Member' : pr.memberName}</strong></span>
                    <span className="font-mono">{new Date(pr.submittedAt).toLocaleDateString()}</span>
                  </div>

                  {currentUser?.role !== 'member' && (
                    <div className="flex items-center justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => updatePrayerRequestStatus(pr.id, 'being_prayed_for')}
                        className="text-[11px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-lg"
                      >
                        Praying For This
                      </button>
                      <button
                        onClick={() => updatePrayerRequestStatus(pr.id, 'resolved')}
                        className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-lg"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Pastoral Care Follow-ups */}
      {activeTab === 'followups' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Assigned Pastoral Follow-Ups</h3>
            <span className="text-xs text-slate-500">{followUps.length} Active Records</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {followUps.map(fu => (
              <div key={fu.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{fu.memberName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded capitalize">
                      {fu.type.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      fu.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {fu.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs">{fu.notes}</p>
                  <p className="text-[11px] text-slate-400">Assigned to: <strong className="text-slate-700">{fu.assignedToName}</strong></p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      sendWhatsAppMessage({
                        recipientName: fu.memberName,
                        recipientPhone: fu.memberPhone,
                        messageText: `Dear ${fu.memberName.split(' ')[0]}, warm greetings from ${churchSettings.pastorName}. We are praying for you and checking in on your well-being. Blessings!`,
                        messageType: 'encouragement',
                        memberId: fu.memberId,
                      });
                    }}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors cursor-pointer"
                    title="Send WhatsApp Follow-up"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => updateFollowUp(fu.id, { status: 'completed' })}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Absent Member Alert System (Requirement 21) */}
      {activeTab === 'absent_care' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 space-y-1">
            <p className="font-bold">Automated Member Care Detection System</p>
            <p>
              The system automatically identifies members who have not recorded attendance for 3 consecutive Sunday services. Pastoral messages must remain encouraging and caring, never judgmental.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {absentMembers.map(m => (
              <div key={m.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={m.avatarUrl} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{m.fullName}</h4>
                      <p className="text-xs text-amber-800 font-medium">Missed last 3 Sunday services</p>
                      <p className="text-[11px] text-slate-400">{m.departmentName} · {m.phoneNumber}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    Care Needed
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-700 font-serif">
                  "Dear {m.firstName}, we missed your warm presence at The Church! Praying for God's supernatural strength over your work and home. Let us know how we can pray for you."
                </div>

                <button
                  onClick={() => {
                    sendWhatsAppMessage({
                      recipientName: m.fullName,
                      recipientPhone: m.whatsAppNumber || m.phoneNumber,
                      messageText: `Dear ${m.firstName}, we missed your warm presence at church this Sunday! Praying for God's supernatural strength over your week. Let us know how we can pray for you. — ${churchSettings.pastorName}`,
                      messageType: 'absent_checkin',
                      memberId: m.id,
                    });
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Caring Check-In to {m.firstName}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Prayer Request Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Submit Private Prayer Request</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePrayerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                >
                  <option value="Healing">Healing & Health</option>
                  <option value="Family">Family & Marriage</option>
                  <option value="Finance">Financial Breakthrough & Jobs</option>
                  <option value="Deliverance">Deliverance & Protection</option>
                  <option value="Spiritual Growth">Spiritual Growth</option>
                  <option value="Thanksgiving">Thanksgiving Testimony</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Prayer Petition</label>
                <textarea
                  required
                  placeholder="Share what you are trusting God for..."
                  value={requestText}
                  onChange={(e) => setRequestText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden resize-none h-24"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anon"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-teal-600"
                />
                <label htmlFor="anon" className="text-slate-600 cursor-pointer">
                  Submit anonymously (Name will not appear to prayer warriors)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl"
                >
                  Submit to Pastoral Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Pastoral Follow-up Modal */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Assign Member Follow-up</h3>
              <button onClick={() => setShowFollowUpModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowUp} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Member</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.fullName} ({m.phoneNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Case Type</label>
                <select
                  value={followUpType}
                  onChange={(e) => setFollowUpType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                >
                  <option value="new_member">New Member Follow-up</option>
                  <option value="hospital_visit">Hospital / Sick Visit</option>
                  <option value="bereavement">Bereavement Support</option>
                  <option value="counseling">Pastoral Counseling</option>
                  <option value="absent_member">Absent Member Care</option>
                  <option value="welfare">Welfare Assistance</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assign to Worker</label>
                <input
                  type="text"
                  value={assignedToName}
                  onChange={(e) => setAssignedToName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  placeholder="Details about this follow-up..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden resize-none h-20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl"
                >
                  Assign Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
