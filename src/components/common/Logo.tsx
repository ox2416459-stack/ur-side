import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Abstract Bird / Crow Stylized Symbol */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-1.5 shadow-md border border-emerald-500/30 group-hover:border-emerald-400 transition-all duration-300`}>
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow">
          <path
            d="M6 26 C12 18, 20 12, 30 11 C26 18, 20 23, 14 27 Z"
            fill="url(#emeraldGrad)"
          />
          <path
            d="M10 24 L5 29 L14 27 Z"
            fill="#047857"
          />
          <circle cx="25" cy="12" r="2.5" fill="url(#goldGrad)" />
          <path
            d="M16 19 C22 14, 27 12, 31 11 C27 15, 23 20, 18 24 Z"
            fill="#10b981"
            fillOpacity="0.45"
          />
          <defs>
            <linearGradient id="emeraldGrad" x1="6" y1="11" x2="30" y2="27" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="0.5" stopColor="#10b981" />
              <stop offset="1" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="22.5" y1="9.5" x2="27.5" y2="14.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fef08a" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-tight">
          <span className={`font-bold tracking-tight text-white ${titleSizes[size]}`}>
            নতুন কাজের সূত্র
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-400 tracking-normal font-normal">
            লাইভ ভিডিও ও কর্মসংস্থান পোর্টাল
          </span>
        )}
      </div>
    </div>
  );
};
