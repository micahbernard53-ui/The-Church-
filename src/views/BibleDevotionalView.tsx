import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  BookOpen, Search, Sparkles, Heart, Share2, 
  Check, RefreshCw, Bookmark, Plus, X 
} from 'lucide-react';
import { BIBLE_VERSES_DATABASE } from '../mockData';
import { Devotional } from '../types';

export const BibleDevotionalView: React.FC = () => {
  const { 
    devotionals, 
    addDevotional, 
    likeDevotional, 
    generateDevotionalAI, 
    currentUser, 
    churchSettings,
    readingPlans,
    toggleReadingPlanDay
  } = useChurch();

  const [activeTab, setActiveTab] = useState<'devotionals' | 'search' | 'reading_plans'>('devotionals');
  const [bibleSearchQuery, setBibleSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiScripture, setAiScripture] = useState('');

  // Daily Devotional
  const todayDevo = devotionals[0];

  // Bible search filtering
  const filteredVerses = BIBLE_VERSES_DATABASE.filter(v => {
    const matchQuery = !bibleSearchQuery.trim() || 
      v.text.toLowerCase().includes(bibleSearchQuery.toLowerCase()) ||
      v.book.toLowerCase().includes(bibleSearchQuery.toLowerCase());

    const matchTopic = selectedTopic === 'all' || v.topic === selectedTopic;

    return matchQuery && matchTopic;
  });

  const topicsList = ['all', 'Faith & Trust', 'Peace & Anxiety', 'Strength', 'Protection', 'Love', 'Purpose & Providence'];

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const generated = await generateDevotionalAI({
        topic: aiTopic || 'God\'s Unfailing Love',
        scripture: aiScripture || '1 Corinthians 13:13',
      });

      if (generated) {
        addDevotional({
          date: '2026-10-05',
          title: generated.title || 'Walking in Divine Grace',
          bibleVerse: generated.bibleVerse || 'Trust in the Lord with all thine heart...',
          bibleReference: generated.bibleReference || 'Proverbs 3:5',
          content: generated.content || 'A transformative reflection on walking with God.',
          prayer: generated.prayer || 'Lord, guide my steps today. Amen.',
          reflectionQuestion: generated.reflectionQuestion || 'How will you apply this today?',
          author: churchSettings.pastorName,
        });
      }
      setShowGenerateModal(false);
      setAiTopic('');
      setAiScripture('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Daily Word & Holy Scriptures</h1>
          <p className="text-xs text-slate-500">Spiritual nourishment, verse search, and reading plans</p>
        </div>

        {currentUser?.role !== 'member' && (
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Devotional with Gemini</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl px-4 pt-3 gap-6 shadow-xs">
        {[
          { id: 'devotionals', label: 'Daily Word & Devotionals', icon: BookOpen },
          { id: 'search', label: 'Scripture Search & Topics', icon: Search },
          { id: 'reading_plans', label: 'Bible Reading Plans', icon: Bookmark },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                isActive
                  ? 'border-amber-600 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Devotionals */}
      {activeTab === 'devotionals' && (
        <div className="space-y-6">
          {/* Main Today's Devotional Feature */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                Today's Word · {todayDevo.date}
              </span>
              <button
                onClick={() => likeDevotional(todayDevo.id)}
                className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-rose-50" />
                <span>{todayDevo.likes} Blessed</span>
              </button>
            </div>

            <div className="bg-gradient-to-r from-amber-500/10 via-teal-500/5 to-transparent border border-amber-200/80 rounded-2xl p-6">
              <h2 className="text-xl sm:text-2xl font-serif italic text-slate-900 leading-snug">
                "{todayDevo.bibleVerse}"
              </h2>
              <p className="text-xs font-bold text-amber-900 mt-2 font-sans tracking-wide">
                — {todayDevo.bibleReference}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900">{todayDevo.title}</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                {todayDevo.content}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Pastoral Declaration & Prayer</h4>
              <p className="text-xs text-slate-600 italic">"{todayDevo.prayer}"</p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">Today's Reflection Question</h4>
              <p className="text-xs text-slate-800 mt-1">{todayDevo.reflectionQuestion}</p>
            </div>
          </div>

          {/* Past Devotionals Archive */}
          {devotionals.length > 1 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Previous Devotionals</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devotionals.slice(1).map(dev => (
                  <div key={dev.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
                    <span className="text-[10px] text-slate-400 font-mono">{dev.date}</span>
                    <h4 className="text-sm font-bold text-slate-900">{dev.title}</h4>
                    <p className="text-xs text-slate-600 italic font-serif line-clamp-2">"{dev.bibleVerse}"</p>
                    <p className="text-xs text-slate-500 font-sans line-clamp-2">{dev.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Scripture Search & Topics */}
      {activeTab === 'search' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search scripture by keyword, book, or verse (e.g. 'faith', 'peace', 'shepherd')..."
                value={bibleSearchQuery}
                onChange={(e) => setBibleSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-1 focus:ring-amber-600"
              />
            </div>

            {/* Topic Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {topicsList.map(top => (
                <button
                  key={top}
                  onClick={() => setSelectedTopic(top)}
                  className={`text-[11px] px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                    selectedTopic === top 
                      ? 'bg-amber-600 text-white font-semibold' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {top === 'all' ? 'All Scriptures' : top}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVerses.map((v, i) => (
              <div 
                key={i} 
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-amber-800 font-bold mb-1">
                    <span>{v.book} {v.chapter}:{v.verse} ({v.translation})</span>
                    {v.topic && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-normal">
                        {v.topic}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-serif italic text-slate-800 leading-relaxed">
                    "{v.text}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>King James Version (Public Domain)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`"${v.text}" — ${v.book} ${v.chapter}:${v.verse}`);
                    }}
                    className="text-teal-700 hover:underline cursor-pointer"
                  >
                    Copy Scripture
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Reading Plans */}
      {activeTab === 'reading_plans' && (
        <div className="space-y-5">
          {readingPlans.map(plan => (
            <div key={plan.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{plan.title}</h3>
                  <p className="text-xs text-slate-500">{plan.description}</p>
                </div>
                <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full">
                  Day {plan.currentDay} / {plan.totalDays}
                </span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-teal-600 h-full transition-all"
                  style={{ width: `${(plan.completedDays.length / plan.totalDays) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 pt-1">
                {Array.from({ length: Math.min(plan.totalDays, 20) }).map((_, i) => {
                  const dayNum = i + 1;
                  const isDone = plan.completedDays.includes(dayNum);
                  return (
                    <button
                      key={dayNum}
                      onClick={() => toggleReadingPlanDay(plan.id, dayNum)}
                      className={`p-2 rounded-xl text-xs font-medium border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isDone 
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <span className="text-[9px] uppercase opacity-75">Day</span>
                      <span className="font-bold text-xs">{dayNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Devotional AI Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Generate Devotional with Gemini</h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateAI} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Topic or Spiritual Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Walking in Divine Boldness"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Scripture Reference (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 2 Timothy 1:7 or Joshua 1:9"
                  value={aiScripture}
                  onChange={(e) => setAiScripture(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Generate with Gemini</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
