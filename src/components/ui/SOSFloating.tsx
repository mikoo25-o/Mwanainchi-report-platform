'use client'
import React from 'react'

export default function SOSFloating() {
  return (
    <button
      onClick={() => alert('Emergency SOS activated. Your location is being recorded and emergency contacts notified.')}
      style={{
        position: 'fixed', bottom: '24px', right: '24px',
        background: '#C8102E', color: 'white', border: 'none',
        borderRadius: '50%', width: '58px', height: '58px',
        fontWeight: 800, fontSize: '13px', cursor: 'pointer',
        zIndex: 1000, letterSpacing: '0.05em',
        boxShadow: '0 4px 20px rgba(200,16,46,0.45)',
        animation: 'sosPulse 1.5s ease-in-out infinite',
      }}
    >
      SOS
      <style>{`
        @keyframes sosPulse {
          0%,100% { box-shadow: 0 4px 20px rgba(200,16,46,0.45), 0 0 0 0 rgba(200,16,46,0.7); }
          70% { box-shadow: 0 4px 20px rgba(200,16,46,0.45), 0 0 0 12px rgba(200,16,46,0); }
        }
      `}</style>
    </button>
  )
}
