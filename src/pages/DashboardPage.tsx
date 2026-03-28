import { Link } from 'react-router-dom';
import { MessageCircle, BookOpen, FileText, Brain, Layers, BarChart3 } from 'lucide-react';
import { LoopySVG } from '@/components/LoopySVG';

const cards = [
  { to: '/chat?mode=ask', icon: MessageCircle, title: 'Ask a Question', desc: 'Get instant answers from your documents', color: 'from-indigo-500 to-indigo-600' },
  { to: '/chat?mode=explain', icon: BookOpen, title: 'Explain', desc: 'Break down complex concepts simply', color: 'from-teal-500 to-teal-600' },
  { to: '/chat?mode=summarize', icon: FileText, title: 'Summarize', desc: 'Get a concise overview of your document', color: 'from-purple-500 to-purple-600' },
  { to: '/quiz', icon: Brain, title: 'Quiz', desc: 'Test your understanding with MCQs', color: 'from-rose-500 to-rose-600' },
  { to: '/flashcards', icon: Layers, title: 'Flashcards', desc: 'Active recall with flip cards', color: 'from-amber-500 to-amber-600' },
  { to: '/progress', icon: BarChart3, title: 'Progress', desc: 'Track your learning journey', color: 'from-emerald-500 to-emerald-600' },
];

const DashboardPage = () => {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-heading font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Choose your learning activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Link
            key={card.title}
            to={card.to}
            className="group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <LoopySVG variant="card" className="absolute top-2 right-2 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
              <card.icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-1">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
