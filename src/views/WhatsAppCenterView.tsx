import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  Send, ShieldCheck, Key, Phone, CheckCircle2, 
  AlertCircle, RefreshCw, Plus, Clock, MessageSquare, 
  FileText, Users, Eye, Check
} from 'lucide-react';
import { WhatsAppCampaign, WhatsAppTemplate } from '../types';

export const WhatsAppCenterView: React.FC = () => {
  const { 
    whatsAppConfig, 
    updateWhatsAppConfig, 
    whatsAppTemplates, 
    whatsAppMessages, 
    whatsAppCampaigns, 
    createWhatsAppCampaign, 
    sendWhatsAppMessage,
    members 
  } = useChurch();

  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'logs' | 'config'>('campaigns');

  // Config Form
  const [phoneNumberId, setPhoneNumberId] = useState(whatsAppConfig.phoneNumberId);
  const [wabaId, setWabaId] = useState(whatsAppConfig.wabaId);
  const [accessToken, setAccessToken] = useState('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);

  // New Campaign Form
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [targetSegment, setTargetSegment] = useState('All Active Members');
  const [selectedTemplateId, setSelectedTemplateId] = useState(whatsAppTemplates[0]?.id || '');
  const [scheduledTime, setScheduledTime] = useState('2026-10-05 08:00 AM');

  // Test message
  const [testPhone, setTestPhone] = useState('+15550103');
  const [testText, setTestText] = useState('Greetings from The Church! This is a test broadcast message via WhatsApp Cloud API.');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    const success = await updateWhatsAppConfig({
      phoneNumberId,
      wabaId,
      accessToken,
    });
    setIsSavingConfig(false);
    if (success) {
      setConfigSuccess(true);
      setTimeout(() => setConfigSuccess(false), 3000);
    }
  };

  const handleSendTest = async () => {
    setIsSendingTest(true);
    setTestResult(null);
    const success = await sendWhatsAppMessage({
      recipientName: 'Test Recipient',
      recipientPhone: testPhone,
      messageText: testText,
      messageType: 'announcement',
    });
    setIsSendingTest(false);
    setTestResult(success ? 'Delivered successfully via WhatsApp pipeline!' : 'Failed to send test message.');
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle.trim()) return;

    createWhatsAppCampaign({
      title: campaignTitle,
      targetSegment,
      recipientCount: targetSegment === 'All Active Members' ? members.length : 12,
      messageTemplate: selectedTemplateId,
      scheduledTime,
    });

    setCampaignTitle('');
    setShowCampaignModal(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-widest bg-emerald-950/60 px-2.5 py-0.5 rounded-sm">
              Official WhatsApp Business Platform
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Church WhatsApp Communication Center
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Reliable, policy-compliant messaging directly to members via Meta WhatsApp Cloud API.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/10 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${whatsAppConfig.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <div>
              <p className="font-bold text-white leading-tight">
                {whatsAppConfig.isConnected ? 'Cloud API Connected' : 'Sandbox Dispatch Ready'}
              </p>
              <p className="text-[10px] text-emerald-200">
                {whatsAppConfig.verifiedNumber || 'No number linked'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 pt-3 gap-6 shadow-xs">
        {[
          { id: 'campaigns', label: 'Broadcast Campaigns', icon: Send },
          { id: 'templates', label: 'Approved Templates', icon: FileText },
          { id: 'logs', label: 'Delivery Logs & Ledger', icon: Clock },
          { id: 'config', label: 'Cloud API Configuration', icon: Key },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: WhatsApp Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active & Scheduled Campaigns</h3>
              <p className="text-xs text-slate-500">Reach church segments via official WhatsApp templates</p>
            </div>
            <button
              onClick={() => setShowCampaignModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Campaign</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whatsAppCampaigns.map(camp => (
              <div 
                key={camp.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{camp.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Segment: <strong className="text-slate-700">{camp.targetSegment}</strong> · {camp.recipientCount} Recipients
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    camp.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : camp.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {camp.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1">
                  <p>Template: <code className="text-emerald-700 font-mono text-[11px]">{camp.messageTemplate}</code></p>
                  <p>Scheduled: {camp.scheduledTime}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Delivered: <strong className="text-slate-800">{camp.deliveredCount}</strong></span>
                  <span>Read: <strong className="text-slate-800">{camp.readCount}</strong></span>
                  <span>Failed: <strong className="text-slate-800">{camp.failedCount}</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Sandbox / Direct Messenger Test Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 mt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Direct WhatsApp Dispatch Test</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Recipient Phone Number (+1...)"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              />
              <input
                type="text"
                placeholder="Test Message Body..."
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden sm:col-span-2"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">Sends directly to recipient's WhatsApp via verified pipeline</span>
              <button
                onClick={handleSendTest}
                disabled={isSendingTest}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSendingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send WhatsApp Test</span>
              </button>
            </div>
            {testResult && (
              <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                {testResult}
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Approved Message Templates */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Official Meta Approved Message Templates</h3>
            <p className="text-xs text-slate-500">Templates registered with WhatsApp Business Cloud API for church broadcasts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whatsAppTemplates.map(tpl => (
              <div 
                key={tpl.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900">{tpl.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {tpl.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-sans leading-relaxed whitespace-pre-line">
                  {tpl.body}
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Category: {tpl.category}</span>
                  <span>Lang: {tpl.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Delivery Logs & Ledger */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">WhatsApp Delivery Audit Ledger</h3>
              <p className="text-xs text-slate-500">Live communication history and recipient delivery statuses</p>
            </div>
            <span className="text-xs text-slate-500">{whatsAppMessages.length} Messages Recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5">Recipient</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Message Snippet</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {whatsAppMessages.map(msg => (
                  <tr key={msg.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">{msg.recipientName}</td>
                    <td className="p-3.5 font-mono text-slate-600">{msg.recipientPhone}</td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold capitalize">
                        {msg.messageType}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-slate-600">{msg.messageText}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        msg.status === 'read'
                          ? 'bg-blue-100 text-blue-800'
                          : msg.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : msg.status === 'sent'
                          ? 'bg-teal-100 text-teal-800'
                          : msg.status === 'failed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Cloud API Configuration */}
      {activeTab === 'config' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-2xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Meta WhatsApp Business Cloud API Settings</h3>
            <p className="text-xs text-slate-500">
              Credentials are securely stored server-side. Never exposed in browser JavaScript bundles.
            </p>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Phone Number ID
              </label>
              <input
                type="text"
                placeholder="e.g. 104829104829104"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Business Account ID (WABA ID)
              </label>
              <input
                type="text"
                placeholder="e.g. 294820194820194"
                value={wabaId}
                onChange={(e) => setWabaId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Permanent System User Access Token
              </label>
              <input
                type="password"
                placeholder="EAAGm0..."
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Leave blank to preserve currently saved token on server.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSavingConfig}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              {isSavingConfig ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>Save & Verify Credentials</span>
            </button>

            {configSuccess && (
              <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Configuration saved securely on server!
              </p>
            )}
          </form>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Schedule WhatsApp Campaign</h3>
            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  placeholder="e.g. Midweek Communion Reminder"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Segment</label>
                <select
                  value={targetSegment}
                  onChange={(e) => setTargetSegment(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                >
                  <option value="All Active Members">All Active Members ({members.length})</option>
                  <option value="Choir Department">Sanctuary Choir</option>
                  <option value="Youth Department">Youth & Young Adults (Ignite)</option>
                  <option value="Workers Council">All Church Workers</option>
                  <option value="First-Time Visitors">First-Time Visitors</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Approved Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                >
                  {whatsAppTemplates.map(t => (
                    <option key={t.id} value={t.name}>{t.name} ({t.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Scheduled Dispatch Time</label>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
