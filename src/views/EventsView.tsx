import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  Calendar, Clock, MapPin, User, Plus, 
  Share2, Bell, CheckCircle2, Download, Trash2, X 
} from 'lucide-react';
import { ChurchEvent } from '../types';

export const EventsView: React.FC = () => {
  const { events, addEvent, deleteEvent, registerForEvent, sendWhatsAppMessage, churchSettings } = useChurch();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [registeredSuccess, setRegisteredSuccess] = useState<string | null>(null);

  // New Event Form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'sunday_service' as ChurchEvent['category'],
    date: '2026-10-11',
    startTime: '09:00',
    endTime: '11:30',
    location: 'Main Sanctuary & Online',
    speaker: churchSettings.pastorName,
    registrationRequired: false,
    targetAudience: 'General Congregation',
  });

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(e => e.category === selectedCategory);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    addEvent({
      ...formData,
      posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    });
    setShowAddModal(false);
  };

  const handleRegister = (eventId: string, title: string) => {
    registerForEvent(eventId, 'current-user');
    setRegisteredSuccess(title);
    setTimeout(() => setRegisteredSuccess(null), 3000);
  };

  // Generate .ics calendar invite
  const downloadCalendarFile = (event: ChurchEvent) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//The Church//EN
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Church Calendar & Gatherings</h1>
          <p className="text-xs text-slate-500">Upcoming worship encounters, conferences, and prayer vigils</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Event</span>
        </button>
      </div>

      {registeredSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>You have successfully registered for "{registeredSuccess}". A confirmation reminder has been queued.</span>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'sunday_service', 'bible_study', 'revival', 'youth', 'special'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-teal-700 text-white' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredEvents.map(event => (
          <div 
            key={event.id}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {event.posterUrl && (
              <div className="h-44 w-full overflow-hidden relative">
                <img 
                  src={event.posterUrl} 
                  alt={event.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {event.category.replace('_', ' ')}
                </div>
              </div>
            )}

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-rose-600 text-xs font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{event.date} · {event.startTime} - {event.endTime}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{event.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{event.description}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Minister: <strong>{event.speaker}</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => downloadCalendarFile(event)}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                  title="Add to Device Calendar"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleRegister(event.id, event.title)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Register / Check-in Attendance ({event.registeredCount || 140})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Schedule Church Gathering</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunday Anointing Service"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  >
                    <option value="sunday_service">Sunday Service</option>
                    <option value="bible_study">Bible Study</option>
                    <option value="prayer_meeting">Prayer Meeting</option>
                    <option value="revival">Revival / Vigil</option>
                    <option value="youth">Youth Meeting</option>
                    <option value="special">Special Conference</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Speaker / Preacher</label>
                <input
                  type="text"
                  value={formData.speaker}
                  onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl"
                >
                  Save & Queue Reminders
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
