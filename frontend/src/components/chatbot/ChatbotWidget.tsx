import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaUserCircle, FaRobot, FaChevronDown, FaHistory, FaPlus, FaTrash } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocation } from 'react-router-dom';
import { sendMessage } from '../../services/chatbotService';
import type { ChatTurn } from '../../types/chat';

type UserLike = { role?: string } | null;

const ChatbotWidget: React.FC<{ user: UserLike }> = ({ user }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ChatTurn[][]>([]);
  const [currentSession, setCurrentSession] = useState<number | null>(null);
  const location = useLocation();

  // Show icon by default, open widget on click
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [advanced, setAdvanced] = useState(true);
  const [language, setLanguage] = useState<'en' | 'si' | 'bi'>('bi');
  const [detail, setDetail] = useState<'basic' | 'detailed' | 'expert'>('detailed');
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  // Suggestions
  const suggestions = useMemo(() => {
    const base = [
      'How do I register?',
      'Where is my dashboard?',
      'How to find my matches?',
      'Show tournament rules',
      'How to contact organizers?',
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
  }, [user?.role]);

  // Send message
  const handleSend = async (msg?: string) => {
    const text = msg ?? input;
    if (!text.trim() || sending) return;

    setSending(true);
    setInput('');
    setErrorMsg('');

    setTurns(prev => [...prev, { message: text, reply: '' }]);

    try {
      const response = await sendMessage(text);
      let replyText = '';
      if (typeof response === 'string') {
        replyText = response;
      } else if (response?.data?.reply) {
        replyText = response.data.reply;
      } else {
        replyText = JSON.stringify(response);
      }
      setTurns(prev =>
        prev.map((t, i) =>
          i === prev.length - 1 ? { ...t, reply: replyText } : t
        )
      );
    } catch (err) {
      setErrorMsg('Failed to get response');
    } finally {
      setSending(false);
    }
  };

  const toggleListening = () => {
    setListening(prev => !prev);
  };

  return (
    <>
      {/* Floating Chatbot Icon Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 via-pink-500 to-yellow-400 shadow-2xl flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
          aria-label="Open chatbot"
        >
          <FaRobot size={36} className="text-white drop-shadow" />
        </button>
      )}

      {/* Chatbot Widget Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-slideIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-700 via-pink-600 to-yellow-400 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaRobot className="text-yellow-200" size={28} />
              <span className="text-xl font-bold drop-shadow">Smart Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(h => !h)}
                className="text-white hover:text-yellow-200 text-xl p-2 rounded-full hover:bg-white/10"
                aria-label="Show chat history"
                title="Show chat history"
              >
                <FaHistory />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:text-yellow-200 text-xl p-2 rounded-full hover:bg-white/10"
                aria-label="Minimize"
              >
                <FaChevronDown />
              </button>
            </div>
          </div>

          {/* Chat History Drawer */}
          {showHistory && (
            <div className="absolute left-0 top-0 w-80 h-full bg-white border-r border-yellow-200 shadow-xl z-50 flex flex-col animate-slideIn">
              <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-yellow-100 to-pink-100">
                <span className="font-semibold text-yellow-700 text-lg">Chat History</span>
                <button onClick={() => setShowHistory(false)} className="text-yellow-700 hover:text-red-500 text-lg p-2 rounded-full hover:bg-yellow-100" aria-label="Close history"><FaChevronDown /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {history.length === 0 && <div className="text-xs text-gray-400 text-center mt-4">No previous chats</div>}
                {history.map((session, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setTurns(session); setShowHistory(false); setCurrentSession(idx); }}
                    className={`w-full text-left px-4 py-3 rounded-lg hover:bg-yellow-50 border ${currentSession === idx ? 'border-yellow-400 bg-yellow-100' : 'border-transparent'}`}
                  >
                    <div className="truncate text-base font-medium">Chat {idx + 1}</div>
                    <div className="text-xs text-gray-400 truncate">{session[0]?.message?.slice(0, 40) || 'No message'}</div>
                  </button>
                ))}
              </div>
              <div className="p-3 border-t flex gap-2">
                <button
                  className="flex-1 py-2 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-700 text-sm font-semibold flex items-center justify-center gap-2"
                  onClick={() => { setTurns([]); setCurrentSession(history.length); setShowHistory(false); }}
                  title="Start a new chat"
                >
                  <FaPlus /> New Chat
                </button>
                <button
                  className="flex-1 py-2 rounded bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold flex items-center justify-center gap-2"
                  onClick={() => { setHistory([]); setCurrentSession(null); setShowHistory(false); }}
                  title="Clear all history"
                >
                  <FaTrash /> Clear All
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {errorMsg && (
            <div className="px-6 py-3 bg-red-50 text-red-700 text-sm border-b border-red-200 animate-pulse">
              {errorMsg}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-br from-gray-50 via-white to-gray-100 transition-all duration-300 min-h-[320px] max-h-[420px]">
            {turns.map((t, idx) => (
              <div key={idx} className="space-y-2 animate-fadeIn">
                {/* User message */}
                <div className="flex items-end justify-end gap-2">
                  <div className="max-w-[80%] bg-gradient-to-tr from-red-600 via-pink-500 to-yellow-400 text-white px-5 py-3 rounded-2xl text-base shadow-md relative">
                    {t.message}
                    <span className="block text-[11px] text-yellow-100 mt-1 text-right opacity-70">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <FaUserCircle className="text-red-400" size={30} />
                </div>
                {/* Assistant reply */}
                <div className="flex items-end justify-start gap-2">
                  <FaRobot className="text-yellow-400" size={28} />
                  <div className="max-w-[80%] bg-white border border-yellow-100 px-5 py-3 rounded-2xl text-base shadow-sm relative">
                    {!t.reply ? (
                      <span className="inline-flex items-center gap-2 text-gray-500">
                        <span className="animate-pulse">● ● ●</span>
                      </span>
                    ) : advanced ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.reply}</ReactMarkdown>
                    ) : (
                      <div>{t.reply}</div>
                    )}
                    <span className="block text-[11px] text-yellow-500 mt-1 opacity-60">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {turns.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 6).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-yellow-100 shadow"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-5 bg-white">
            <div className="flex items-center gap-3">
              {advanced && (
                <>
                  <select
                    aria-label="Select language"
                    value={language}
                    onChange={e => setLanguage(e.target.value as any)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="en">English</option>
                    <option value="si">සිංහල</option>
                    <option value="bi">Bilingual</option>
                  </select>
                  <select
                    aria-label="Select detail level"
                    value={detail}
                    onChange={e => setDetail(e.target.value as any)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="basic">Basic</option>
                    <option value="detailed">Detailed</option>
                    <option value="expert">Expert</option>
                  </select>
                </>
              )}
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything…"
                className="flex-1 border rounded px-3 py-2 text-base focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={toggleListening}
                className={`px-3 py-2 rounded border ${listening ? 'bg-yellow-400 text-white' : 'bg-gray-100'}`}
                title="Voice to text"
              >
                🎙️
              </button>
              <button
                onClick={() => handleSend()}
                disabled={sending}
                className="bg-gradient-to-tr from-red-600 via-pink-500 to-yellow-400 text-white px-5 py-2 rounded hover:scale-105 disabled:opacity-60 transition-all duration-200 text-base font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
