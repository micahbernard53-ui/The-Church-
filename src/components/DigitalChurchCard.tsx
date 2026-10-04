import React from 'react';
import { useChurch } from '../context/ChurchContext';
import { X, ShieldCheck, Download, Share2 } from 'lucide-react';
import { Member } from '../types';

interface DigitalChurchCardProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalChurchCard: React.FC<DigitalChurchCardProps> = ({ member, isOpen, onClose }) => {
  const { churchSettings } = useChurch();

  if (!isOpen) return null;

  const membershipId = `TCOG-${member.id.replace('mem-', '').padStart(5, '0')}`;

  // Encoded SVG QR Code representation
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`THE_CHURCH:MEMBER:${member.id}:${membershipId}`)}&margin=4`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Card Header Close */}
        <div className="p-3 bg-slate-900 flex justify-end">
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Physical Card Mockup Graphic */}
        <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Church Branding Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white p-0.5 shadow-sm overflow-hidden flex items-center justify-center">
                <img 
                  src="/church-logo.jpg" 
                  alt="The Church Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }} 
                />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide text-white leading-none">
                  <span>The </span>
                  <span className="text-[#df991d]">Church</span>
                </h3>
                <p className="text-[10px] text-amber-300 font-mono tracking-wider mt-0.5">OFFICIAL MEMBER PASS</p>
              </div>
            </div>
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>

          {/* Member Details & Photo */}
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
              alt={member.fullName} 
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-white truncate leading-tight">{member.fullName}</h2>
              <p className="text-xs text-teal-200 mt-0.5">{member.departmentName}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] bg-white/10 text-white px-2 py-0.5 rounded-sm font-mono tracking-widest uppercase">
                  {membershipId}
                </span>
                <span className="text-[10px] text-emerald-400 capitalize flex items-center gap-1">
                  ● {member.memberStatus}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Section for Fast Service Check-In */}
          <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-slate-900 shadow-lg">
            <img 
              src={qrSvgUrl} 
              alt="Membership QR Code" 
              className="w-36 h-36 rounded-lg"
            />
            <p className="text-[11px] font-bold text-slate-800 mt-2 tracking-wide font-mono">SCAN FOR SERVICE CHECK-IN</p>
            <p className="text-[10px] text-slate-400">Validated by Pastoral Secretariat</p>
          </div>

          {/* Footer Card Info */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span>Joined: {member.dateJoined}</span>
            <span>Baptism: {member.baptismStatus}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-around gap-2 text-xs">
          <button 
            onClick={() => window.print()} 
            className="flex-1 py-2 px-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save / Print</span>
          </button>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${member.fullName}'s Digital Church Pass`,
                  text: `Official Member Pass for ${churchSettings.churchName}`,
                }).catch(() => {});
              }
            }}
            className="flex-1 py-2 px-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
