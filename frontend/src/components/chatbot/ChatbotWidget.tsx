import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocation } from 'react-router-dom';
import { sendMessage } from '../../services/chatbotService';
import type { ChatTurn } from '../../types/chat';

type UserLike = { role?: string } | null;

const ChatbotWidget: React.FC<{ user: UserLike }> = ({ user }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [advanced, setAdvanced] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'si' | 'bi'>('bi');
  const [detail, setDetail] = useState<'basic' | 'detailed' | 'expert'>('detailed');

  const suggestions = useMemo(() => {
    const base = [
      'How do I register?',
      'Where is my dashboard?',
      'How to find my matches?',
      'Show tournament rules',
      'How to contact organizers?'
    ];
    switch (user?.role) {
      case 'player':
        return ['View my schedule', 'Update my profile', ...base];
      case 'coach':
        return ['Manage my team', 'View training tips', ...base];
      case 'judge':
        return ['Judging guidelines', 'View my assignments', ...base];
      case 'organizer':
        return ['Create tournament', 'Send notifications', ...base];
      case 'admin':
        return ['Manage users', 'System overview', ...base];
      default:
        return base;
    }
  }, [user]);

  // Show on dashboard pages for authenticated users
  const shouldShow = useMemo(() => {
    if (!user || !user.role) return false;
    const pathname = location.pathname.toLowerCase();
    return pathname.startsWith(`/${user.role}`);
  }, [location.pathname, user]);

  useEffect(() => {
    // Setup speech recognition if available
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const recog = new SR();
      recog.lang = 'en-US'; // autoswitch by input; Sinhala often captured as phonetics; kept optional
      recog.continuous = false;
      recog.interimResults = false;
      recog.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        setInput((prev) => `${prev ? prev + ' ' : ''}${transcript}`);
      };
      recog.onend = () => setListening(false);
      recog.onerror = () => setListening(false);
      recognitionRef.current = recog;
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleListening = () => {
    const recog = recognitionRef.current;
    if (!recog) return;
    if (listening) {
      try { recog.stop(); } catch {}
      setListening(false);
    } else {
      try { recog.start(); setListening(true); } catch {}
    }
  };

  const handleSend = async (explicitText?: string) => {
    setErrorMsg('');
    let text = (explicitText ?? input).trim();
    if (!text) return;

    // Apply advanced controls by prefixing instructions
    if (advanced) {
      const langPrefix = language === 'si'
        ? 'Please answer in Sinhala.'
        : language === 'bi'
        ? 'Please answer in both Sinhala and English.'
        : '';
      const detailPrefix = detail === 'expert'
        ? 'Provide an expert-level, deeply detailed, structured answer with headings, sections, bullet points and tables if relevant.'
        : detail === 'detailed'
        ? 'Provide a detailed, structured answer with headings and bullet points.'
        : 'Provide a concise answer.';
      const prefix = [langPrefix, detailPrefix].filter(Boolean).join(' ');
      text = prefix ? `${prefix} ${text}` : text;
    }
    setSending(true);
    setTurns((prev) => [...prev, { message: text, reply: '' }]);
    if (!explicitText) setInput('');
    try {
      const res = await sendMessage(text);
      const reply = res?.data?.reply || res?.message || 'Error';
      if (!res?.success) setErrorMsg(res?.message || 'Failed to send');
      setTurns((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { ...copy[copy.length - 1], reply };
        return copy;
      });
    } catch (e: any) {
      setTurns((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { ...copy[copy.length - 1], reply: 'Failed to reach assistant.' };
        return copy;
      });
      setErrorMsg('Network error');
    } finally {
      setSending(false);
    }
  };

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-red-600 text-white shadow-lg w-12 h-12 flex items-center justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white/60"
          aria-label="Open chatbot"
        >
          💬
        </button>
      )}

      {open && (
        <div
          ref={panelRef}
          className="w-96 max-w-[95vw] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 animate-[fadeIn_0.2s_ease]"
        >
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">Assistant</span>
              {user?.role && (
                <span className="text-xs text-gray-300">({user.role})</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAdvanced((v) => !v)}
                className={`text-xs rounded-md px-2 py-1 border ${advanced ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'} hover:bg-white/80`}
                title="Toggle advanced view"
              >
                {advanced ? 'Advanced' : 'Simple'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="px-4 py-2 bg-red-50 text-red-700 text-sm border-b border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="h-80 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {turns.map((t, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex">
                  <div className="ml-auto max-w-[80%] bg-red-600 text-white px-3 py-2 rounded-lg text-sm">
                    {t.message}
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-auto max-w-[80%] bg-white border px-3 py-2 rounded-lg text-sm">
                    {!t.reply ? (
                      <span className="inline-flex items-center gap-2 text-gray-500">
                        <span className="animate-pulse">● ● ●</span>
                      </span>
                    ) : (
                      <div className="space-y-2">
                        {advanced ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.reply}</ReactMarkdown>
                        ) : (
                          <div>{t.reply}</div>
                        )}
                        <div className="flex gap-2 pt-1">
                          <button
                            className="text-xs text-gray-500 hover:text-gray-700"
                            onClick={() => { navigator.clipboard?.writeText(t.reply); }}
                            title="Copy"
                          >
                            Copy
                          </button>
                          <button
                            className="text-xs text-gray-500 hover:text-gray-700"
                            onClick={() => {
                              const blob = new Blob([t.reply], { type: 'text/plain;charset=utf-8' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `assistant_reply_${idx + 1}.txt`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            title="Download"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {turns.length === 0 && (
              <div className="pt-2 flex flex-wrap gap-2">
                {suggestions.slice(0, 6).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-xs px-2 py-1 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t bg-white">
            <div className="flex items-center gap-2">
              {advanced && (
                <>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="text-xs border rounded-md px-2 py-1"
                    title="Language"
                  >
                    <option value="en">English</option>
                    <option value="si">සිංහල</option>
                    <option value="bi">Bilingual</option>
                  </select>
                  <select
                    value={detail}
                    onChange={(e) => setDetail(e.target.value as any)}
                    className="text-xs border rounded-md px-2 py-1"
                    title="Detail level"
                  >
                    <option value="basic">Basic</option>
                    <option value="detailed">Detailed</option>
                    <option value="expert">Expert</option>
                  </select>
                </>
              )}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder={advanced ? 'Ask anything… (English / සිංහල / Both)' : 'Type a message…'}
                className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={toggleListening}
                className={`border rounded-md px-3 py-2 text-sm ${listening ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}
                title="Voice to text"
              >
                🎙️
              </button>
              <button
                onClick={() => handleSend()}
                disabled={sending}
                className="bg-red-600 text-white rounded-md px-3 py-2 text-sm hover:bg-red-700 disabled:opacity-60"
              >
                Send
              </button>
              <button
                onClick={() => { setTurns([]); setErrorMsg(''); }}
                className="text-xs text-gray-500 hover:text-gray-700"
                title="Clear conversation"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;