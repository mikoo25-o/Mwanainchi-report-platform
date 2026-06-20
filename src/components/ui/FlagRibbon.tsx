'use client'
import React from 'react'

interface FlagRibbonProps {
  position: 'bottom-left' | 'bottom-right' | 'top-right'
  opacity?: number
  scale?: number
}

export default function FlagRibbon({ position, opacity = 1, scale = 1 }: FlagRibbonProps) {
  const isRight = position === 'bottom-right' || position === 'top-right'
  const isTop = position === 'top-right'

  const positionStyles: React.CSSProperties = {
    position: 'absolute',
    width: `${320 * scale}px`,
    height: `${160 * scale}px`,
    opacity,
    pointerEvents: 'none',
    ...(isTop
      ? { top: 0, right: 0 }
      : isRight
      ? { bottom: 0, right: 0 }
      : { bottom: 0, left: 0 }),
  }

  return (
    <div style={positionStyles}>
      <svg
        viewBox="0 0 320 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          transform: isRight ? 'scaleX(-1)' : 'none',
        }}
      >
        <defs>
          <clipPath id={`ribbon-clip-${position}`}>
            <ellipse cx="80" cy="160" rx="280" ry="140" />
          </clipPath>
        </defs>
        <g clipPath={`url(#ribbon-clip-${position})`} transform="rotate(-20, 160, 80)">
          {/* Black stripe */}
          <rect x="-20" y="40" width="400" height="25" fill="#0A0A0A" />
          {/* White border */}
          <rect x="-20" y="63" width="400" height="5" fill="white" />
          {/* Red stripe */}
          <rect x="-20" y="66" width="400" height="45" fill="#C8102E" />
          {/* White border */}
          <rect x="-20" y="109" width="400" height="5" fill="white" />
          {/* Green stripe */}
          <rect x="-20" y="112" width="400" height="30" fill="#006600" />
        </g>
      </svg>
    </div>
  )
}
