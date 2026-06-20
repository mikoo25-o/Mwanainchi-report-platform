'use client'
import React, { useState } from 'react'
import Link from 'next/link'

interface TopNavProps {
  userName?: string
  userLocation?: string
  notificationCount?: number
  messageCount?: number
}

export default function TopNav({ userName, userLocation = 'Nairobi, Kenya', notificationCount = 0, messageCount = 0 }: TopNavProps) {
  const [langOpen, setLangOpen] = useState(false)
  const [lang, setLang] = useState('EN')

  return (
    <header style={{
      height: '60px', background: 'white',
      borderBottom: '1px solid #F0F0F0',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px 0 56px',
      position: 'sticky', top: 0, zIndex: 30,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: '#F5F5F5', borderRadius: '8px',
        padding: '7px 14px', flex: 1, maxWidth: '400px',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="Search cases, messages, support..."
          style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: '#374151', width: '100%' }} />
      </div>

      {/* Right icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Bell */}
        <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {notificationCount > 0 && (
            <span style={{
              position: 'absolute', top: '0', right: '0',
              background: '#C8102E', color: 'white', borderRadius: '50%',
              width: '16px', height: '16px', fontSize: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
            }}>{notificationCount}</span>
          )}
        </button>

        {/* Mail */}
        <Link href="/dashboard/messages" style={{ position: 'relative', display: 'flex', padding: '4px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          {messageCount > 0 && (
            <span style={{
              position: 'absolute', top: '0', right: '0',
              background: '#C8102E', color: 'white', borderRadius: '50%',
              width: '16px', height: '16px', fontSize: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
            }}>{messageCount}</span>
          )}
        </Link>

        {/* Shield */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </button>

        {/* Language */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setLangOpen(!langOpen)} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', color: '#374151', padding: '4px 6px',
            borderRadius: '6px', fontWeight: 500,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            {lang}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {langOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', background: 'white',
              border: '1px solid #E5E7EB', borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: '130px', zIndex: 100, overflow: 'hidden',
            }}>
              {[['EN','English'],['SW','Kiswahili'],['SH','Sheng']].map(([code,name]) => (
                <button key={code} onClick={() => { setLang(code); setLangOpen(false) }} style={{
                  display: 'block', width: '100%', padding: '8px 14px', textAlign: 'left',
                  background: lang === code ? '#FEF2F2' : 'none', border: 'none', cursor: 'pointer',
                  fontSize: '13px', color: lang === code ? '#C8102E' : '#374151', fontWeight: lang === code ? 600 : 400,
                }}>
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User avatar */}
        {userName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#C8102E,#8B0000)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0A0A0A' }}>{userName}</div>
              <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{userLocation}</div>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        )}
      </div>
    </header>
  )
}
