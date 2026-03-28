interface BrainLoopLogoProps {
  className?: string;
  size?: number;
}

export const BrainLoopLogo = ({ className = '', size = 40 }: BrainLoopLogoProps) => (
  <svg className={className} width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Brain outline that morphs into infinity loop */}
    <path
      d="M20 16C12 16 8 22 8 28C8 34 12 38 16 38C14 42 16 48 22 48C26 48 28 46 30 44C30 48 34 52 40 50C46 48 46 42 44 38C48 38 54 34 54 28C54 22 50 16 42 16C38 16 36 18 34 20"
      stroke="url(#brainGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Infinity loop inside */}
    <path
      d="M22 32C22 26 28 24 32 28C36 32 36 36 32 36C28 36 28 32 32 28C36 24 42 26 42 32C42 38 36 40 32 36"
      stroke="url(#loopInner)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <defs>
      <linearGradient id="brainGrad" x1="8" y1="16" x2="54" y2="50">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#0CCFC4" />
      </linearGradient>
      <linearGradient id="loopInner" x1="22" y1="24" x2="42" y2="40">
        <stop offset="0%" stopColor="#0CCFC4" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
  </svg>
);
