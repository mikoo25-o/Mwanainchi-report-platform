'use client'
import React from 'react'

interface LogoProps {
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

export default function Logo({ variant = 'dark', size = 'md', showTagline = true }: LogoProps) {
  const textColor = variant === 'light' ? '#FFFFFF' : '#0A0A0A'
  const redColor = '#C8102E'
  const greenColor = '#006600'

  const sizes = {
    sm: { shield: 28, heading: '13px', tagline: '7px', gap: '8px' },
    md: { shield: 40, heading: '16px', tagline: '9px', gap: '10px' },
    lg: { shield: 56, heading: '22px', tagline: '11px', gap: '12px' },
  }

  const s = sizes[size]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap, userSelect: 'none' }}>
      {/* Shield / Coat of Arms inspired icon */}
      <svg width={s.shield} height={s.shield * 1.15} viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield shape */}
        <path d="M20 2 L36 8 L36 24 Q36 38 20 44 Q4 38 4 24 L4 8 Z" fill={redColor} />
        <path d="M20 4 L34 9.5 L34 24 Q34 36.5 20 42 Q6 36.5 6 24 L6 9.5 Z" fill="#0A0A0A" />
        {/* Kenya flag stripes inside shield */}
        <clipPath id="shield-clip">
          <path d="M20 4 L34 9.5 L34 24 Q34 36.5 20 42 Q6 36.5 6 24 L6 9.5 Z" />
        </clipPath>
        <g clipPath="url(#shield-clip)">
          <rect x="6" y="4" width="28" height="10" fill="#0A0A0A" />
          <rect x="6" y="13" width="28" height="1.5" fill="white" />
          <rect x="6" y="14" width="28" height="14" fill={redColor} />
          <rect x="6" y="27.5" width="28" height="1.5" fill="white" />
          <rect x="6" y="29" width="28" height="14" fill={greenColor} />
        </g>
        {/* Maasai shield/spear overlay */}
        <ellipse cx="20" cy="23" rx="5" ry="9" fill="white" opacity="0.15" />
        <line x1="20" y1="7" x2="20" y2="39" stroke="white" strokeWidth="1" opacity="0.6" />
        {/* Lions suggestion on sides */}
        <circle cx="9" cy="10" r="2" fill="#FFD700" opacity="0.8" />
        <circle cx="31" cy="10" r="2" fill="#FFD700" opacity="0.8" />
        {/* Top star */}
        <polygon points="20,3 21,6 24,6 21.5,7.5 22.5,10.5 20,8.5 17.5,10.5 18.5,7.5 16,6 19,6" fill="#FFD700" />
      </svg>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0px' }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 800,
            fontSize: s.heading,
            color: textColor,
            letterSpacing: '0.05em',
          }}>
            MWANA
          </span>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 800,
            fontSize: s.heading,
            color: redColor,
            letterSpacing: '0.05em',
          }}>
            I
          </span>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 800,
            fontSize: s.heading,
            color: textColor,
            letterSpacing: '0.05em',
          }}>
            NCHI
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginTop: '1px',
        }}>
          <div style={{ height: '1px', width: '16px', background: redColor }} />
          <span style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: s.heading,
            color: textColor,
            letterSpacing: '0.25em',
          }}>
            REPORT
          </span>
          <div style={{ height: '1px', width: '16px', background: redColor }} />
        </div>
        {showTagline && (
          <span style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontWeight: 400,
            fontSize: s.tagline,
            color: variant === 'light' ? 'rgba(255,255,255,0.7)' : '#6B7280',
            letterSpacing: '0.05em',
            marginTop: '2px',
          }}>
            Your Voice. Your Rights.{' '}
            <span style={{ color: greenColor, fontWeight: 600 }}>Your Justice.</span>
          </span>
        )}
      </div>
    </div>
  )
}
