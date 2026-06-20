'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Siren, MapPin, Mic, Video, Smartphone,
  Package, Scale, CheckCircle2, UserPlus,
  Phone, ShieldAlert, Flame, AlertTriangle,
  XCircle,
} from 'lucide-react'

const EMERGENCY_CONTACTS = [
  { label: 'Police Emergency', number: '0794147131', color: '#2563EB', bg: '#EFF6FF', icon: <ShieldAlert size={22} color="#2563EB" /> },
  { label: 'Ambulance', number: '0794147131', color: '#059669', bg: '#F0FDF4', icon: <Phone size={22} color="#059669" /> },
  { label: 'Fire Brigade', number: '0794147131', color: '#D97706', bg: '#FFFBEB', icon: <Flame size={22} color="#D97706" /> },
  { label: 'Gender Violence', number: '0794147131', color: '#7C3AED', bg: '#F5F3FF', icon: <AlertTriangle size={22} color="#7C3AED" /> },
]

const SOS_ACTIONS = [
  { icon: <MapPin size={18} color="#C8102E" />, bg: '#FEF2F2', title: 'Location Captured', desc: 'Your GPS coordinates are instantly recorded' },
  { icon: <Mic size={18} color="#C8102E" />, bg: '#FEF2F2', title: 'Audio Recording', desc: 'Ambient audio is captured as evidence' },
  { icon: <Video size={18} color="#C8102E" />, bg: '#FEF2F2', title: 'Video Stored', desc: 'Front camera begins recording if permitted' },
  { icon: <Smartphone size={18} color="#C8102E" />, bg: '#FEF2F2', title: 'Contacts Alerted', desc: 'Your trusted emergency contacts are notified' },
  { icon: <Package size={18} color="#C8102E" />, bg: '#FEF2F2', title: 'Evidence Package', desc: 'All data is bundled into a secure evidence package' },
  { icon: <Scale size={18} color="#C8102E" />, bg: '#FEF2F2', title: 'Case Created', desc: 'An emergency case is automatically opened' },
]

export default function EmergencyPage() {
  const [sosActive, setSosActive] = useState(false)

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 800,
          fontSize: 'clamp(22px,3vw,30px)', marginBottom: '4px',
          color: '#C8102E', display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <Siren size={28} color="#C8102E" /> Emergency SOS
        </h1>
        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          Immediate help when you need it most. Your safety is our highest priority.
        </p>
      </div>

      {/* SOS Big button card */}
      <div style={{
        background: sosActive
          ? 'linear-gradient(135deg, #7F0000, #C8102E)'
          : 'linear-gradient(135deg, #0A0A0A, #1a0000)',
        borderRadius: '20px', padding: '48px 32px',
        textAlign: 'center', marginBottom: '24px',
        transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
      }}>
        {sosActive && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle, rgba(200,16,46,0.4) 0%, transparent 70%)',
            animation: 'pulseRed 1.5s infinite',
          }} />
        )}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <Siren size={28} color={sosActive ? '#ffaaaa' : 'rgba(255,255,255,0.5)'} />
          </div>
          <h2 style={{
            color: 'white', fontWeight: 800, fontSize: '22px',
            marginBottom: '8px', fontFamily: "'Playfair Display', serif",
          }}>
            {sosActive ? 'SOS ACTIVE — Help is on the way' : 'Are you in immediate danger?'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            {sosActive
              ? 'Your location has been captured and emergency contacts notified. Stay calm.'
              : 'Press the button below to instantly alert emergency services and your trusted contacts.'}
          </p>

          {/* Big SOS circle button */}
          <button
            onClick={() => setSosActive(!sosActive)}
            style={{
              width: '140px', height: '140px', borderRadius: '50%',
              background: sosActive ? '#7F0000' : '#C8102E',
              color: 'white', border: sosActive ? '4px solid rgba(255,255,255,0.4)' : '4px solid rgba(200,16,46,0.5)',
              fontWeight: 900, fontSize: '28px', cursor: 'pointer',
              letterSpacing: '0.05em', transition: 'all 0.3s',
              boxShadow: sosActive
                ? '0 0 0 16px rgba(200,16,46,0.2), 0 8px 32px rgba(200,16,46,0.6)'
                : '0 8px 32px rgba(200,16,46,0.6)',
              animation: !sosActive ? 'sosPulse 1.5s ease-in-out infinite' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
              flexDirection: 'column', gap: '4px',
            }}
          >
            <Siren size={32} color="white" />
            <span style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '0.08em' }}>SOS</span>
          </button>

          {sosActive && (
            <div style={{ marginTop: '24px' }}>
              <button
                onClick={() => setSosActive(false)}
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: 'white', border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '8px', padding: '9px 22px',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}
              >
                <XCircle size={15} /> Cancel SOS
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Emergency contacts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px', marginBottom: '24px' }}>
        {EMERGENCY_CONTACTS.map(c => (
          <a key={c.label} href={`tel:${c.number}`} style={{
            background: 'white', borderRadius: '14px', padding: '20px',
            textDecoration: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', gap: '8px', transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <div style={{
              width: '50px', height: '50px', borderRadius: '12px',
              background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {c.icon}
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0A0A0A' }}>{c.label}</div>
            <div style={{
              fontWeight: 800, fontSize: '24px', color: c.color,
              fontFamily: "'JetBrains Mono', monospace",
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <Phone size={16} color={c.color} />
              {c.number}
            </div>
          </a>
        ))}
      </div>

      {/* What SOS does */}
      <div style={{
        background: 'white', borderRadius: '16px', padding: '28px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <ShieldAlert size={18} color="#C8102E" />
          <h2 style={{ fontWeight: 700, fontSize: '18px' }}>
            What Happens When You Press SOS
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
          {SOS_ACTIONS.map(item => (
            <div key={item.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '9px',
                background: item.bg, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '3px' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trusted contacts setup */}
      <div style={{
        background: '#F0FDF4', border: '1px solid rgba(0,102,0,0.2)',
        borderRadius: '14px', padding: '20px',
        display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '10px',
          background: 'rgba(0,102,0,0.12)', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle2 size={22} color="#006600" />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#006600', marginBottom: '6px' }}>
            Set Up Trusted Contacts
          </h3>
          <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, marginBottom: '14px' }}>
            Add family members, friends, or community leaders who will be alerted when you activate SOS. Go to your Profile settings to add trusted contacts.
          </p>
          <Link href="/dashboard/profile" style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            background: '#006600', color: 'white', textDecoration: 'none',
            padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
          }}>
            <UserPlus size={15} />
            Add Trusted Contacts
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes sosPulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(200,16,46,0.6), 0 0 0 0 rgba(200,16,46,0.5); }
          70% { box-shadow: 0 8px 32px rgba(200,16,46,0.6), 0 0 0 20px rgba(200,16,46,0); }
        }
        @keyframes pulseRed {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}