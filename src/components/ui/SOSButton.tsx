'use client'
import React from 'react'

interface SOSButtonProps {
  variant?: 'floating' | 'inline' | 'banner'
}

export default function SOSButton({ variant = 'floating' }: SOSButtonProps) {
  const handleSOS = () => {
    // In production: trigger emergency protocol
    alert('Emergency SOS activated. Your location is being recorded and emergency contacts notified.')
  }

  if (variant === 'banner') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1a0000, #2d0000)',
        border: '1px solid rgba(200,16,46,0.3)',
        borderRadius: '12px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        <div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>
            Need Urgent Help?
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
            Press for Emergency
          </div>
        </div>
        <button
          onClick={handleSOS}
          className="sos-btn"
          style={{
            background: '#C8102E',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
            minWidth: '64px',
          }}
        >
          SOS
        </button>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={handleSOS}
        className="sos-btn"
        style={{
          background: '#C8102E',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 24px',
          fontWeight: 800,
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <span>🔔</span> Use SOS
      </button>
    )
  }

  // Floating variant
  return (
    <button
      onClick={handleSOS}
      className="sos-btn"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: '#C8102E',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        fontWeight: 800,
        fontSize: '13px',
        cursor: 'pointer',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '0.05em',
        boxShadow: '0 4px 20px rgba(200,16,46,0.4)',
      }}
      title="Emergency SOS"
    >
      SOS
    </button>
  )
}
