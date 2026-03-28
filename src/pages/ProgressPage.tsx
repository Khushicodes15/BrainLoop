import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Brain, Layers, Clock } from 'lucide-react';
import { LoopySVG } from '@/components/LoopySVG';
import { getProgress, getHistory } from '@/lib/api';

interface Stats {
  quizzes_taken?: number;
  avg_score?: number;
  flashcards_reviewed?: number;
  total_sessions?: number;
}

interface HistoryItem {
  id: string;
  type: string;
  date: string;
  score?: number;
}

const ProgressPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [pRes, hRes] = await Promise.all([getProgress(), getHistory()]);
        setStats(pRes.data);
        setHistory(hRes.data?.sessions || hRes.data || []);
      } catch (e: any) {
        setError(e?.response?.data?.detail || 'Failed to load progress');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 max-w-3xl text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  const statCards = [
    { icon: Brain, label: 'Quizzes Taken', value: stats?.quizzes_taken ?? 0, color: 'from-indigo-500 to-indigo-600' },
    { icon: TrendingUp, label: 'Avg Score', value: `${stats?.avg_score ?? 0}%`, color: 'from-teal-500 to-teal-600' },
    { icon: Layers, label: 'Cards Reviewed', value: stats?.flashcards_reviewed ?? 0, color: 'from-purple-500 to-purple-600' },
    { icon: Clock, label: 'Total Sessions', value: stats?.total_sessions ?? 0, color: 'from-amber-500 to-amber-600' },
  ];

  // Donut chart SVG
  const avgScore = stats?.avg_score ?? 0;
  const circumference = 2 * Math.PI * 45;
  const filled = (avgScore / 100) * circumference;

  return (
    <div className="container py-12 max-w-4xl">
      <h1 className="text-3xl font-heading font-bold mb-2">Progress</h1>
      <p className="text-muted-foreground mb-8">Track your learning journey</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {statCards.map((s, i) => (
          <div key={s.label} className="relative bg-card rounded-2xl p-5 shadow-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <LoopySVG variant="card" className="absolute top-1 right-1 w-14 h-14" />
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-2xl font-heading font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Donut chart */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card rounded-2xl p-8 shadow-card flex flex-col items-center">
          <h2 className="font-heading font-semibold mb-6">Performance</h2>
          <svg width="160" height="160" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke="url(#donutGrad)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - filled}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000"
            />
            <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="text-2xl font-bold" fill="currentColor" fontSize="18" fontWeight="700">
              {avgScore}%
            </text>
            <defs>
              <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#0CCFC4" />
              </linearGradient>
            </defs>
          </svg>
          <p className="text-sm text-muted-foreground mt-4">Average Quiz Score</p>
        </div>

        {/* History */}
        <div className="bg-card rounded-2xl p-8 shadow-card">
          <h2 className="font-heading font-semibold mb-4">Recent Activity</h2>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-sm">No activity yet. Start a quiz or review flashcards!</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium capitalize">{item.type}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  {item.score !== undefined && (
                    <span className="text-sm font-semibold text-gradient">{item.score}%</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
