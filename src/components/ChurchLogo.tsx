import React from 'react';

interface ChurchLogoProps {
  variant?: 'full' | 'mark' | 'horizontal' | 'icon';
  className?: string;
  size?: number;
  showTagline?: boolean;
  logoUrl?: string;
  churchName?: string;
}

export const ChurchLogo: React.FC<ChurchLogoProps> = ({
  variant = 'full',
  className = '',
  size = 48,
  showTagline = true,
  logoUrl,
  churchName = 'The Church',
}) => {
  const effectiveLogoUrl = logoUrl || '/church-logo.jpg';
  // If variant is icon / mark only (e.g. for header avatars or badges)
  if (variant === 'icon' || variant === 'mark') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl bg-white p-0.5 shadow-xs border border-slate-100 overflow-hidden ${className}`}
        style={{ width: size, height: size }}
      >
        <img 
          src={effectiveLogoUrl} 
          alt={churchName} 
          className="w-full h-full object-contain"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <svg viewBox="0 0 160 160" className="w-full h-full -z-10 absolute inset-0" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle glow behind cross */}
          <radialGradient id="crossGlow" cx="50%" cy="32%" r="28%">
            <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a3678" stopOpacity="0" />
          </radialGradient>
          <circle cx="80" cy="42" r="32" fill="url(#crossGlow)" />

          {/* Cross */}
          <rect x="73" y="16" width="14" height="52" rx="3" fill="#0a3678" />
          <rect x="58" y="29" width="44" height="14" rx="3" fill="#0a3678" />

          {/* Roof gable outline */}
          <path
            d="M26 68 L80 34 L134 68"
            stroke="#0a3678"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Church side walls */}
          <path
            d="M34 68 L34 94 M126 68 L126 94"
            stroke="#0a3678"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Left Person (Gold) */}
          <circle cx="56" cy="74" r="9" fill="#df991d" />
          <path d="M46 102 C46 89, 66 89, 66 102 Z" fill="#df991d" />

          {/* Right Person (Gold) */}
          <circle cx="104" cy="74" r="9" fill="#df991d" />
          <path d="M94 102 C94 89, 114 89, 114 102 Z" fill="#df991d" />

          {/* Center Person (Navy - Larger) */}
          <circle cx="80" cy="65" r="11" fill="#0a3678" />
          <path d="M64 105 C64 87, 96 87, 96 105 Z" fill="#0a3678" />

          {/* Open Bible Pages (Gold inner page layer) */}
          <path
            d="M80 114 C62 104, 38 106, 22 118 C38 109, 62 108, 80 120 C98 108, 122 109, 138 118 C122 106, 98 104, 80 114 Z"
            fill="#df991d"
          />

          {/* Open Bible Pages (Blue bottom layer) */}
          <path
            d="M80 120 C58 108, 30 112, 14 126 C36 113, 62 112, 80 126 C98 112, 124 113, 146 126 C130 112, 102 108, 80 120 Z"
            fill="#0a3678"
          />
        </svg>
      </div>
    );
  }

  // Horizontal variant (Emblem on left, "The Church" on right)
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <ChurchLogo variant="icon" size={size} />
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight leading-none font-extrabold text-xl sm:text-2xl">
            <span className="text-[#0a3678]">The</span>
            <span className="text-[#df991d] ml-1.5">Church</span>
          </div>
          {showTagline && (
            <p className="text-[10px] text-slate-500 font-medium tracking-tight mt-0.5 hidden sm:block">
              Connecting the Church. Caring for People. Growing Together.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Full stacked logo variant (matching the user's uploaded image exactly)
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* Emblem graphic or full image */}
      <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
        <img 
          src={effectiveLogoUrl} 
          alt={churchName} 
          className="w-full h-full object-contain drop-shadow-xs"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }} 
        />
        <svg viewBox="0 0 200 160" className="w-full h-full -z-10 absolute inset-0" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Subtle radial glow */}
          <radialGradient id="crossGlowFull" cx="50%" cy="32%" r="28%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a3678" stopOpacity="0" />
          </radialGradient>
          <circle cx="100" cy="40" r="38" fill="url(#crossGlowFull)" />

          {/* Cross */}
          <rect x="91" y="10" width="18" height="62" rx="3" fill="#0a3678" />
          <rect x="72" y="27" width="56" height="18" rx="3" fill="#0a3678" />

          {/* Roof gable outline */}
          <path
            d="M32 72 L100 28 L168 72"
            stroke="#0a3678"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Roof eave walls */}
          <path
            d="M42 72 L42 102 M158 72 L158 102"
            stroke="#0a3678"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Left Person (Gold) */}
          <circle cx="70" cy="80" r="11" fill="#df991d" />
          <path d="M58 112 C58 96, 82 96, 82 112 Z" fill="#df991d" />

          {/* Right Person (Gold) */}
          <circle cx="130" cy="80" r="11" fill="#df991d" />
          <path d="M118 112 C118 96, 142 96, 142 112 Z" fill="#df991d" />

          {/* Center Person (Navy - Larger) */}
          <circle cx="100" cy="69" r="14" fill="#0a3678" />
          <path d="M80 115 C80 93, 120 93, 120 115 Z" fill="#0a3678" />

          {/* Open Bible Pages (Gold inner page layer) */}
          <path
            d="M100 120 C76 108, 46 111, 26 125 C46 114, 76 113, 100 128 C124 113, 154 114, 174 125 C154 111, 124 108, 100 120 Z"
            fill="#df991d"
          />

          {/* Open Bible Pages (Blue bottom layer) */}
          <path
            d="M100 128 C72 114, 36 118, 16 135 C42 120, 76 119, 100 135 C124 119, 158 120, 184 135 C164 118, 128 114, 100 128 Z"
            fill="#0a3678"
          />
        </svg>
      </div>

      {/* Typography: "The Church" */}
      <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight leading-none">
        <span className="text-[#0a3678]">The</span>
        <span className="text-[#df991d] ml-2">Church</span>
      </div>

      {/* Tagline & Decorative Lines */}
      {showTagline && (
        <div className="mt-2 flex flex-col items-center">
          <p className="text-xs sm:text-sm font-semibold text-[#0a3678] tracking-tight">
            Connecting the Church. Caring for People.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-10 sm:w-16 h-[1.5px] bg-[#df991d]" />
            <span className="text-xs sm:text-sm font-semibold text-[#0a3678]">Growing Together.</span>
            <div className="w-10 sm:w-16 h-[1.5px] bg-[#df991d]" />
          </div>
        </div>
      )}
    </div>
  );
};
