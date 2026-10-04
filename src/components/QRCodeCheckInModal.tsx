import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { X, QrCode, CheckCircle, AlertCircle, UserPlus, Users } from 'lucide-react';
import { Member } from '../types';

interface QRCodeCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeCheckInModal: React.FC<QRCodeCheckInModalProps> = ({ isOpen, onClose }) => {
  const { events, members, attendance, recordAttendance } = useChurch();

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [isFirstTimer, setIsFirstTimer] = useState<boolean>(false);
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorPhone, setVisitorPhone] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (isFirstTimer) {
      if (!visitorName.trim()) {
        setErrorMessage('Please provide visitor full name.');
        return;
      }
      recordAttendance({
        eventId: currentEvent.id,
        eventName: currentEvent.title,
        eventDate: currentEvent.date,
        memberId: `vis-${Date.now()}`,
        memberName: `${visitorName} (Visitor)`,
        checkInMethod: 'qr_code',
        isFirstTimer: true,
      });
      setSuccessMessage(`Welcome! First-time visitor ${visitorName} checked in successfully.`);
      setVisitorName('');
      setVisitorPhone('');
      return;
    }

    if (!selectedMemberId) {
      setErrorMessage('Please select a member to check in.');
      return;
    }

    const member = members.find(m => m.id === selectedMemberId);
    if (!member) return;

    // Duplicate check-in prevention
    const alreadyCheckedIn = attendance.some(
      a => a.eventId === currentEvent.id && a.memberId === member.id && a.eventDate === currentEvent.date
    );

    if (alreadyCheckedIn) {
      setErrorMessage(`${member.fullName} is already checked in for this service!`);
      return;
    }

    recordAttendance({
      eventId: currentEvent.id,
      eventName: currentEvent.title,
      eventDate: currentEvent.date,
      memberId: member.id,
      memberName: member.fullName,
      checkInMethod: 'qr_code',
      isFirstTimer: false,
    });

    setSuccessMessage(`Amen! ${member.fullName} checked in successfully for ${currentEvent.title}.`);
    setSelectedMemberId('');
  };

  const serviceQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`THE_CHURCH:EVENT:${currentEvent.id}:${currentEvent.date}`)}&margin=4`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600/30 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-base font-bold">Service Attendance & QR Check-In</h2>
              <p className="text-xs text-slate-400">Scan at sanctuary entrance or check in members</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {/* Select Event */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Service or Meeting</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden focus:ring-1 focus:ring-teal-600"
            >
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} — {ev.date} ({ev.startTime})
                </option>
              ))}
            </select>
          </div>

          {/* QR Display for Congregation to Scan */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <img src={serviceQrUrl} alt="Service QR" className="w-40 h-40 rounded-xl shadow-xs border border-slate-200" />
            <p className="text-xs font-bold text-slate-900 mt-3">Sanctuary Entrance QR Code</p>
            <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
              Members can scan this code with their smartphone camera or through the Church App to check in instantly.
            </p>
          </div>

          {/* Status Notifications */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Manual or Simulated QR Scanner Check-in */}
          <form onSubmit={handleCheckIn} className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Desk / Usher Fast Check-in</span>
              <button
                type="button"
                onClick={() => setIsFirstTimer(!isFirstTimer)}
                className="text-[11px] text-teal-700 font-semibold hover:underline flex items-center gap-1"
              >
                {isFirstTimer ? <Users className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                {isFirstTimer ? 'Check in Existing Member' : '+ Register First-Timer / Visitor'}
              </button>
            </div>

            {!isFirstTimer ? (
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Select Member from Directory</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                >
                  <option value="">-- Choose member --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.departmentName})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-2 bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                <input
                  type="text"
                  placeholder="Visitor's Full Name"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 outline-hidden"
                />
                <input
                  type="text"
                  placeholder="WhatsApp Number (e.g. +1 555-0199)"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 outline-hidden"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Confirm Check-in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
