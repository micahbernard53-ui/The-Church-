import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  Sparkles, Send, RefreshCw, Smartphone, Copy, Check, 
  User, Heart, Cake, Gift, Calendar, AlertCircle, ShieldCheck
} from 'lucide-react';
import { Member } from '../types';

export const AIPastoralAssistantView: React.FC = () => {
  const { 
    members, 
    generateAIGreeting, 
    sendWhatsAppMessage, 
    churchSettings, 
    whatsAppConfig,
    updateWhatsAppConfig
  } = useChurch();

  const [selectedOccasion, setSelectedOccasion] = useState<string>('Birthday');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(members[1]?.id || '');
  const [customRecipient, setCustomRecipient] = useState<string>('');
  const [tone, setTone] = useState<string>('Pastoral');
  const [length, setLength] = useState<string>('medium');
  const [customNotes, setCustomNotes] = useState<string>('');
  
  const [generatedDraft, setGeneratedDraft] = useState<string>(
    `Happy Birthday, Sarah! 🎉 May the Lord continue to strengthen you and bless you abundantly. Thank you for your selfless dedication to the Media ministry. The Church celebrates you today! — ${churchSettings.pastorName}`
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const occasions = [
    { id: 'Birthday', label: 'Birthday', icon: Cake, promptHint: 'Celebrating another year of God\'s favor and life' },
    { id: 'Wedding Anniversary', label: 'Wedding Anniversary', icon: Heart, promptHint: 'Blessing God for marriage covenant and unity' },
    { id: 'New Member Welcome', label: 'New Member Welcome', icon: User, promptHint: 'Warm welcome into the church family' },
    { id: 'Pastoral Encouragement', label: 'Pastoral Encouragement', icon: Sparkles, promptHint: 'Lifting up spirit in times of wearying or trial' },
    { id: 'Absent Member Check-in', label: 'Absent Member Check-in', icon: Calendar, promptHint: 'Loving, non-judgmental care inquiry' },
    { id: 'Healing & Comfort', label: 'Healing & Comfort', icon: Gift, promptHint: 'Prayer for divine health and peace' },
    { id: 'New Year', label: 'New Year Prophetic Word', icon: Sparkles, promptHint: 'Prophetic declarations for the upcoming year' },
  ];

  const selectedMember = members.find(m => m.id === selectedMemberId);
  const effectiveRecipientName = customRecipient.trim() || selectedMember?.fullName || 'Beloved Member';

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSendSuccess(false);
    try {
      const result = await generateAIGreeting({
        occasion: selectedOccasion,
        recipientName: effectiveRecipientName,
        department: selectedMember?.departmentName,
        tone,
        length,
        customNotes: customNotes.trim() 
          ? customNotes 
          : selectedMember 
          ? `Member of ${selectedMember.departmentName}. Joined on ${selectedMember.dateJoined}. Dedicated worker.` 
          : '',
      });
      setGeneratedDraft(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendViaWhatsApp = async () => {
    if (!generatedDraft) return;
    setIsSending(true);

    const targetPhone = selectedMember?.whatsAppNumber || selectedMember?.phoneNumber || '+15550100';

    const success = await sendWhatsAppMessage({
      recipientName: effectiveRecipientName,
      recipientPhone: targetPhone,
      messageText: generatedDraft,
      messageType: selectedOccasion.toLowerCase().includes('birthday') ? 'birthday' : 'encouragement',
      memberId: selectedMember?.id,
    });

    setIsSending(false);
    if (success) {
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 4000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-amber-200 uppercase tracking-widest bg-amber-900/40 px-2.5 py-0.5 rounded-sm">
              Gemini AI Pastoral Assistant
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Personalized AI Message Studio
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-xl">
              Craft heartfelt, personalized pastoral greetings and encouragement in natural Christian tone with dynamic member details.
            </p>
          </div>

          {/* Safety & Pastoral Control Approval Mode */}
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 border border-white/20 self-start sm:self-auto text-xs">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span className="font-bold">Message Approval Protocol</span>
            </div>
            <select
              value={whatsAppConfig.approvalMode}
              onChange={(e) => updateWhatsAppConfig({ approvalMode: e.target.value as any })}
              className="bg-slate-900/60 text-white text-[11px] rounded-lg px-2.5 py-1 outline-hidden border border-white/20"
            >
              <option value="manual">Manual Pastor Review (Default)</option>
              <option value="automatic">Automatic Auto-Dispatch</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          {/* 1. Occasion Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Select Ministry Occasion
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {occasions.map(occ => {
                const Icon = occ.icon;
                const isSelected = selectedOccasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span className="text-xs truncate">{occ.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Recipient Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Select Recipient
            </label>
            <div className="space-y-2">
              <select
                value={selectedMemberId}
                onChange={(e) => {
                  setSelectedMemberId(e.target.value);
                  setCustomRecipient('');
                }}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              >
                <option value="">-- Choose Member from Directory --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.departmentName}) — {m.phoneNumber}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="h-px bg-slate-200 flex-1" />
                <span>or enter non-member name</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <input
                type="text"
                placeholder="Custom Recipient Name (e.g. Guest Minister or Visitor)"
                value={customRecipient}
                onChange={(e) => {
                  setCustomRecipient(e.target.value);
                  if (e.target.value) setSelectedMemberId('');
                }}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              >
              </input>
            </div>
          </div>

          {/* 3. Tone & Length */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                3. Pastoral Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              >
                <option value="Pastoral">Pastoral & Fatherly</option>
                <option value="Warm">Warm & Caring</option>
                <option value="Friendly">Friendly & Brotherly</option>
                <option value="Encouraging">Spiritually Encouraging</option>
                <option value="Formal">Formal Church Official</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                4. Length
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              >
                <option value="short">Short (Quick WhatsApp / SMS)</option>
                <option value="medium">Medium (Standard blessing)</option>
                <option value="detailed">Detailed (Rich prayer points)</option>
              </select>
            </div>
          </div>

          {/* 5. Custom Notes or Specific Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              5. Personal Pastoral Notes / Prayer Focus (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Recently recovered from flu, serves in choir, newly married..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Gemini is Drafting Personalized Message...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate Natural Personalized Message with Gemini</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Smartphone WhatsApp Preview & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-3xl p-4 text-white shadow-xl border border-slate-800">
            {/* Phone Screen Mockup Header */}
            <div className="bg-emerald-800 rounded-2xl p-3 flex items-center justify-between shadow-xs mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs text-white">
                  ✝
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">{effectiveRecipientName}</h4>
                  <p className="text-[10px] text-emerald-200">Official WhatsApp Chat</p>
                </div>
              </div>
              <span className="text-[10px] text-white/80 font-mono">10:00 AM</span>
            </div>

            {/* Chat Bubble Area */}
            <div className="bg-[#0b141a] rounded-2xl p-4 min-h-[220px] flex flex-col justify-end space-y-3 relative">
              <div className="bg-[#005c4b] text-white rounded-2xl rounded-tr-xs p-3.5 text-xs leading-relaxed shadow-sm font-sans whitespace-pre-line self-end max-w-[90%]">
                {generatedDraft}
                <div className="flex justify-end items-center gap-1 mt-1 text-[9px] text-emerald-200">
                  <span>10:00 AM</span>
                  <span>✓✓</span>
                </div>
              </div>
            </div>

            {/* Editable Draft Textarea */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Edit message text before sending:</span>
                <button onClick={handleCopy} className="text-teal-400 hover:text-teal-300 flex items-center gap-1">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <textarea
                value={generatedDraft}
                onChange={(e) => setGeneratedDraft(e.target.value)}
                className="w-full text-xs text-slate-100 bg-slate-800/90 border border-slate-700 rounded-xl p-3 outline-hidden resize-none h-28 focus:ring-1 focus:ring-teal-500 font-sans"
              />
            </div>

            {/* Dispatch Action Button */}
            <div className="mt-3">
              <button
                onClick={handleSendViaWhatsApp}
                disabled={isSending || !generatedDraft}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Approve & Send via WhatsApp to {effectiveRecipientName.split(' ')[0]}</span>
              </button>

              {sendSuccess && (
                <div className="mt-2 text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" />
                  <span>Approved & Dispatched via WhatsApp Cloud API!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
