import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Try to load image logo first */}
      <img
        src={`/images/logo${size === 'small' ? '-small' : ''}.png`}
        alt="SoftArt AI HUB Logo"
        className="w-full h-full object-contain"
        onError={(e) => {
          // Hide image and show SVG fallback
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'block';
        }}
      />

      {/* SVG Fallback Logo */}
      <div className="w-full h-full hidden">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#3730a3" />
            </linearGradient>
          </defs>

          {/* Background Circle */}
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="url(#logoGradient)"
            stroke="#a78bfa"
            strokeWidth="2"
          />

          {/* AI Text */}
          <text
            x="24"
            y="28"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            AI
          </text>

          {/* Decorative Elements */}
          <circle cx="16" cy="16" r="2" fill="white" opacity="0.8" />
          <circle cx="32" cy="16" r="2" fill="white" opacity="0.8" />
          <circle cx="24" cy="36" r="1.5" fill="white" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
};

export default Logo;


