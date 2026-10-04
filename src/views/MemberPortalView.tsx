import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { 
  BookOpen, Heart, Share2, Sparkles, Calendar, Video, 
  ShieldCheck, CheckCircle2, ChevronRight, Phone, MapPin, 
  Plus, Check, Clock, Bookmark, QrCode
} from 'lucide-react';
import { DigitalChurchCard } from '../components/DigitalChurchCard';

export const MemberPortalView: React.FC = () => {
  const { 
    currentUser, 
    members, 
    devotionals, 
    events, 
    sermons, 
    churchSettings, 
    prayerJournal, 
    addPrayerJournalEntry, 
    togglePrayerJournalAnswered,
    readingPlans,
    toggleReadingPlanDay,
    setActiveView
  } = useChurch();

  const [showDigitalCard, setShowDigitalCard] = useState(false);
  const [newPrayerTitle, setNewPrayerTitle] = useState('');
  const [newPrayerContent, setNewPrayerContent] = useState('');
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  // Find member record for current user
  const currentMember = members.find(m => m.id === currentUser?.memberId) || members[0];

  // Today's Devotional
  const todayDevotional = devotionals[0];

  const handleShareWord = () => {
    const text = `📖 *Today's Word from ${churchSettings.churchName}*\n\n"${todayDevotional.bibleVerse}"\n— *${todayDevotional.bibleReference}*\n\n_${todayDevotional.title}_\n${todayDevotional.content.slice(0, 160)}...\n\nBe blessed today! 🙏`;
    if (navigator.share) {
      navigator.share({ title: todayDevotional.title, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2000);
    }
  };

  const handleCreatePrayerJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerTitle.trim()) return;
    addPrayerJournalEntry({
      title: newPrayerTitle,
      content: newPrayerContent,
    });
    setNewPrayerTitle('');
    setNewPrayerContent('');
    setShowJournalForm(false);
  };

  const activeReadingPlan = readingPlans[0];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Warm Personal Greeting Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-teal-300 uppercase tracking-widest bg-teal-800/60 px-2.5 py-0.5 rounded-sm">
              Member Portal · {currentMember.departmentName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {currentMember.firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Welcome to your personal sanctuary space. May the peace of Christ rule in your heart today.
            </p>
          </div>

          <button
            onClick={() => setShowDigitalCard(true)}
            className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
          >
            <QrCode className="w-4 h-4 text-teal-700" />
            <span>My Digital Member Card</span>
          </button>
        </div>
      </div>

      {/* Today's Word & Daily Devotional Section */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Word</h2>
              <p className="text-xs text-slate-500">{todayDevotional.date} · Devotional of the Day</p>
            </div>
          </div>
          <button
            onClick={handleShareWord}
            className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-1.5 bg-teal-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{sharedToast ? 'Copied to WhatsApp!' : 'Share Verse'}</span>
          </button>
        </div>

        {/* Featured Scripture Quote Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-teal-500/5 to-transparent border border-amber-200/60 rounded-2xl p-5 space-y-2">
          <p className="text-sm sm:text-base font-serif italic text-slate-800 leading-relaxed">
            "{todayDevotional.bibleVerse}"
          </p>
          <p className="text-xs font-bold text-amber-900 font-sans">
            — {todayDevotional.bibleReference}
          </p>
        </div>

        {/* Short Devotional Thought */}
        <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-sans">
          <h3 className="font-bold text-slate-900 text-sm">{todayDevotional.title}</h3>
          <p className="whitespace-pre-line text-slate-600">{todayDevotional.content}</p>
        </div>

        {/* Today's Prayer Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500" /> Daily Declaration & Prayer
          </h4>
          <p className="text-xs text-slate-600 italic">
            "{todayDevotional.prayer}"
          </p>
        </div>
      </div>

      {/* Section: Your Church Journey (Requirement 5) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Church Journey</h2>
            <p className="text-xs text-slate-500">Milestones of your walk and growth at {churchSettings.churchName}</p>
          </div>
          <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
            Active Member
          </span>
        </div>

        <div className="relative border-l-2 border-teal-600/30 ml-3 pl-5 space-y-5 py-2">
          {/* Milestone 1: Joined Church */}
          <div className="relative">
            <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-white flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Joined The Church Family</p>
              <p className="text-[11px] text-slate-500">{currentMember.journey.dateJoined}</p>
            </div>
          </div>

          {/* Milestone 2: Water Baptism */}
          <div className="relative">
            <div className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full ring-4 ring-white flex items-center justify-center ${
              currentMember.baptismStatus === 'baptized' ? 'bg-teal-600 text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Water Baptism Immersion</p>
              <p className="text-[11px] text-slate-500">
                {currentMember.baptismStatus === 'baptized' ? 'Completed & Confirmed in Christ' : 'Scheduled for next baptism class'}
              </p>
            </div>
          </div>

          {/* Milestone 3: Department Involvement */}
          <div className="relative">
            <div className="absolute -left-[27px] top-0.5 w-4 h-4 rounded-full bg-teal-600 ring-4 ring-white flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Joined {currentMember.departmentName}</p>
              <p className="text-[11px] text-slate-500">Serving in weekly ministry operations</p>
            </div>
          </div>

          {/* Milestone 4: Discipleship Foundations */}
          <div className="relative">
            <div className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full ring-4 ring-white flex items-center justify-center ${
              currentMember.journey.completedDiscipleship ? 'bg-teal-600 text-white' : 'bg-slate-300'
            }`}>
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Discipleship Foundations Course</p>
              <p className="text-[11px] text-slate-500">
                {currentMember.journey.completedDiscipleship ? 'Completed certificate' : 'In progress'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bible Reading Plan Tracker (Requirement 56) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">{activeReadingPlan.title}</h2>
            <p className="text-xs text-slate-500">{activeReadingPlan.description}</p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full">
            Day {activeReadingPlan.currentDay} of {activeReadingPlan.totalDays}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-teal-600 h-full transition-all"
            style={{ width: `${(activeReadingPlan.completedDays.length / activeReadingPlan.totalDays) * 100}%` }}
          />
        </div>

        {/* Days Checkbox Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 pt-2">
          {Array.from({ length: 14 }).map((_, i) => {
            const dayNum = i + 1;
            const isDone = activeReadingPlan.completedDays.includes(dayNum);
            return (
              <button
                key={dayNum}
                onClick={() => toggleReadingPlanDay(activeReadingPlan.id, dayNum)}
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

      {/* Private Prayer Journal (Requirement 57: strictly private to member) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Personal Prayer Journal</h2>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                🔒 Private to You
              </span>
            </div>
            <p className="text-xs text-slate-500">Record petitions, scriptures, and celebrate answered prayers</p>
          </div>
          <button
            onClick={() => setShowJournalForm(!showJournalForm)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Entry</span>
          </button>
        </div>

        {showJournalForm && (
          <form onSubmit={handleCreatePrayerJournal} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <input
              type="text"
              placeholder="What are you trusting God for?"
              value={newPrayerTitle}
              onChange={(e) => setNewPrayerTitle(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 outline-hidden"
            />
            <textarea
              placeholder="Scriptures, reflections, or details..."
              value={newPrayerContent}
              onChange={(e) => setNewPrayerContent(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 outline-hidden resize-none h-20"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowJournalForm(false)}
                className="text-xs px-3 py-1 text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Save to Journal
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2.5">
          {prayerJournal.map(entry => (
            <div
              key={entry.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                entry.answered ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs font-bold ${entry.answered ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                    {entry.title}
                  </h4>
                  {entry.answered && (
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 font-semibold px-2 py-0.2 rounded-full">
                      ✓ Answered Testimony
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600">{entry.content}</p>
                {entry.scripture && (
                  <p className="text-[11px] text-teal-700 font-mono">Scripture: {entry.scripture}</p>
                )}
              </div>

              <button
                onClick={() => togglePrayerJournalAnswered(entry.id)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                  entry.answered 
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                    : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {entry.answered ? 'Answered' : 'Mark as Answered'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Church Contact & Pastoral Assistance (Requirement 58) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Phone className="w-4 h-4 text-teal-400" />
          <span>Sanctuary Contact & Pastoral Care Hotline</span>
        </h3>
        <p className="text-xs text-slate-300">
          Need prayer, pastoral counseling, or visiting our physical campus? We are here for you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <a 
            href={`tel:${churchSettings.phone}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors border border-white/10"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="font-bold text-white">{churchSettings.phone}</p>
              <p className="text-[10px] text-slate-400">Pastoral Care Office</p>
            </div>
          </a>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/10">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white truncate">{churchSettings.address}</p>
              <p className="text-[10px] text-slate-400">Sanctuary Location</p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Pass Modal */}
      <DigitalChurchCard
        member={currentMember}
        isOpen={showDigitalCard}
        onClose={() => setShowDigitalCard(false)}
      />
    </div>
  );
};
