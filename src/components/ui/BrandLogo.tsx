'use client'
import React from 'react'

interface BrandLogoProps {
  variant?: 'dark' | 'light'  // dark = white text (on dark bg), light = dark text (on white bg)
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

export default function BrandLogo({ variant = 'dark', size = 'md', showTagline = true }: BrandLogoProps) {
  const textColor = variant === 'dark' ? 'white' : '#0A0A0A'
  const taglineColor = variant === 'dark' ? 'rgba(255,255,255,0.45)' : '#6B7280'

  const sizes = {
    sm: { img: 40, heading: '15px', report: '10px', tagline: '8px', gap: '9px' },
    md: { img: 52, heading: '19px', report: '12px', tagline: '9px', gap: '11px' },
    lg: { img: 68, heading: '24px', report: '14px', tagline: '10px', gap: '14px' },
  }
  const s = sizes[size]

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap, userSelect: 'none', textDecoration: 'none' }}>
      {/* Kenya Coat of Arms */}
      <img
        src="/coat-of-arms.jpg"
        alt="Kenya Coat of Arms"
        style={{
          width: s.img, height: s.img,
          objectFit: 'contain', flexShrink: 0,
          filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))',
        }}
      />
      {/* Text */}
      <div>
        {/* MWANAINCHI */}
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 900, fontSize: s.heading,
          color: textColor, letterSpacing: '0em', lineHeight: 1.1,
        }}>
          MWAN<span style={{ color: '#C8102E' }}>AI</span>NCHI
        </div>
        {/* — REPORT — */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '2px 0' }}>
          <div style={{ height: '1.5px', width: '14px', background: '#C8102E' }} />
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 800, fontSize: s.report,
            color: textColor, letterSpacing: '0.22em',
          }}>
            REPORT
          </span>
          <div style={{ height: '1.5px', width: '14px', background: '#C8102E' }} />
        </div>
        {/* Tagline */}
        {showTagline && (
          <div style={{ fontSize: s.tagline, color: taglineColor, letterSpacing: '0.02em' }}>
            Your Voice. Your Rights.{' '}
            <span style={{ color: '#4ade80', fontWeight: 600 }}>Your Justice.</span>
          </div>
        )}
      </div>
    </div>
  )
}