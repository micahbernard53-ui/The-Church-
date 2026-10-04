import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  X, CheckCircle, ChevronRight, ChevronLeft, Church, 
  Palette, Users, Send, Bell, Sparkles, Rocket 
} from 'lucide-react';

interface FirstRunSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirstRunSetupWizard: React.FC<FirstRunSetupWizardProps> = ({ isOpen, onClose }) => {
  const { churchSettings, updateChurchSettings, whatsAppConfig, updateWhatsAppConfig } = useChurch();
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [churchName, setChurchName] = useState(churchSettings.churchName);
  const [slogan, setSlogan] = useState(churchSettings.slogan);
  const [pastorName, setPastorName] = useState(churchSettings.pastorName);
  const [phone, setPhone] = useState(churchSettings.phone);
  const [email, setEmail] = useState(churchSettings.email);
  const [address, setAddress] = useState(churchSettings.address);
  const [primaryColor, setPrimaryColor] = useState(churchSettings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(churchSettings.secondaryColor);

  // WhatsApp setup
  const [phoneNumberId, setPhoneNumberId] = useState(whatsAppConfig.phoneNumberId);
  const [wabaId, setWabaId] = useState(whatsAppConfig.wabaId);
  const [approvalMode, setApprovalMode] = useState<'manual' | 'automatic'>(whatsAppConfig.approvalMode);

  if (!isOpen) return null;

  const totalSteps = 10;

  const stepsMeta = [
    { step: 1, title: 'Church Information' },
    { step: 2, title: 'Upload Church Logo' },
    { step: 3, title: 'Choose Brand Colors' },
    { step: 4, title: 'Pastor / Admin Account' },
    { step: 5, title: 'Import / Register Members' },
    { step: 6, title: 'Create Departments' },
    { step: 7, title: 'Connect WhatsApp Cloud API' },
    { step: 8, title: 'Configure Notifications' },
    { step: 9, title: 'Configure AI Pastoral Assistant' },
    { step: 10, title: 'Launch Church Portal' },
  ];

  const handleNext = () => {
    if (currentStep === 1 || currentStep === 3 || currentStep === 4) {
      updateChurchSettings({
        churchName,
        slogan,
        pastorName,
        phone,
        email,
        address,
        primaryColor,
        secondaryColor,
      });
    }

    if (currentStep === 7) {
      updateWhatsAppConfig({
        phoneNumberId,
        wabaId,
        approvalMode,
      });
    }

    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      updateChurchSettings({ setupCompleted: true });
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] bg-teal-800 text-teal-200 font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
              Setup Wizard · Step {currentStep} of {totalSteps}
            </span>
            <h2 className="text-base font-bold mt-1 text-white">{stepsMeta[currentStep - 1].title}</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div 
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Content Body for Each Step */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {currentStep === 1 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Provide official identity details for your local church.</p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Church Name</label>
                <input
                  type="text"
                  value={churchName}
                  onChange={(e) => setChurchName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Church Slogan / Tagline</label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sanctuary Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 text-center py-4">
              <p className="text-xs font-bold text-slate-800">Official Emblem & Visual Brand Mark:</p>
              <div className="flex justify-center">
                <div className="w-28 h-28 rounded-3xl border-2 border-slate-200 flex items-center justify-center bg-white p-2 shadow-sm">
                  <img src="/church-logo.jpg" alt="The Church Logo" className="w-full h-full object-contain" />
                </div>
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-extrabold text-[#0a3678]">The </span>
                <span className="font-extrabold text-[#df991d]">Church</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Connecting the Church. Caring for People. Growing Together.</p>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold">✓ Exact Logo Loaded</p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Customize the visual palette matching your church brand identity:</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-600">{primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Secondary Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-600">{secondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Head Pastor and Super Administrator profile:</p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Pastor's Name</label>
                <input
                  type="text"
                  value={pastorName}
                  onChange={(e) => setPastorName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Pastoral Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-3 py-2">
              <Users className="w-10 h-10 text-emerald-600 mx-auto" />
              <p className="text-xs text-center text-slate-600">
                You can import existing member records using CSV/Excel in the <strong>Members</strong> tab or register them manually.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                ✓ Includes name, phone, WhatsApp number, birthday, department, and baptism status.
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-2 py-2">
              <p className="text-xs text-slate-600 font-medium">Preconfigured Church Departments:</p>
              <ul className="text-xs space-y-1 text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <li>• Sanctuary Choir</li>
                <li>• Ushering & Protocol</li>
                <li>• Youth & Young Adults (Ignite)</li>
                <li>• Media & Communications</li>
                <li>• Intercessory Prayer Team</li>
                <li>• Welfare & Hospitality</li>
              </ul>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Connect official WhatsApp Cloud API for delivering member greetings and service reminders.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number ID</label>
                <input
                  type="text"
                  placeholder="e.g. 104829104829104"
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Business Account ID</label>
                <input
                  type="text"
                  placeholder="e.g. 294820194820194"
                  value={wabaId}
                  onChange={(e) => setWabaId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="space-y-3 py-2">
              <Bell className="w-10 h-10 text-blue-600 mx-auto" />
              <p className="text-xs text-center text-slate-600">
                Automatic scheduled triggers enabled:
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-700">
                <p>✓ Morning 7:00 AM Birthday check</p>
                <p>✓ 3-day and 24-hour service reminders</p>
                <p>✓ Absent member care flags</p>
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div className="space-y-3">
              <Sparkles className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-xs text-center text-slate-600">
                AI Pastoral Assistant powered by <strong>Gemini</strong>. Set pastoral review protocol:
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setApprovalMode('manual')}
                  className={`flex-1 p-3 rounded-xl border text-xs text-left cursor-pointer ${approvalMode === 'manual' ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold' : 'border-slate-200 bg-white text-slate-700'}`}
                >
                  <p className="font-bold">Manual Approval (Recommended)</p>
                  <p className="text-[10px] text-slate-500 mt-1">AI drafts → Pastor reviews & approves → Sent via WhatsApp.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalMode('automatic')}
                  className={`flex-1 p-3 rounded-xl border text-xs text-left cursor-pointer ${approvalMode === 'automatic' ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold' : 'border-slate-200 bg-white text-slate-700'}`}
                >
                  <p className="font-bold">Automatic Mode</p>
                  <p className="text-[10px] text-slate-500 mt-1">System sends generated greetings according to rules.</p>
                </button>
              </div>
            </div>
          )}

          {currentStep === 10 && (
            <div className="text-center py-6 space-y-4">
              <Rocket className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-slate-900">Your Church Portal is Ready!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {churchSettings.churchName} is ready to connect, care, and minister with excellence.
              </p>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>{currentStep === totalSteps ? 'Launch Sanctuary Portal' : 'Continue'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
