interface LoopySVGProps {
  className?: string;
  variant?: 'hero' | 'card' | 'divider' | 'float';
}

export const LoopySVG = ({ className = '', variant = 'hero' }: LoopySVGProps) => {
  if (variant === 'hero') {
    return (
      <svg className={className} viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 200C100 100 200 50 300 100C400 150 350 250 250 250C150 250 200 150 300 150C400 150 500 50 600 100C700 150 700 300 600 300C500 300 500 200 600 200C700 200 750 300 700 350"
          stroke="url(#loopGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.3"
          style={{ animation: 'loop-pulse 6s ease-in-out infinite' }}
        />
        <path
          d="M50 300C150 200 200 350 350 250C500 150 400 50 500 150C600 250 550 350 650 250C750 150 700 300 750 200"
          stroke="url(#loopGrad2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.2"
          style={{ animation: 'loop-pulse 8s ease-in-out infinite 1s' }}
        />
        <defs>
          <linearGradient id="loopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#0CCFC4" />
          </linearGradient>
          <linearGradient id="loopGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0CCFC4" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (variant === 'card') {
    return (
      <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30 60C30 30 60 20 75 40C90 60 70 80 50 70C30 60 50 40 70 50C90 60 90 80 75 85"
          stroke="url(#cardLoop)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.15"
        />
        <defs>
          <linearGradient id="cardLoop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#0CCFC4" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (variant === 'float') {
    return (
      <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ animation: 'loop-float 8s ease-in-out infinite' }}>
        <circle cx="100" cy="100" r="60" stroke="#4F46E5" strokeWidth="1" opacity="0.1" />
        <path
          d="M60 100C60 70 80 55 100 70C120 85 110 115 90 110C70 105 85 80 105 85C125 90 130 115 115 120"
          stroke="url(#floatLoop)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.2"
        />
        <defs>
          <linearGradient id="floatLoop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#0CCFC4" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // divider
  return (
    <svg className={className} viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path
        d="M0 30C200 10 300 50 500 30C700 10 900 50 1200 30"
        stroke="url(#divLoop)"
        strokeWidth="1.5"
        opacity="0.2"
      />
      <defs>
        <linearGradient id="divLoop" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#0CCFC4" />
          <stop offset="100%" stopColor="#C4B5FD" />
        </linearGradient>
      </defs>
    </svg>
  );
};
