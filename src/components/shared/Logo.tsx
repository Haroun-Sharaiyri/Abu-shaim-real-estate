interface LogoMarkProps {
  className?: string;
  variant?: 'dark' | 'light';
  width?: number;
  height?: number;
}

/**
 * Abu Shahm logo mark — towers + arch + diamonds
 * variant='dark': navy towers, cyan accents (for light backgrounds)
 * variant='light': white towers, bright cyan accents (for dark backgrounds)
 */
export function LogoMark({ className, variant = 'dark', width = 80, height = 100 }: LogoMarkProps) {
  const towerFill = variant === 'dark' ? '#0A2E5C' : '#FFFFFF';
  const accentFill = variant === 'dark' ? '#14B4D2' : '#3CCDE8';
  const strokeColor = variant === 'dark' ? '#14B4D2' : '#3CCDE8';

  return (
    <svg
      viewBox="40 10 310 350"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M318 276 H202 C200 350 84 356 70 266"
        fill="none"
        stroke={strokeColor}
        strokeWidth="32"
        strokeLinecap="round"
      />
      <rect x="186" y="160" width="32" height="92" rx="8" fill={towerFill} />
      <rect x="244" y="100" width="32" height="152" rx="8" fill={towerFill} />
      <rect x="302" y="130" width="32" height="122" rx="8" fill={towerFill} />
      <rect
        x="249" y="29" width="22" height="22" rx="3"
        transform="rotate(45 260 40)"
        fill={accentFill}
      />
      <rect
        x="233" y="61" width="22" height="22" rx="3"
        transform="rotate(45 244 72)"
        fill={accentFill}
      />
      <rect
        x="265" y="61" width="22" height="22" rx="3"
        transform="rotate(45 276 72)"
        fill={accentFill}
      />
    </svg>
  );
}

interface LogoFullProps {
  className?: string;
  variant?: 'dark' | 'light';
  lang?: string;
}

/**
 * Full logo lockup: mark + "أبو شهم" / "Abu Shahm" + rules + "للعقارات" / "Real Estate"
 * variant='dark': navy typography (for light backgrounds)
 * variant='light': bright white typography (for dark navy backgrounds)
 */
export function LogoFull({ className, variant = 'dark', lang = 'ar' }: LogoFullProps) {
  const isLight = variant === 'light';
  const isEn = lang === 'en';

  const textColor = isLight ? '!text-white' : 'text-navy';
  const subtextColor = isLight ? '!text-white/95' : 'text-navy';
  const ruleColor = isLight ? 'bg-cyan-dark' : 'bg-cyan-light';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className || ''}`}>
      <LogoMark variant={variant} width={40} height={50} className="flex-shrink-0" />
      <div className="flex flex-col items-start leading-none">
        <span
          className={`font-display text-lg md:text-xl font-extrabold leading-tight tracking-tight ${textColor}`}
        >
          {isEn ? 'Abu Shahm' : 'أبو شهم'}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`block h-0.5 w-3 rounded ${ruleColor}`} />
          <span
            className={`font-body text-xs font-semibold ${isEn ? 'tracking-wider uppercase' : ''} ${subtextColor}`}
          >
            {isEn ? 'Real Estate' : 'للعقارات'}
          </span>
          <span className={`block h-0.5 w-3 rounded ${ruleColor}`} />
        </div>
      </div>
    </div>
  );
}

export default LogoFull;
