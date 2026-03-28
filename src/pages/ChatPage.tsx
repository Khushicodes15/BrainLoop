import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { queryAI, explainAI, summarizeAI, detectIntent } from '@/lib/api';

type Mode = 'ask' | 'explain' | 'summarize' | 'auto';
interface Message { role: 'user' | 'assistant'; content: string; }

const modes: { value: Mode; label: string; desc: string }[] = [
  { value: 'auto', label: '✨ Auto', desc: 'Smart detect' },
  { value: 'ask', label: '❓ Ask', desc: 'Quick answers' },
  { value: 'explain', label: '📖 Explain', desc: 'Deep concepts' },
  { value: 'summarize', label: '📝 Summarize', desc: 'Key points' },
];

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = (searchParams.get('mode') as Mode) || 'auto';
  const [mode, setMode] = useState<Mode>(initialMode);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      let res;
      let activeMode = mode;
      if (mode === 'auto') {
        try {
          const intentRes = await detectIntent(userMsg);
          activeMode = intentRes.data?.intent || 'ask';
        } catch { activeMode = 'ask'; }
      }
      if (activeMode === 'ask') res = await queryAI(userMsg);
      else if (activeMode === 'explain') res = await explainAI(userMsg);
      else res = await summarizeAI(userMsg);
      setMessages((m) => [...m, { role: 'assistant', content: res.data?.response || res.data?.answer || res.data?.summary || JSON.stringify(res.data) }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: 'assistant', content: `Error: ${e?.response?.data?.detail || 'Something went wrong'}` }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar */}
      <div className="w-56 flex-shrink-0 border-r border-border bg-card p-4 flex flex-col gap-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mode</p>
        {modes.map((m) => (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex flex-col gap-0.5 ${
              mode === m.value
                ? 'bg-gradient-primary text-primary-foreground shadow-card'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
            }`}
          >
            <span>{m.label}</span>
            <span className={`text-xs ${mode === m.value ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>{m.desc}</span>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-heading font-bold mb-4">Chat with BrainLoop</h1>

        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Bot className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">Start a conversation</p>
                <p className="text-sm">Ask questions about your uploaded documents</p>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card shadow-card text-card-foreground rounded-bl-md'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-card shadow-card rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type your message..."
            className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={send} disabled={loading || !input.trim()} size="icon" className="h-12 w-12 rounded-xl bg-gradient-primary hover:opacity-90">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;