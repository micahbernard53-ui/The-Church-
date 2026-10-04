import React, { useState, useRef } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  Building2, Plus, Upload, Search, Edit3, Trash2, ExternalLink, 
  ShieldCheck, Users, CheckCircle2, AlertTriangle, ArrowRight, 
  Palette, Globe, Phone, Mail, MapPin, Sparkles, RefreshCw, 
  Download, Eye, Lock, LogOut, Check, X, Shield, ArrowLeft
} from 'lucide-react';
import { ChurchTenant } from '../types';

export const OwnerBackendView: React.FC = () => {
  const { 
    tenants, 
    activeTenantId, 
    activeTenant, 
    switchTenant, 
    createTenant, 
    updateTenant, 
    deleteTenant, 
    login, 
    logout, 
    setActiveView 
  } = useChurch();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<ChurchTenant | null>(null);

  // Form states for creating / editing church
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formSlogan, setFormSlogan] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('/church-logo.jpg');
  const [formAddress, setFormAddress] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formPastorName, setFormPastorName] = useState('');
  const [formPastorEmail, setFormPastorEmail] = useState('');
  const [formPrimaryColor, setFormPrimaryColor] = useState('#0a3678');
  const [formSecondaryColor, setFormSecondaryColor] = useState('#df991d');
  const [formPlan, setFormPlan] = useState<'enterprise' | 'growth' | 'starter'>('growth');
  const [formAdminEmail, setFormAdminEmail] = useState('');
  const [formAdminPassword, setFormAdminPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // File upload handler converting image to base64
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, SVG, WebP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (isEdit && editingTenant) {
        setEditingTenant({ ...editingTenant, logoUrl: base64Url });
      } else {
        setFormLogoUrl(base64Url);
      }
    };
    reader.readAsDataURL(file);
  };

  const openCreateModal = () => {
    setFormName('');
    setFormSlug('');
    setFormSlogan('');
    setFormLogoUrl('/church-logo.jpg');
    setFormAddress('');
    setFormPhone('');
    setFormEmail('');
    setFormWebsite('');
    setFormPastorName('');
    setFormPastorEmail('');
    setFormPrimaryColor('#0a3678');
    setFormSecondaryColor('#df991d');
    setFormPlan('growth');
    setFormAdminEmail('');
    setFormAdminPassword('ChurchAdmin2026!');
    setFormError('');
    setShowAddModal(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Church name is required.');
      return;
    }

    const generatedSlug = formSlug.trim() 
      ? formSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      : formName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const newTenant = createTenant({
      name: formName.trim(),
      slug: generatedSlug,
      slogan: formSlogan.trim() || 'Connecting the Church. Caring for People. Growing Together.',
      logoUrl: formLogoUrl || '/church-logo.jpg',
      address: formAddress.trim() || 'Church Headquarters',
      phone: formPhone.trim() || '+1 (555) 0100',
      email: formEmail.trim() || 'office@church.org',
      website: formWebsite.trim() || 'https://thechurch.org',
      pastorName: formPastorName.trim() || 'Pastor',
      pastorEmail: formPastorEmail.trim() || 'pastor@church.org',
      primaryColor: formPrimaryColor,
      secondaryColor: formSecondaryColor,
      status: 'active',
      plan: formPlan,
      memberCount: 1,
      adminEmail: formAdminEmail.trim() || formPastorEmail.trim() || 'pastor@church.org',
      adminPassword: formAdminPassword || 'ChurchAdmin2026!',
    });

    setShowAddModal(false);
    setSuccessToast(`Church "${newTenant.name}" has been uploaded & registered successfully!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const openEditModal = (tenant: ChurchTenant) => {
    setEditingTenant({ ...tenant });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    updateTenant(editingTenant.id, editingTenant);
    setEditingTenant(null);
    setSuccessToast(`Church "${editingTenant.name}" updated successfully!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleDeleteTenant = (tenant: ChurchTenant) => {
    if (tenants.length <= 1) {
      alert('Cannot delete the last remaining church.');
      return;
    }
    if (confirm(`Are you sure you want to delete "${tenant.name}"? This church's records will be completely removed.`)) {
      deleteTenant(tenant.id);
      setSuccessToast(`Church "${tenant.name}" removed.`);
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const handleLaunchAsAdmin = (tenant: ChurchTenant) => {
    login({
      tenantId: tenant.id,
      role: 'super_admin',
      email: tenant.adminEmail,
      name: tenant.pastorName,
    });
  };

  const handleOpenLoginPage = (tenant: ChurchTenant) => {
    switchTenant(tenant.id);
    setActiveView('login');
  };

  // Filtered churches
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.pastorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'active') return matchesSearch && t.status === 'active';
    if (filterStatus === 'suspended') return matchesSearch && t.status === 'suspended';
    return matchesSearch;
  });

  const totalMembers = tenants.reduce((acc, t) => acc + (t.memberCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-slide-up text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Owner Navigation */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 shadow-md flex items-center justify-center">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">The Church Platform</h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  Master Owner Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-Tenant Church Registry & Configuration Backend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveView('login')}
              className="text-xs bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-2 rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login Screen</span>
            </button>

            <button
              onClick={() => handleLaunchAsAdmin(activeTenant)}
              className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Enter Active Church ({activeTenant.name})</span>
            </button>

            <button
              onClick={openCreateModal}
              className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Upload & Register New Church</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Registered Churches</span>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{tenants.length}</div>
            <p className="text-[11px] text-slate-400 mt-1">Multi-tenant active sanctuaries</p>
          </div>

          <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Total Congregants</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{totalMembers.toLocaleString()}+</div>
            <p className="text-[11px] text-slate-400 mt-1">Congregation records across platform</p>
          </div>

          <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Data Segregation</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-5 h-5" />
              <span>100% Isolated Partitions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Zero cross-church data leakage</p>
          </div>

          <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">WhatsApp & AI Cloud</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-base font-bold text-purple-400 flex items-center gap-1.5 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
              <span>Engines Online</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Ready for pastoral broadcasts & care</p>
          </div>
        </div>

        {/* Multi-Tenant Isolation Guarantee Banner */}
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 shrink-0 border border-blue-500/40">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Multi-Church Data Isolation Guarantee</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Enforced
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Multiple churches can operate concurrently on "The Church" platform without any overlap. Each church receives its own isolated namespace for members, attendance records, devotionals, sermon documents, WhatsApp templates, and credentials.
              </p>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Church</span>
          </button>
        </div>

        {/* Church Management Directory Table & Controls */}
        <div className="bg-slate-800/90 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">Registered Churches & Sanctuaries</h2>
              <p className="text-xs text-slate-400">Upload logos, edit church details, or login directly into any church</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search churches, pastors, cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 w-56 sm:w-64"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
            </div>
          </div>

          {/* Churches Grid Cards */}
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTenants.map((tenant) => (
              <div
                key={tenant.id}
                className="bg-slate-900/90 border border-white/10 hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between transition-all group relative overflow-hidden"
              >
                {/* Accent top line matching church's primary color */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: tenant.primaryColor || '#0a3678' }}
                />

                <div>
                  {/* Church Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white p-1 border border-white/20 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
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
                        <h3 className="text-sm font-bold text-white leading-tight">
                          {tenant.name}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          slug: /{tenant.slug}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      tenant.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {tenant.status}
                    </span>
                  </div>

                  {/* Slogan */}
                  <p className="text-xs text-slate-300 italic mb-3 line-clamp-2">
                    "{tenant.slogan}"
                  </p>

                  {/* Information Details */}
                  <div className="space-y-1.5 text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-white/5 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="text-slate-300 font-medium">Pastor:</span>
                      <span className="text-white truncate">{tenant.pastorName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="text-slate-300 font-medium">Location:</span>
                      <span className="truncate">{tenant.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-300 font-medium">Phone:</span>
                      <span>{tenant.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-300 font-medium">Admin:</span>
                      <span className="truncate">{tenant.adminEmail}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleLaunchAsAdmin(tenant)}
                      className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Admin Login</span>
                    </button>

                    <button
                      onClick={() => handleOpenLoginPage(tenant)}
                      className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>Login Portal</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => openEditModal(tenant)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit & Re-upload Logo</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTenant(tenant)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTenants.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium">No churches found matching "{searchQuery}"</p>
              <button
                onClick={openCreateModal}
                className="mt-3 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl"
              >
                Upload & Register This Church
              </button>
            </div>
          )}
        </div>
      </main>

      {/* MODAL 1: UPLOAD & REGISTER NEW CHURCH */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <span>Upload & Register New Church</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Provision a completely isolated church sanctuary with custom logo, branding & credentials
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Church Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Church Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Church, Faith Cathedral"
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (!formSlug) {
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
                      }
                    }}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Church URL Slug / Unique Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. the-church"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* Church Logo Upload */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/10">
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span>Church Logo (Upload Image File or URL)</span>
                  <span className="text-[10px] text-amber-400">Instant Preview Enabled</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Logo preview */}
                  <div className="w-16 h-16 rounded-xl bg-white p-1 border-2 border-amber-400/50 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                    <img 
                      src={formLogoUrl || '/church-logo.jpg'} 
                      alt="Logo preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Logo File...</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoFileUpload(e, false)}
                        className="hidden"
                      />
                      <span className="text-[11px] text-slate-400">PNG, JPG, SVG, WebP</span>
                    </div>

                    <input
                      type="text"
                      placeholder="Or paste an image URL here..."
                      value={formLogoUrl}
                      onChange={(e) => setFormLogoUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Church Slogan / Tagline
                </label>
                <input
                  type="text"
                  placeholder="Connecting the Church. Caring for People. Growing Together."
                  value={formSlogan}
                  onChange={(e) => setFormSlogan(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Pastor details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Senior Pastor's Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pastor David Adeleke"
                    value={formPastorName}
                    onChange={(e) => setFormPastorName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pastor's Direct Email
                  </label>
                  <input
                    type="email"
                    placeholder="pastor@church.org"
                    value={formPastorEmail}
                    onChange={(e) => {
                      setFormPastorEmail(e.target.value);
                      if (!formAdminEmail) setFormAdminEmail(e.target.value);
                    }}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Church Contact & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Church Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 728-4673"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Church Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@church.org"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Church Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://thechurch.org"
                    value={formWebsite}
                    onChange={(e) => setFormWebsite(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Physical Address / Sanctuary Location
                </label>
                <input
                  type="text"
                  placeholder="45 Kingdom Way, Sanctuary Heights, London / Lagos"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Theme Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-3 rounded-xl border border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Primary Brand Color</span>
                    <span className="font-mono text-[10px] text-slate-400">{formPrimaryColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formPrimaryColor}
                      onChange={(e) => setFormPrimaryColor(e.target.value)}
                      className="w-9 h-9 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                    />
                    <div className="flex gap-1.5">
                      {['#0a3678', '#059669', '#7c3aed', '#dc2626', '#0284c7'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormPrimaryColor(c)}
                          className="w-6 h-6 rounded-md border border-white/20 transition-transform hover:scale-110"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Secondary Accent Color</span>
                    <span className="font-mono text-[10px] text-slate-400">{formSecondaryColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formSecondaryColor}
                      onChange={(e) => setFormSecondaryColor(e.target.value)}
                      className="w-9 h-9 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                    />
                    <div className="flex gap-1.5">
                      {['#df991d', '#10b981', '#f59e0b', '#f97316', '#38bdf8'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormSecondaryColor(c)}
                          className="w-6 h-6 rounded-md border border-white/20 transition-transform hover:scale-110"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Credentials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Initial Admin Login Email
                  </label>
                  <input
                    type="email"
                    placeholder="pastor@church.org"
                    value={formAdminEmail}
                    onChange={(e) => setFormAdminEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Initial Admin Password
                  </label>
                  <input
                    type="text"
                    value={formAdminPassword}
                    onChange={(e) => setFormAdminPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Register & Upload Church</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CHURCH INFO & RE-UPLOAD LOGO */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-blue-400" />
                  <span>Edit Church Information & Logo</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Update "{editingTenant.name}" branding, contacts, pastor and color scheme
                </p>
              </div>
              <button
                onClick={() => setEditingTenant(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Church Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Church Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTenant.name}
                    onChange={(e) => setEditingTenant({ ...editingTenant, name: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Church URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTenant.slug}
                    onChange={(e) => setEditingTenant({ ...editingTenant, slug: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Logo Re-upload */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-white/10">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Church Logo (Upload New File or Change URL)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white p-1 border-2 border-blue-400/50 shadow-md shrink-0 flex items-center justify-center overflow-hidden">
                    <img 
                      src={editingTenant.logoUrl || '/church-logo.jpg'} 
                      alt="Logo preview" 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload New Logo File...</span>
                    </button>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoFileUpload(e, true)}
                      className="hidden"
                    />
                    <input
                      type="text"
                      placeholder="Or enter image URL"
                      value={editingTenant.logoUrl}
                      onChange={(e) => setEditingTenant({ ...editingTenant, logoUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Slogan / Tagline
                </label>
                <input
                  type="text"
                  value={editingTenant.slogan}
                  onChange={(e) => setEditingTenant({ ...editingTenant, slogan: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Pastor info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pastor's Name
                  </label>
                  <input
                    type="text"
                    value={editingTenant.pastorName}
                    onChange={(e) => setEditingTenant({ ...editingTenant, pastorName: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pastor's Email
                  </label>
                  <input
                    type="email"
                    value={editingTenant.pastorEmail}
                    onChange={(e) => setEditingTenant({ ...editingTenant, pastorEmail: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Location & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={editingTenant.phone}
                    onChange={(e) => setEditingTenant({ ...editingTenant, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingTenant.email}
                    onChange={(e) => setEditingTenant({ ...editingTenant, email: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={editingTenant.address}
                  onChange={(e) => setEditingTenant({ ...editingTenant, address: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              {/* Status toggle */}
              <div className="flex items-center gap-3 pt-2">
                <label className="text-xs font-semibold text-slate-300">Church Status:</label>
                <select
                  value={editingTenant.status}
                  onChange={(e) => setEditingTenant({ ...editingTenant, status: e.target.value as any })}
                  className="bg-slate-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
