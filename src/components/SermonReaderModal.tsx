import React, { useState } from 'react';
import { useChurch } from '../context/ChurchContext';
import { X, Sparkles, BookOpen, Download, Search, Share2, HelpCircle, Flame, Send, Check } from 'lucide-react';
import { Sermon, DocumentItem } from '../types';

interface SermonReaderModalProps {
  sermon?: Sermon | null;
  documentItem?: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SermonReaderModal: React.FC<SermonReaderModalProps> = ({ 
  sermon, 
  documentItem, 
  isOpen, 
  onClose 
}) => {
  const { analyzeSermonAI, sendWhatsAppMessage, churchSettings } = useChurch();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'ai_analysis'>('content');
  const [copiedBlast, setCopiedBlast] = useState(false);

  if (!isOpen || (!sermon && !documentItem)) return null;

  const title = sermon?.title || documentItem?.title || '';
  const speaker = sermon?.speaker || 'Pastoral Secretariat';
  const category = sermon?.category || documentItem?.category || '';
  const scriptures = sermon?.bibleReferences || ['Proverbs 3:5-6', 'Hebrews 11:1'];

  const contentText = sermon?.description 
    ? `${sermon.description}\n\nPreached on ${sermon.date} by ${sermon.speaker}. Core scriptures: ${scriptures.join(', ')}.\n\nSummary of message:\nTrue biblical faith is anchored not in circumstance but in the steadfast character of God. As believers, our response to trials must be grounded in continuous meditation on the Word and prompt obedience to the Holy Spirit.` 
    : documentItem?.contentSnippet || '';

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSermonAI({
        title,
        speaker,
        bibleReferences: scriptures,
        contentOrNotes: contentText,
      });
      setAnalysisResult(result);
      setActiveTab('ai_analysis');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyWhatsAppBlast = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlast(true);
    setTimeout(() => setCopiedBlast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] bg-teal-800 text-teal-200 uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm">
              {category}
            </span>
            <h2 className="text-lg font-bold leading-tight mt-1">{title}</h2>
            <p className="text-xs text-slate-300 font-medium">Ministered by: {speaker}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 pt-2">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'content'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sermon Reader & Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('ai_analysis')}
              className={`pb-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'ai_analysis'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Study Questions & Prayer Points</span>
            </button>
          </div>

          <button
            onClick={handleRunAIAnalysis}
            disabled={isAnalyzing}
            className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer mb-2"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>{isAnalyzing ? 'Analyzing with Gemini...' : 'Analyze with Gemini AI'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 font-sans">
          {activeTab === 'content' ? (
            <div className="space-y-4">
              {/* Scriptures referenced */}
              <div className="flex flex-wrap gap-1.5 items-center text-xs">
                <span className="font-semibold text-slate-700">Scriptures:</span>
                {scriptures.map((sc, i) => (
                  <span key={i} className="bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded text-[11px]">
                    {sc}
                  </span>
                ))}
              </div>

              {/* Reader Document Body */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 leading-relaxed text-sm text-slate-800 whitespace-pre-line font-serif">
                {contentText}
              </div>

              {/* Quick Audio Stream if sermon has audio */}
              {sermon?.audioUrl && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-bold text-teal-900">Audio Recording Available</p>
                    <p className="text-[11px] text-teal-700">Duration: {sermon.duration || '48 mins'}</p>
                  </div>
                  <audio controls className="h-8 max-w-xs">
                    <source src={sermon.audioUrl} type="audio/mp3" />
                  </audio>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {!analysisResult ? (
                <div className="py-12 text-center space-y-3">
                  <Sparkles className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
                  <p className="text-sm font-semibold text-slate-900">Unlock AI Pastoral Insights</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Gemini AI will read through the sermon notes, extract key discussion questions for your cell group, generate scriptural prayer points, and craft a WhatsApp announcement blast.
                  </p>
                  <button
                    onClick={handleRunAIAnalysis}
                    disabled={isAnalyzing}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    {isAnalyzing ? 'Extracting Insights...' : 'Run Gemini Analysis Now'}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Summary */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> 2-Sentence Message Summary
                    </h3>
                    <p className="text-xs text-slate-800 leading-relaxed">{analysisResult.summary}</p>
                  </div>

                  {/* Discussion Questions */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600" /> Cell Group Discussion Questions
                    </h3>
                    <div className="space-y-2">
                      {analysisResult.discussionQuestions?.map((q: string, i: number) => (
                        <div key={i} className="flex gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800">
                          <span className="font-bold text-blue-700">{i + 1}.</span>
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prayer Points */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-600" /> Scriptural Prayer Points
                    </h3>
                    <div className="space-y-2">
                      {analysisResult.prayerPoints?.map((p: string, i: number) => (
                        <div key={i} className="flex gap-2.5 p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-slate-800">
                          <span className="font-bold text-rose-700">●</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Announcement Blast Teaser */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5" /> Ready WhatsApp Announcement Teaser
                      </h3>
                      <button
                        onClick={() => handleCopyWhatsAppBlast(analysisResult.whatsAppTeaser)}
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                      >
                        {copiedBlast ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                        <span>{copiedBlast ? 'Copied!' : 'Copy Blast'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 font-mono bg-white p-2.5 rounded-lg border border-emerald-100 whitespace-pre-line">
                      {analysisResult.whatsAppTeaser}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Protected Christian Ministry Resource</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};
