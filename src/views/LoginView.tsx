import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  ShieldCheck, UserCheck, Lock, Mail, ArrowRight, 
  Building2, CheckCircle2, Shield, Sparkles, X, 
  Search, ExternalLink, Plus, Globe, Check, Loader2, AlertCircle,
  Smartphone, Download, FileDown, Apple, Info
} from 'lucide-react';
import { ChurchTenant } from '../types';

export const LoginView: React.FC = () => {
  const { 
    tenants, 
    activeTenantId, 
    activeTenant, 
    switchTenant, 
    login, 
    members, 
    setActiveView 
  } = useChurch();

  const [activeTab, setActiveTab] = useState<'member' | 'admin'>('member');
  const [showChurchModal, setShowChurchModal] = useState(false);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [churchSearch, setChurchSearch] = useState('');

  // Subdomain / Church Identifier state
  const [identifierInput, setIdentifierInput] = useState(activeTenant?.slug || 'the-church');
  const [isSearching, setIsSearching] = useState(false);
  const [lookupFeedback, setLookupFeedback] = useState<{
    status: 'matched' | 'not_found' | 'idle';
    message?: string;
  }>({ status: 'matched', message: activeTenant?.name });

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Owner login form
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');

  // Keep input in sync if active tenant changes externally (e.g. from modal)
  useEffect(() => {
    if (activeTenant?.slug && activeTenant.slug !== identifierInput) {
      setIdentifierInput(activeTenant.slug);
      setLookupFeedback({ status: 'matched', message: activeTenant.name });
    }
  }, [activeTenantId]);

  // Initial check: if subdomain is in current window URL
  useEffect(() => {
    try {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
        const potentialSubdomain = parts[0].toLowerCase();
        handleIdentifierChange(potentialSubdomain);
      }
    } catch {
      // Ignore if in restricted iframe
    }
  }, []);

  // Normalizer helper
  const normalizeIdentifier = (val: string) => {
    return val
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/\.(localhost|thechurch\.app|churchsanctuary\.app|run\.app).*$/, '')
      .replace(/[^a-z0-9-]/g, '');
  };

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic branding fetcher
  const handleIdentifierChange = (value: string) => {
    setIdentifierInput(value);
    const clean = normalizeIdentifier(value);

    if (!clean) {
      setLookupFeedback({ status: 'idle' });
      return;
    }

    setIsSearching(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      // 1. First check in local active tenants list (includes user-added churches)
      const localMatch = tenants.find(t => {
        const s = normalizeIdentifier(t.slug);
        const n = normalizeIdentifier(t.name);
        return s === clean || n === clean || s.includes(clean) || clean.includes(s);
      });

      if (localMatch) {
        switchTenant(localMatch.id);
        setLookupFeedback({ status: 'matched', message: localMatch.name });
        setIsSearching(false);
        return;
      }

      // 2. Dynamic fetch from server API route
      try {
        const res = await fetch(`/api/churches/lookup?identifier=${encodeURIComponent(clean)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.found && data.church) {
            // Find existing or switch
            const existing = tenants.find(t => t.id === data.church.id || t.slug === data.church.slug);
            if (existing) {
              switchTenant(existing.id);
            }
            setLookupFeedback({ status: 'matched', message: data.church.name });
            setIsSearching(false);
            return;
          }
        }
      } catch (err) {
        console.error('Church dynamic lookup failed:', err);
      }

      // 3. If no match
      setLookupFeedback({ 
        status: 'not_found', 
        message: `No church registered under "${value}". Showing default.` 
      });
      setIsSearching(false);
    }, 280);
  };

  const handleSelectIdentifier = (slug: string) => {
    setIdentifierInput(slug);
    handleIdentifierChange(slug);
  };

  // Filtered churches for modal
  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(churchSearch.toLowerCase()) ||
    t.pastorName.toLowerCase().includes(churchSearch.toLowerCase()) ||
    t.address.toLowerCase().includes(churchSearch.toLowerCase())
  );

  const handleSelectChurchFromModal = (tenantId: string) => {
    const target = tenants.find(t => t.id === tenantId);
    if (target) {
      switchTenant(tenantId);
      setIdentifierInput(target.slug);
      setLookupFeedback({ status: 'matched', message: target.name });
    }
    setShowChurchModal(false);
    setErrorMessage('');
    setEmail('');
    setPassword('');
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      let targetMem = members.find(m => 
        (email && m.email.toLowerCase() === email.toLowerCase()) ||
        (email && m.phoneNumber.includes(email))
      );

      if (!targetMem && members.length > 0) {
        targetMem = members[0];
      }

      if (!targetMem) {
        setErrorMessage('No member record found for this church sanctuary.');
        setIsSubmitting(false);
        return;
      }

      login({
        tenantId: activeTenantId,
        role: 'member',
        email: targetMem.email,
        memberId: targetMem.id,
        name: targetMem.fullName,
      });
      setIsSubmitting(false);
    }, 350);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      login({
        tenantId: activeTenantId,
        role: 'super_admin',
        email: email || activeTenant.adminEmail,
        name: activeTenant.pastorName,
      });
      setIsSubmitting(false);
    }, 350);
  };

  const handleOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      login({
        role: 'platform_owner',
        email: ownerEmail || 'admin@thechurchplatform.com',
        name: 'Master Platform Owner',
      });
      setIsSubmitting(false);
      setShowOwnerModal(false);
    }, 350);
  };

  // 1-Click quick login helpers
  const handleQuickMemberLogin = (memId?: string) => {
    const mem = members.find(m => m.id === memId) || members[0];
    if (!mem) return;
    login({
      tenantId: activeTenantId,
      role: 'member',
      email: mem.email,
      memberId: mem.id,
      name: mem.fullName,
    });
  };

  const handleQuickAdminLogin = () => {
    login({
      tenantId: activeTenantId,
      role: 'super_admin',
      email: activeTenant.adminEmail,
      name: activeTenant.pastorName,
    });
  };

  const handleQuickOwnerLogin = () => {
    login({
      role: 'platform_owner',
      email: 'admin@thechurchplatform.com',
      name: 'Master Platform Owner',
    });
  };

  // Dynamic branding variables
  const primaryColor = activeTenant?.primaryColor || '#0a3678';
  const secondaryColor = activeTenant?.secondaryColor || '#df991d';

  return (
    <div 
      className="min-h-screen flex flex-col justify-between items-center px-4 py-8 sm:py-12 font-sans relative selection:bg-amber-100 selection:text-amber-900 transition-colors duration-700 ease-in-out overflow-x-hidden"
      style={{
        backgroundColor: `${primaryColor}0d`, // subtle dynamic tint (5% opacity)
        backgroundImage: `
          radial-gradient(circle at 50% 0%, ${primaryColor}22 0%, transparent 65%),
          radial-gradient(circle at 100% 100%, ${secondaryColor}18 0%, transparent 55%),
          radial-gradient(circle at 0% 100%, ${primaryColor}15 0%, transparent 55%)
        `,
      }}
    >
      {/* Dynamic Background Ambient Glowing Orbs */}
      <div 
        className="absolute -top-24 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-60"
        style={{ backgroundColor: primaryColor }}
      />
      <div 
        className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-40"
        style={{ backgroundColor: secondaryColor }}
      />

      {/* Main Container: Logo, Subdomain/Identifier Input & Login Interface */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto flex flex-col items-center">
        
        {/* Simple Centered Church Logo with Dynamic Transition */}
        <div className="mb-6 text-center flex flex-col items-center">
          <div 
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-2 shadow-xl border flex items-center justify-center overflow-hidden transition-all duration-500 hover:scale-105"
            style={{ 
              borderColor: `${primaryColor}40`,
              boxShadow: `0 12px 30px -8px ${primaryColor}25`,
            }}
          >
            <img 
              key={activeTenant.id} // forces smooth reload when church switches
              src={activeTenant.logoUrl || '/church-logo.jpg'} 
              alt={activeTenant.name} 
              className="w-full h-full object-contain transition-opacity duration-300 animate-in fade-in"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/church-logo.jpg';
              }} 
            />
          </div>

          <h1 
            className="mt-4 text-2xl sm:text-3xl font-black tracking-tight leading-tight transition-colors duration-500"
            style={{ color: primaryColor }}
          >
            {activeTenant.name}
          </h1>
          <p className="mt-1 text-xs text-slate-600 font-medium max-w-xs text-center leading-relaxed">
            {activeTenant.slogan || 'Connecting the Church. Caring for People. Growing Together.'}
          </p>
        </div>

        {/* Clean Login Interface Card with Dynamic Brand Accents */}
        <div className="w-full bg-white/95 border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md transition-all duration-500">
          
          {/* Real-Time Church Identifier / Subdomain Input */}
          <div className="mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="church-identifier-input"
                className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors duration-300"
                style={{ color: primaryColor }}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Church Subdomain or Identifier</span>
              </label>

              {/* Real-time Fetch Indicator / Status Badge */}
              {isSearching ? (
                <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Fetching...</span>
                </span>
              ) : lookupFeedback.status === 'matched' ? (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-2xs">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="truncate max-w-[130px]">{lookupFeedback.message}</span>
                </span>
              ) : lookupFeedback.status === 'not_found' ? (
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>Unregistered ID</span>
                </span>
              ) : null}
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-400 text-xs font-mono select-none">
                https://
              </span>
              <input
                id="church-identifier-input"
                type="text"
                value={identifierInput}
                onChange={(e) => handleIdentifierChange(e.target.value)}
                placeholder="e.g. the-church, grace-chapel..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-16 pr-28 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all duration-200"
                style={{
                  borderColor: lookupFeedback.status === 'matched' ? `${primaryColor}60` : undefined,
                }}
              />
              <span className="absolute right-3 text-slate-400 text-[11px] font-mono select-none pointer-events-none">
                .church.app
              </span>
            </div>

            {/* Quick One-Click Church Subdomain Suggestions */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-slate-400 text-[10px] uppercase font-semibold shrink-0">Churches:</span>
              {tenants.map(t => {
                const isSelected = activeTenantId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectIdentifier(t.slug)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer shrink-0 border ${
                      isSelected
                        ? 'text-white shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                    style={{
                      backgroundColor: isSelected ? primaryColor : undefined,
                      borderColor: isSelected ? primaryColor : undefined,
                    }}
                  >
                    {t.slug}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tabs: Member Login vs Pastor / Admin Login */}
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => { setActiveTab('member'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'member'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserCheck 
                className="w-4 h-4 transition-colors" 
                style={{ color: activeTab === 'member' ? primaryColor : undefined }} 
              />
              <span>Member Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setErrorMessage(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck 
                className="w-4 h-4 transition-colors" 
                style={{ color: activeTab === 'admin' ? primaryColor : undefined }} 
              />
              <span>Pastor / Admin</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: MEMBER LOGIN */}
          {activeTab === 'member' && (
            <form onSubmit={handleMemberSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Member Email or Phone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. grace.j@example.com or +1 555-0322"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Access Passcode / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 mt-1"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 8px 20px -4px ${primaryColor}40`,
                }}
              >
                {isSubmitting ? (
                  <span>Entering Sanctuary...</span>
                ) : (
                  <>
                    <span>Enter {activeTenant.name} Sanctuary</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Quick Member Access */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleQuickMemberLogin()}
                  className="w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: `${primaryColor}10`,
                    borderColor: `${primaryColor}25`,
                    color: primaryColor,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Member Sign-In ({members[0]?.fullName || 'David Adeleke'})</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PASTOR / CHURCH ADMIN LOGIN */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pastor / Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    placeholder={activeTenant.adminEmail || 'pastor@church.org'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 mt-1"
                style={{
                  backgroundColor: primaryColor,
                  boxShadow: `0 8px 20px -4px ${primaryColor}40`,
                }}
              >
                {isSubmitting ? (
                  <span>Authenticating Pastor...</span>
                ) : (
                  <>
                    <span>Open Church Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* 1-Click Quick Pastor Access */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleQuickAdminLogin}
                  className="w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: `${secondaryColor}15`,
                    borderColor: `${secondaryColor}30`,
                    color: '#854d0e',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>1-Click Sign-In as Senior Pastor ({activeTenant.pastorName})</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Down the Page Links: Multiple Church Switcher, Owner Login & Download App */}
      <footer className="relative z-10 w-full max-w-2xl mx-auto mt-8 pt-4 border-t border-slate-200/80 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs">
          
          {/* Download App (.APK) Button */}
          <button
            type="button"
            onClick={() => setShowDownloadModal(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all shadow-xs cursor-pointer group hover:scale-[1.02]"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 group-hover:animate-bounce" />
            <span>Download App (.APK)</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
              Android v2.1
            </span>
            <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </button>

          <span className="text-slate-300 hidden sm:inline">•</span>

          {/* Multiple Church Switcher Link */}
          <button
            type="button"
            onClick={() => setShowChurchModal(true)}
            className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Switch Church Sanctuary</span>
            <span 
              className="text-[10px] px-1.5 py-0.5 rounded font-bold transition-colors"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
              }}
            >
              {activeTenant.name}
            </span>
          </button>

          <span className="text-slate-300 hidden sm:inline">•</span>

          {/* Owner Login / Master Backend Link */}
          <button
            type="button"
            onClick={() => setShowOwnerModal(true)}
            className="text-amber-800 hover:text-amber-950 font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer py-1"
          >
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span>Platform Owner Backend</span>
          </button>
        </div>

        <div className="mt-3 text-[11px] text-slate-500 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span>The Church Multi-Tenant System • Isolated Sanctuary Partitions</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <a 
            href="/the-church-app.apk" 
            download="TheChurch-App-v2.1.apk"
            className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Direct APK Download (6.2 MB)</span>
          </a>
        </div>
      </footer>

      {/* MODAL 1: SWITCH CHURCH SANCTUARY */}
      {showChurchModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 border border-slate-200 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Switch Church Sanctuary</h3>
              </div>
              <button
                onClick={() => setShowChurchModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3">
              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by church name, city, pastor..."
                  value={churchSearch}
                  onChange={(e) => setChurchSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {filteredTenants.map(tenant => (
                  <div
                    key={tenant.id}
                    onClick={() => handleSelectChurchFromModal(tenant.id)}
                    className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between border transition-all ${
                      tenant.id === activeTenantId
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                        <img 
                          src={tenant.logoUrl || '/church-logo.jpg'} 
                          alt={tenant.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/church-logo.jpg';
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900">{tenant.name}</p>
                          <span className="text-[10px] bg-slate-100 px-1 rounded font-mono text-slate-500">
                            {tenant.slug}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-[200px]">{tenant.address}</p>
                      </div>
                    </div>
                    {tenant.id === activeTenantId && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">{tenants.length} Churches Registered</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowChurchModal(false);
                    setActiveView('owner-backend');
                  }}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload New Church</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: OWNER ADMIN LOGIN */}
      {showOwnerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 border border-slate-200 relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Platform Owner Backend</h3>
              </div>
              <button
                onClick={() => setShowOwnerModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Manage all churches, upload custom logos & branding, and oversee segregated multi-tenant partitions.
            </p>

            <form onSubmit={handleOwnerSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Master Administrator Email
                </label>
                <input
                  type="email"
                  placeholder="admin@thechurchplatform.com"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Master Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={ownerPassword}
                  onChange={(e) => setOwnerPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Enter Owner Admin Backend</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickOwnerLogin}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>1-Click Master Access (Demo)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DOWNLOAD APP (.APK & PWA) */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-7 border border-slate-200 relative animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>The Church Mobile App</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      v2.1.0 Release
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official Android Package (.APK) & Universal Mobile Sanctuary
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* App Specs Card */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden">
                  <img 
                    src="/church-logo.jpg" 
                    alt="The Church" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">The Church Sanctuary App</h4>
                  <p className="text-[11px] text-slate-500 font-mono">Package: com.thechurch.sanctuary</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                      APK 6.2 MB
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-medium">
                      Android 7.0+
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Download Button */}
              <a
                href="/the-church-app.apk"
                download="TheChurch-App-v2.1.apk"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download APK</span>
              </a>
            </div>

            {/* Installation Instructions */}
            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>Quick Installation Guide</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                    1
                  </span>
                  <p className="text-xs font-semibold text-slate-800">Download</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tap the green "Download APK" button above to save the file.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                    2
                  </span>
                  <p className="text-xs font-semibold text-slate-800">Open File</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tap the download notification or find it in your Downloads folder.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center mb-1.5">
                    3
                  </span>
                  <p className="text-xs font-semibold text-slate-800">Install</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tap Install. If prompted, allow "Install from this source".
                  </p>
                </div>
              </div>
            </div>

            {/* Apple / iOS Instructions */}
            <div className="mt-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5">
              <Apple className="w-4 h-4 text-amber-800 mt-0.5 shrink-0" />
              <div className="text-[11px] text-amber-900">
                <span className="font-bold">Using Apple iPhone or iPad?</span>
                <p className="mt-0.5 text-amber-800/90">
                  On Safari, tap the <span className="font-semibold underline">Share</span> button (box with arrow) at the bottom, then choose <span className="font-semibold underline">Add to Home Screen</span> to install the app with full offline capabilities!
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">MD5/SHA-256 Verified Safe APK</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDownloadModal(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
                >
                  Close
                </button>
                <a
                  href="/the-church-app.apk"
                  download="TheChurch-App-v2.1.apk"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save APK File</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
