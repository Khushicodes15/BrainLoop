import { Link } from 'react-router-dom';
import { BrainLoopLogo } from '@/components/BrainLoopLogo';
import { LoopySVG } from '@/components/LoopySVG';
import { Upload, MessageCircle, Brain, Layers, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Upload, title: 'Upload', desc: 'Drop your PDFs and let BrainLoop digest them' },
  { icon: MessageCircle, title: 'Ask & Explain', desc: 'Chat with your documents, get instant answers' },
  { icon: Brain, title: 'Quiz', desc: 'Test your knowledge with AI-generated quizzes' },
  { icon: Layers, title: 'Flashcards', desc: 'Flip through smart flashcards for active recall' },
  { icon: BarChart3, title: 'Track Progress', desc: 'See your learning journey with beautiful stats' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero py-24 md:py-36">
        <LoopySVG variant="hero" className="absolute inset-0 w-full h-full pointer-events-none" />
        <LoopySVG variant="float" className="absolute top-10 right-10 w-48 h-48 pointer-events-none hidden md:block" />
        <LoopySVG variant="float" className="absolute bottom-10 left-10 w-32 h-32 pointer-events-none hidden md:block" />

        <div className="container relative z-10 text-center">
          <div className="flex justify-center mb-8 animate-fade-in">
            <BrainLoopLogo size={80} />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-gradient">BrainLoop</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Upload. Learn. <span className="text-gradient font-semibold">Loop it till you know it.</span>
          </p>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground px-8 py-6 text-lg rounded-xl hover:opacity-90 transition-opacity">
              <Link to="/upload">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <LoopySVG variant="divider" className="w-full h-12 -mt-1" />

      {/* Features */}
      <section className="container py-20">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
          How <span className="text-gradient">BrainLoop</span> Works
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Your learning journey in five simple steps
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="relative group bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <LoopySVG variant="card" className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
              {i < features.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 h-5 w-5" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20 text-center">
        <div className="relative bg-gradient-primary rounded-3xl p-12 md:p-16 overflow-hidden">
          <LoopySVG variant="hero" className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" />
          <h2 className="relative z-10 text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
            Ready to start your learning loop?
          </h2>
          <p className="relative z-10 text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Upload your first document and experience AI-powered learning like never before.
          </p>
          <Button asChild size="lg" variant="secondary" className="relative z-10 px-8 py-6 text-lg rounded-xl">
            <Link to="/upload">Upload Your First PDF</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
