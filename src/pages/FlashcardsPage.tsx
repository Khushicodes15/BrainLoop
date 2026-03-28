import { useState } from 'react';
import { Loader2, ChevronLeft, ChevronRight, RotateCcw, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoopySVG } from '@/components/LoopySVG';
import { generateFlashcards } from '@/lib/api';

interface Card {
  id: string;
  question: string;
  answer: string;
}

const FlashcardsPage = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [gotIt, setGotIt] = useState<Set<number>>(new Set());

  const generate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await generateFlashcards(5);
      setCards(res.data?.flashcards || res.data || []);
      setCurrent(0);
      setFlipped(false);
      setGotIt(new Set());
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to generate flashcards');
    } finally {
      setGenerating(false);
    }
  };

  if (cards.length === 0) {
    return (
      <div className="container py-12 max-w-2xl text-center">
        <h1 className="text-3xl font-heading font-bold mb-2">Flashcards</h1>
        <p className="text-muted-foreground mb-8">Active recall with smart flip cards</p>
        {error && <p className="text-destructive mb-4">{error}</p>}
        <Button onClick={generate} disabled={generating} size="lg" className="bg-gradient-primary text-primary-foreground rounded-xl px-8">
          {generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Flashcards'}
        </Button>
      </div>
    );
  }

  const card = cards[current];
  const masteredCount = gotIt.size;

  return (
    <div className="container py-12 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-bold">Card {current + 1} of {cards.length}</h1>
        <span className="text-sm text-muted-foreground">{masteredCount} mastered</span>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="relative cursor-pointer mb-8"
        style={{ perspective: '1200px' }}
      >
        <div
          className="relative w-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '280px',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-card rounded-2xl shadow-card p-8 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <LoopySVG variant="card" className="absolute top-3 right-3 w-20 h-20" />
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Question</p>
            <p className="text-xl font-medium text-center">{card.question}</p>
            <p className="text-xs text-muted-foreground mt-6">Tap to reveal</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-primary rounded-2xl shadow-card p-8 flex flex-col items-center justify-center text-primary-foreground"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <p className="text-xs uppercase tracking-wider opacity-70 mb-4">Answer</p>
            <p className="text-xl font-medium text-center">{card.answer}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => { setCurrent((c) => Math.max(0, c - 1)); setFlipped(false); }}
          disabled={current === 0}
          className="rounded-xl"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setGotIt((s) => { const n = new Set(s); n.delete(current); return n; }); }}
            className="rounded-xl"
          >
            <RefreshCw className="mr-1 h-3 w-3" /> Review
          </Button>
          <Button
            size="sm"
            onClick={() => { setGotIt((s) => new Set(s).add(current)); }}
            className="bg-secondary text-secondary-foreground rounded-xl"
          >
            <Check className="mr-1 h-3 w-3" /> Got it
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={() => { setCurrent((c) => Math.min(cards.length - 1, c + 1)); setFlipped(false); }}
          disabled={current === cards.length - 1}
          className="rounded-xl"
        >
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Regenerate */}
      <div className="text-center mt-8">
        <Button variant="ghost" onClick={generate} className="text-muted-foreground">
          <RotateCcw className="mr-2 h-4 w-4" /> Generate New Set
        </Button>
      </div>
    </div>
  );
};

export default FlashcardsPage;
