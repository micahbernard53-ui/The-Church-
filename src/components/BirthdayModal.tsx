import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { X, Cake, Sparkles, Send, CheckCircle, RefreshCw, Smartphone, Edit2, Calendar } from 'lucide-react';
import { Member } from '../types';

interface BirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BirthdayModal: React.FC<BirthdayModalProps> = ({ isOpen, onClose }) => {
  const { members, generateAIGreeting, sendWhatsAppMessage, churchSettings } = useChurch();

  const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [generatedMessages, setGeneratedMessages] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({});
  const [isSending, setIsSending] = useState<Record<string, boolean>>({});
  const [sentSuccess, setSentSuccess] = useState<Record<string, boolean>>({});
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter today's celebrants (October 4)
  const todayBirthdays = members.filter(m => {
    if (!m.dateOfBirth) return false;
    const parts = m.dateOfBirth.split('-');
    return parts[1] === '10' && parts[2] === '04';
  });

  // Upcoming birthdays in October
  const upcomingBirthdays = members.filter(m => {
    if (!m.dateOfBirth) return false;
    const parts = m.dateOfBirth.split('-');
    const day = parseInt(parts[2], 10);
    return parts[1] === '10' && day > 4;
  }).sort((a, b) => {
    const dayA = parseInt(a.dateOfBirth.split('-')[2], 10);
    const dayB = parseInt(b.dateOfBirth.split('-')[2], 10);
    return dayA - dayB;
  });

  const handleGenerateGreeting = async (member: Member) => {
    setIsGenerating(prev => ({ ...prev, [member.id]: true }));
    try {
      const msg = await generateAIGreeting({
        occasion: 'Birthday',
        recipientName: member.fullName,
        department: member.departmentName,
        tone: 'Pastoral',
        customNotes: `Member of ${member.departmentName}. Joined ${member.dateJoined}. Dedicated servant of God.`,
      });
      setGeneratedMessages(prev => ({ ...prev, [member.id]: msg }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(prev => ({ ...prev, [member.id]: false }));
    }
  };

  const handleGenerateAllToday = async () => {
    for (const mem of todayBirthdays) {
      if (!generatedMessages[mem.id]) {
        await handleGenerateGreeting(mem);
      }
    }
  };

  const handleSendGreeting = async (member: Member) => {
    const text = generatedMessages[member.id] || 
      `Happy Birthday, ${member.firstName}! 🎉 The Church celebrates you today. May the Lord strengthen and bless you abundantly! — ${churchSettings.pastorName}`;

    setIsSending(prev => ({ ...prev, [member.id]: true }));
    const success = await sendWhatsAppMessage({
      recipientName: member.fullName,
      recipientPhone: member.whatsAppNumber || member.phoneNumber,
      messageText: text,
      messageType: 'birthday',
      memberId: member.id,
    });

    setIsSending(prev => ({ ...prev, [member.id]: false }));
    if (success) {
      setSentSuccess(prev => ({ ...prev, [member.id]: true }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Cake className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Birthday Celebrations & AI Greetings</h2>
              <p className="text-xs text-white/80">Send personalized pastoral prayers directly to WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('today')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'today'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Today's Celebrants ({todayBirthdays.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'upcoming'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming Birthdays ({upcomingBirthdays.length})</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'today' ? (
            <>
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-amber-900">Today: October 4th</p>
                  <p className="text-[11px] text-amber-700">
                    {todayBirthdays.length} members are celebrating their birthday today.
                  </p>
                </div>
                <button
                  onClick={handleGenerateAllToday}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate All with Gemini
                </button>
              </div>

              <div className="space-y-4">
                {todayBirthdays.map(member => {
                  const birthYear = parseInt(member.dateOfBirth.split('-')[0], 10);
                  const ageTurning = 2026 - birthYear;
                  const message = generatedMessages[member.id];
                  const hasSent = sentSuccess[member.id];

                  return (
                    <div 
                      key={member.id}
                      className="border border-slate-200 rounded-xl p-4 bg-white hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={member.fullName}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-100"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-sm">{member.fullName}</h3>
                              <span className="text-[11px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
                                Turning {ageTurning}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              {member.departmentName} · {member.phoneNumber}
                            </p>
                          </div>
                        </div>

                        {!message && !hasSent && (
                          <button
                            onClick={() => handleGenerateGreeting(member)}
                            disabled={isGenerating[member.id]}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {isGenerating[member.id] ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Generating...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                <span>Draft AI Greeting</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Display Draft Message & WhatsApp Actions */}
                      {message && (
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1">
                              <Smartphone className="w-3.5 h-3.5" />
                              WhatsApp Message Preview
                            </span>
                            <button
                              onClick={() => handleGenerateGreeting(member)}
                              disabled={isGenerating[member.id]}
                              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" /> Regenerate
                            </button>
                          </div>

                          <textarea
                            value={message}
                            onChange={(e) => setGeneratedMessages(prev => ({ ...prev, [member.id]: e.target.value }))}
                            className="w-full text-xs text-slate-800 bg-white border border-emerald-300 rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500 outline-hidden font-sans resize-none h-24"
                          />

                          <div className="flex items-center justify-end gap-2 pt-1">
                            {hasSent ? (
                              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 bg-emerald-100 px-3 py-1.5 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                Delivered via WhatsApp
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSendGreeting(member)}
                                disabled={isSending[member.id]}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                              >
                                {isSending[member.id] ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Send className="w-3.5 h-3.5" />
                                )}
                                <span>Approve & Send to {member.firstName}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium">
                Upcoming birthdays in the next 30 days:
              </p>
              {upcomingBirthdays.map(m => {
                const parts = m.dateOfBirth.split('-');
                const day = parts[2];
                return (
                  <div 
                    key={m.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={m.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'}
                        alt={m.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{m.fullName}</h4>
                        <p className="text-[11px] text-slate-500">{m.departmentName} · Oct {day}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('today');
                        handleGenerateGreeting(m);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2.5 py-1 rounded bg-rose-50 hover:bg-rose-100"
                    >
                      Pre-generate AI Greeting
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Official WhatsApp Cloud API Dispatch</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded-lg hover:bg-white text-slate-700 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
