import { useState } from 'react';
import { Loader2, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LoopySVG } from '@/components/LoopySVG';

import { 
  startQuiz, 
  submitAnswer, 
  getNextQuestion, 
  getQuizSummary 
} from '@/lib/api';   // ← Make sure path is correct

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer?: string; // optional, in case backend returns it
}

interface Feedback {
  correct: boolean;
  explanation?: string;
}

interface Summary {
  total: number;
  correct: number;
  score_percent?: number;
}

const QuizPage = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [finished, setFinished] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleStartQuiz = async () => {
    setGenerating(true);
    setError('');
    setFinished(false);
    setSummary(null);
    setQuestion(null);
    setQuestionNumber(0);
    setSelected(null);
    setFeedback(null);

    try {
      const res = await startQuiz();
      setQuestion(res.data?.question);
      setQuestionNumber(1);
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to start quiz. Please upload a PDF first.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selected || !question) return;

    setLoading(true);
    try {
      const res = await submitAnswer(selected);
      setFeedback({
        correct: res.data?.correct ?? false,
        explanation: res.data?.explanation,
      });
    } catch (e: any) {
      setFeedback({ 
        correct: false, 
        explanation: 'Failed to evaluate answer. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    setLoading(true);
    try {
      const res = await getNextQuestion();

      // If no more questions or backend signals finished
      if (res.data?.finished || !res.data?.question) {
        const summaryRes = await getQuizSummary();
        setSummary(summaryRes.data);
        setFinished(true);
      } else {
        setQuestion(res.data.question);
        setQuestionNumber((prev) => prev + 1);
        setSelected(null);
        setFeedback(null);
      }
    } catch (e) {
      // Fallback: try to get summary if next fails
      try {
        const summaryRes = await getQuizSummary();
        setSummary(summaryRes.data);
        setFinished(true);
      } catch {
        setError('Failed to load next question or summary.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Quiz Completed Screen
  if (finished && summary) {
    const score = summary.score_percent ?? Math.round((summary.correct / summary.total) * 100);

    return (
      <div className="container py-12 max-w-2xl text-center">
        <div className="bg-card rounded-3xl p-12 shadow-card relative overflow-hidden">
          <LoopySVG variant="hero" className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" />
          <Trophy className="mx-auto h-16 w-16 text-yellow-500 mb-6" />
          <h1 className="text-4xl font-heading font-bold mb-2">Quiz Complete!</h1>
          <p className="text-6xl font-heading font-extrabold text-gradient my-6">{score}%</p>
          <p className="text-muted-foreground mb-8">
            {summary.correct} out of {summary.total} correct
          </p>
          <Button 
            onClick={handleStartQuiz} 
            size="lg" 
            className="bg-gradient-primary text-primary-foreground rounded-xl"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Initial Screen (No quiz started)
  if (!question) {
    return (
      <div className="container py-12 max-w-2xl text-center">
        <h1 className="text-3xl font-heading font-bold mb-2">Knowledge Quiz</h1>
        <p className="text-muted-foreground mb-8">
          Test your understanding with AI-generated questions from the document
        </p>
        {error && <p className="text-destructive mb-6">{error}</p>}
        
        <Button 
          onClick={handleStartQuiz} 
          disabled={generating} 
          size="lg" 
          className="bg-gradient-primary text-primary-foreground rounded-xl px-10"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Quiz...
            </>
          ) : (
            'Start Quiz'
          )}
        </Button>
      </div>
    );
  }

  // Active Quiz Screen
  return (
    <div className="container py-12 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-bold">Question {questionNumber}</h1>
      </div>

      <Progress value={questionNumber * 10} className="h-2 mb-8" />

      <div className="bg-card rounded-2xl p-8 shadow-card mb-6">
        <p className="text-lg font-medium leading-relaxed mb-8">{question.question}</p>

        <div className="space-y-3">
          {question.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSelected = selected === opt;

            return (
              <button
                key={i}
                onClick={() => !feedback && setSelected(opt)}
                disabled={!!feedback}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
                  feedback
                    ? feedback.correct && isSelected
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                      : !feedback.correct && isSelected
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                        : 'border-border'
                    : isSelected
                      ? 'border-primary bg-accent'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }`}
              >
                <span className="font-semibold mr-4 text-primary">{letter}.</span>
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {feedback && (
        <div className={`flex items-start gap-3 p-5 rounded-xl mb-6 ${
          feedback.correct ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'
        }`}>
          {feedback.correct ? (
            <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
          ) : (
            <XCircle className="h-6 w-6 text-red-500 mt-0.5" />
          )}
          <div>
            <p className="font-semibold text-lg">
              {feedback.correct ? 'Correct!' : 'Incorrect'}
            </p>
            {feedback.explanation && (
              <p className="text-sm text-muted-foreground mt-2">{feedback.explanation}</p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        {!feedback ? (
          <Button 
            onClick={handleSubmitAnswer} 
            disabled={!selected || loading}
            size="lg"
            className="bg-gradient-primary text-primary-foreground rounded-xl px-8"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Submit Answer'}
          </Button>
        ) : (
          <Button 
            onClick={handleNextQuestion} 
            disabled={loading}
            size="lg"
            className="bg-gradient-primary text-primary-foreground rounded-xl px-8"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Next Question'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;