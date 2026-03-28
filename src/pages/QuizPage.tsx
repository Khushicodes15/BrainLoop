import { useState } from 'react';
import { Loader2, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LoopySVG } from '@/components/LoopySVG';
import { generateQuiz, evaluateAnswer } from '@/lib/api';

interface Question {
  id: string;
  question: string;
  options: string[];
}

const QuizPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation?: string } | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const startQuiz = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await generateQuiz(5);
      setQuestions(res.data?.questions || res.data || []);
      setCurrent(0);
      setScore(0);
      setFinished(false);
      setSelected(null);
      setFeedback(null);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await evaluateAnswer(questions[current].id, selected);
      const isCorrect = res.data?.correct ?? false;
      if (isCorrect) setScore((s) => s + 1);
      setFeedback({ correct: isCorrect, explanation: res.data?.explanation });
    } catch {
      setFeedback({ correct: false, explanation: 'Could not evaluate answer' });
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setFeedback(null);
    }
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="container py-12 max-w-2xl text-center">
        <div className="bg-card rounded-3xl p-12 shadow-card relative overflow-hidden">
          <LoopySVG variant="hero" className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" />
          <Trophy className="mx-auto h-16 w-16 text-secondary mb-6" />
          <h1 className="text-4xl font-heading font-bold mb-2">Quiz Complete!</h1>
          <p className="text-6xl font-heading font-extrabold text-gradient my-6">{pct}%</p>
          <p className="text-muted-foreground mb-8">{score} out of {questions.length} correct</p>
          <Button onClick={startQuiz} size="lg" className="bg-gradient-primary text-primary-foreground rounded-xl">
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container py-12 max-w-2xl text-center">
        <h1 className="text-3xl font-heading font-bold mb-2">Quiz</h1>
        <p className="text-muted-foreground mb-8">Test your knowledge with AI-generated questions</p>
        {error && <p className="text-destructive mb-4">{error}</p>}
        <Button onClick={startQuiz} disabled={generating} size="lg" className="bg-gradient-primary text-primary-foreground rounded-xl px-8">
          {generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Start Quiz'}
        </Button>
      </div>
    );
  }

  const q = questions[current];
  const progressPct = ((current + 1) / questions.length) * 100;

  return (
    <div className="container py-12 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-bold">Question {current + 1} of {questions.length}</h1>
        <span className="text-sm text-muted-foreground font-medium">Score: {score}</span>
      </div>
      <Progress value={progressPct} className="h-2 mb-8" />

      <div className="bg-card rounded-2xl p-8 shadow-card mb-6">
        <p className="text-lg font-medium mb-6">{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSelected = selected === opt;
            return (
              <button
                key={i}
                onClick={() => !feedback && setSelected(opt)}
                disabled={!!feedback}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                  feedback
                    ? feedback.correct && isSelected
                      ? 'border-secondary bg-secondary/10'
                      : !feedback.correct && isSelected
                        ? 'border-destructive bg-destructive/10'
                        : 'border-border'
                    : isSelected
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="font-semibold mr-3">{letter}.</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`flex items-start gap-3 p-4 rounded-xl mb-6 ${feedback.correct ? 'bg-secondary/10' : 'bg-destructive/10'}`}>
          {feedback.correct ? <CheckCircle className="h-5 w-5 text-secondary mt-0.5" /> : <XCircle className="h-5 w-5 text-destructive mt-0.5" />}
          <div>
            <p className="font-medium">{feedback.correct ? 'Correct!' : 'Incorrect'}</p>
            {feedback.explanation && <p className="text-sm text-muted-foreground mt-1">{feedback.explanation}</p>}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!feedback ? (
          <Button onClick={submitAnswer} disabled={!selected || loading} className="bg-gradient-primary text-primary-foreground rounded-xl px-6">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit'}
          </Button>
        ) : (
          <Button onClick={next} className="bg-gradient-primary text-primary-foreground rounded-xl px-6">
            {current + 1 >= questions.length ? 'See Results' : 'Next'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
