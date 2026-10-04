import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  Settings, Church, Palette, Send, Bell, 
  Sparkles, Shield, RotateCcw, Check, Rocket, Key 
} from 'lucide-react';
import { FirstRunSetupWizard } from '../components/FirstRunSetupWizard';

export const SettingsView: React.FC = () => {
  const { 
    churchSettings, 
    updateChurchSettings, 
    whatsAppConfig, 
    updateWhatsAppConfig, 
    resetDemoData, 
    currentUser 
  } = useChurch();

  const [showWizard, setShowWizard] = useState(false);
  const [churchName, setChurchName] = useState(churchSettings.churchName);
  const [slogan, setSlogan] = useState(churchSettings.slogan);
  const [pastorName, setPastorName] = useState(churchSettings.pastorName);
  const [phone, setPhone] = useState(churchSettings.phone);
  const [email, setEmail] = useState(churchSettings.email);
  const [website, setWebsite] = useState(churchSettings.website);
  const [address, setAddress] = useState(churchSettings.address);
  const [primaryColor, setPrimaryColor] = useState(churchSettings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(churchSettings.secondaryColor);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateChurchSettings({
      churchName,
      slogan,
      pastorName,
      phone,
      email,
      website,
      address,
      primaryColor,
      secondaryColor,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Church & Administrative Settings</h1>
          <p className="text-xs text-slate-500">Manage church identity, brand colors, WhatsApp integration, and AI parameters</p>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Rocket className="w-4 h-4" />
          <span>Launch Setup Wizard (10 Steps)</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Church identity and configuration updated successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Section 1: Church Profile */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Church className="w-5 h-5 text-[#0a3678]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Church Identity & Pastoral Office</h3>
              <p className="text-xs text-slate-500">Official names and contact channels visible across all member dashboards</p>
            </div>
          </div>

          {/* Official Logo Banner */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white p-1 border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
              <img 
                src="/church-logo.jpg" 
                alt="Official Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 font-extrabold text-base">
                <span className="text-[#0a3678]">The</span>
                <span className="text-[#df991d]">Church</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Connecting the Church. Caring for People. Growing Together.
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center justify-center sm:justify-start gap-1">
                ✓ Active Official Church Logo Emblem
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Church Name</label>
              <input
                type="text"
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Church Slogan</label>
              <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lead Pastor's Name</label>
              <input
                type="text"
                value={pastorName}
                onChange={(e) => setPastorName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Church Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sanctuary Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Sanctuary Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Visual Branding & Colors */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Palette className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custom Brand Colors</h3>
              <p className="text-xs text-slate-500">Pick signature church colors for badges, icons, and member cards</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Primary Theme Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer"
                />
                <span className="font-mono text-xs text-slate-700">{primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Secondary Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer"
                />
                <span className="font-mono text-xs text-slate-700">{secondaryColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Save All Church Profile Settings
          </button>
        </div>
      </form>

      {/* Section 3: Realistic Demo Data Reset */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Reset Demo Data</h4>
            <p className="text-xs text-slate-500">
              Restore the initial 20 realistic church members, departments, events, sermons, and celebration greetings.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all church data to default demonstration state?')) {
                resetDemoData();
              }
            }}
            className="bg-white border border-slate-300 hover:bg-rose-50 hover:border-rose-300 text-rose-700 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <FirstRunSetupWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
      />
    </div>
  );
};
