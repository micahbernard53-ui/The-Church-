import React, { useState, useMemo } from 'react';
import { useChurch } from '../context/ChurchContext';
import { Search, X, BookOpen, Video, Calendar, User, FileText, Bell } from 'lucide-react';
import { BIBLE_VERSES_DATABASE } from '../mockData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { sermons, events, members, announcements, documents, setActiveView, currentUser } = useChurch();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return null;
    const q = query.toLowerCase();

    const matchedSermons = sermons.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.speaker.toLowerCase().includes(q) || 
      s.category.toLowerCase().includes(q) ||
      s.bibleReferences.some(r => r.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedBible = BIBLE_VERSES_DATABASE.filter(b => 
      b.text.toLowerCase().includes(q) || 
      b.book.toLowerCase().includes(q) || 
      (b.topic && b.topic.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedEvents = events.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.description.toLowerCase().includes(q) || 
      e.speaker.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedAnnouncements = announcements.filter(a => 
      a.title.toLowerCase().includes(q) || 
      a.content.toLowerCase().includes(q)
    ).slice(0, 2);

    const matchedDocs = documents.filter(d => 
      d.title.toLowerCase().includes(q) || 
      d.category.toLowerCase().includes(q)
    ).slice(0, 2);

    // Only allow members search for staff or pastor
    const matchedMembers = currentUser && currentUser.role !== 'member' ? members.filter(m => 
      m.fullName.toLowerCase().includes(q) || 
      m.phoneNumber.includes(q) || 
      m.departmentName.toLowerCase().includes(q)
    ).slice(0, 3) : [];

    const totalCount = matchedSermons.length + matchedBible.length + matchedEvents.length + matchedAnnouncements.length + matchedDocs.length + matchedMembers.length;

    return {
      sermons: matchedSermons,
      bible: matchedBible,
      events: matchedEvents,
      announcements: matchedAnnouncements,
      documents: matchedDocs,
      members: matchedMembers,
      totalCount
    };
  }, [query, sermons, events, announcements, documents, members, currentUser]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sermons, Bible verses, events, documents, members..."
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 outline-hidden bg-transparent"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 font-medium"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {!query.trim() && (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p>Type to search across sermons, Scriptures, announcements, and resources.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['Faith', 'Peace', 'Communion', 'Youth', 'Healing', 'Prayer'].map(topic => (
                  <button
                    key={topic}
                    onClick={() => setQuery(topic)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 text-[11px]"
                  >
                    #{topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results && results.totalCount === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">
              No matching church resources found for "{query}".
            </div>
          )}

          {results && results.totalCount > 0 && (
            <div className="space-y-4">
              {/* Scripture matches */}
              {results.bible.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Holy Scripture</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.bible.map((b, i) => (
                      <div
                        key={i}
                        onClick={() => { setActiveView('bible-devotional'); onClose(); }}
                        className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <p className="text-xs font-semibold text-slate-900">{b.book} {b.chapter}:{b.verse} ({b.translation})</p>
                        <p className="text-xs text-slate-600 italic line-clamp-1">"{b.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sermons */}
              {results.sermons.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sermons & Messages</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.sermons.map(s => (
                      <div
                        key={s.id}
                        onClick={() => { setActiveView('sermons-media'); onClose(); }}
                        className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{s.title}</p>
                          <p className="text-[11px] text-slate-500">{s.speaker} · {s.category}</p>
                        </div>
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium">Listen</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {results.events.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    <span>Church Events</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.events.map(e => (
                      <div
                        key={e.id}
                        onClick={() => { setActiveView('events'); onClose(); }}
                        className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{e.title}</p>
                          <p className="text-[11px] text-slate-500">{e.date} · {e.location}</p>
                        </div>
                        <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium">View</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Members (Staff Only) */}
              {results.members.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Members Directory</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.members.map(m => (
                      <div
                        key={m.id}
                        onClick={() => { setActiveView('members'); onClose(); }}
                        className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <img src={m.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{m.fullName}</p>
                            <p className="text-[11px] text-slate-500">{m.departmentName} · {m.phoneNumber}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Profile</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
