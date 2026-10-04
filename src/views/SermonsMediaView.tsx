import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  Video, Music, FileText, Sparkles, Plus, 
  Download, Eye, Image as ImageIcon, Play, 
  BookOpen, Search, X 
} from 'lucide-react';
import { Sermon, DocumentItem, GalleryItem } from '../types';
import { SermonReaderModal } from '../components/SermonReaderModal';

export const SermonsMediaView: React.FC = () => {
  const { sermons, documents, gallery, addSermon, addDocument, currentUser, churchSettings } = useChurch();

  const [activeTab, setActiveTab] = useState<'sermons' | 'documents' | 'gallery'>('sermons');
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Sermon Form
  const [newTitle, setNewTitle] = useState('');
  const [newSpeaker, setNewSpeaker] = useState(churchSettings.pastorName);
  const [newCategory, setNewCategory] = useState<'Sunday Worship' | 'Faith' | 'Prayer' | 'Spiritual Growth' | 'Family' | 'Leadership'>('Sunday Worship');
  const [newScriptures, setNewScriptures] = useState('Hebrews 11:1, Proverbs 3:5');
  const [newDescription, setNewDescription] = useState('');

  const handleOpenReader = (s: Sermon) => {
    setSelectedSermon(s);
    setSelectedDocument(null);
    setShowReaderModal(true);
  };

  const handleOpenDoc = (d: DocumentItem) => {
    setSelectedDocument(d);
    setSelectedSermon(null);
    setShowReaderModal(true);
  };

  const handleCreateSermon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    addSermon({
      title: newTitle,
      speaker: newSpeaker,
      date: new Date().toISOString().split('T')[0],
      category: newCategory,
      description: newDescription || 'Inspiring biblical message delivered during Sunday fellowship.',
      bibleReferences: newScriptures.split(',').map(s => s.trim()),
      thumbnailUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80',
      duration: '45 mins',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    });
    setShowUploadModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Sermons, Library & Media</h1>
          <p className="text-xs text-slate-500">Audio sermons, study guides, PDF documents, and church albums</p>
        </div>

        {currentUser?.role !== 'member' && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Message / Document</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 pt-3 gap-6 shadow-xs">
        {[
          { id: 'sermons', label: 'Sermon Library', icon: Video },
          { id: 'documents', label: 'PDF Documents & Study Guides', icon: FileText },
          { id: 'gallery', label: 'Photo & Video Gallery', icon: ImageIcon },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-800'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Sermons */}
      {activeTab === 'sermons' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sermons.map(s => (
            <div 
              key={s.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-44 w-full relative overflow-hidden group">
                <img src={s.thumbnailUrl} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <div className="flex items-center justify-between w-full text-white text-xs">
                    <span className="font-semibold">{s.duration || '48 mins'}</span>
                    <span className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{s.category}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-mono">{s.date}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">{s.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">By {s.speaker}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">{s.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {s.bibleReferences.map((ref, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {ref}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleOpenReader(s)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Study & AI Insights</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PDF Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documents.map(doc => (
              <div 
                key={doc.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{doc.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">{doc.downloadCount} Downloads</span>
                  <button
                    onClick={() => handleOpenDoc(doc)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Photo Gallery */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {gallery.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs group">
              <div className="h-48 overflow-hidden relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                  {item.category}
                </span>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Sermon Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Upload Sermon / Audio Message</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSermon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sermon Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walking in Divine Boldness"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Speaker / Preacher</label>
                <input
                  type="text"
                  value={newSpeaker}
                  onChange={(e) => setNewSpeaker(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  >
                    <option value="Sunday Worship">Sunday Worship</option>
                    <option value="Faith">Faith</option>
                    <option value="Prayer">Prayer</option>
                    <option value="Spiritual Growth">Spiritual Growth</option>
                    <option value="Family">Family</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Scripture References</label>
                  <input
                    type="text"
                    value={newScriptures}
                    onChange={(e) => setNewScriptures(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summary of the message..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden resize-none h-20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white font-semibold rounded-xl"
                >
                  Save to Sermon Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Built-in Reader Modal */}
      <SermonReaderModal
        sermon={selectedSermon}
        documentItem={selectedDocument}
        isOpen={showReaderModal}
        onClose={() => setShowReaderModal(false)}
      />
    </div>
  );
};
