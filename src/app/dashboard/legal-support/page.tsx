'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Search, Scale, UserCheck, Gift, HandshakeIcon,
  Globe, MapPin, ChevronRight, CheckCircle2,
  UserX, FileText, MessageSquare, Bot,
} from 'lucide-react'

const SPECIALIZATIONS = ['All', 'Criminal Law', 'Family Law', 'Land Disputes', 'Corruption', 'Human Rights', 'Cybercrime', 'Labour Law']

const BANNER_ITEMS = [
  {
    icon: <UserCheck size={20} color="rgba(255,255,255,0.9)" />,
    title: 'Verified Lawyers',
    desc: 'All lawyers are verified by the Law Society of Kenya',
  },
  {
    icon: <Gift size={20} color="rgba(255,255,255,0.9)" />,
    title: 'Free Consultation',
    desc: 'First consultation is always free for citizens',
  },
  {
    icon: <Scale size={20} color="rgba(255,255,255,0.9)" />,
    title: 'Legal Aid',
    desc: 'Pro bono support available for those who qualify',
  },
  {
    icon: <Globe size={20} color="rgba(255,255,255,0.9)" />,
    title: 'Nationwide',
    desc: 'Lawyers covering all 47 counties of Kenya',
  },
]

const AI_FEATURES = [
  'Generate demand letters',
  'Understand your legal rights',
  'Court process guidance',
  'Draft affidavits & complaints',
]

export default function LegalSupportPage() {
  const [search, setSearch] = useState('')
  const [spec, setSpec] = useState('All')

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>

      {/* ── Background image only for this page section (not covering menu) ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <img
          src="/dashboard-bg-light.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right top', opacity: 0.45 }}
        />
      </div>

      {/* All content sits above the background */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,30px)', marginBottom: '4px' }}>
            Legal Support
          </h1>
          <p style={{ color: '#6B7280', fontSize: '13px' }}>
            Connect with qualified, verified lawyers across Kenya. Free initial consultations available.
          </p>
        </div>

        {/* Info banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1a0500 100%)',
          borderRadius: '16px', padding: '28px', marginBottom: '24px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
          gap: '24px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Scales watermark */}
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.06, pointerEvents: 'none' }}>
            <Scale size={140} color="white" />
          </div>

          {BANNER_ITEMS.map(item => (
            <div key={item.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '13px', marginBottom: '3px' }}>{item.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {/* Search input */}
            <div style={{
              flex: 1, minWidth: '200px', background: '#F5F5F5',
              borderRadius: '8px', padding: '9px 14px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Search size={15} color="#9CA3AF" />
              <input
                placeholder="Search lawyers by name, specialization, or county..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: '#374151' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* County select */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <MapPin size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
              <select style={{
                border: '1.5px solid #E5E7EB', borderRadius: '8px',
                padding: '9px 14px 9px 32px', fontSize: '13px',
                outline: 'none', cursor: 'pointer', background: 'white', color: '#374151',
                appearance: 'none',
              }}>
                <option>All Counties</option>
                <option>Nairobi</option>
                <option>Mombasa</option>
                <option>Kisumu</option>
                <option>Nakuru</option>
              </select>
            </div>

            {/* Language select */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Globe size={14} color="#9CA3AF" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
              <select style={{
                border: '1.5px solid #E5E7EB', borderRadius: '8px',
                padding: '9px 14px 9px 32px', fontSize: '13px',
                outline: 'none', cursor: 'pointer', background: 'white', color: '#374151',
                appearance: 'none',
              }}>
                <option>All Languages</option>
                <option>English</option>
                <option>Kiswahili</option>
              </select>
            </div>
          </div>

          {/* Specialization pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SPECIALIZATIONS.map(s => (
              <button key={s} onClick={() => setSpec(s)} style={{
                padding: '5px 14px', borderRadius: '20px', border: '1.5px solid',
                borderColor: spec === s ? '#C8102E' : '#E5E7EB',
                background: spec === s ? '#FEF2F2' : 'white',
                color: spec === s ? '#C8102E' : '#6B7280',
                fontSize: '12px', fontWeight: spec === s ? 700 : 400,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        <div style={{
          background: 'white', borderRadius: '16px',
          padding: '72px 32px', textAlign: 'center',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Subtle watermark */}
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.04, pointerEvents: 'none' }}>
            <Scale size={200} color="#0A0A0A" />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: '#F3F4F6', border: '2px solid #E5E7EB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <UserX size={36} color="#9CA3AF" strokeWidth={1.5} />
              </div>
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '20px', marginBottom: '10px', fontFamily: "'Playfair Display', serif" }}>
              No Lawyers Registered Yet
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px', maxWidth: '440px', margin: '0 auto 28px', lineHeight: 1.7 }}>
              Lawyers will appear here once they create their profiles. If you are a lawyer, join our platform to connect with citizens who need help.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{
                background: '#C8102E', color: 'white', textDecoration: 'none',
                padding: '11px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
              }}>
                <UserCheck size={15} />
                Register as a Lawyer
              </Link>
              <Link href="/dashboard/rights" style={{
                background: '#F3F4F6', color: '#374151', textDecoration: 'none',
                padding: '11px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '13px',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
              }}>
                <FileText size={15} />
                Browse Legal Resources
              </Link>
            </div>
          </div>
        </div>

        {/* AI Legal Aid section */}
        <div style={{
          background: 'linear-gradient(135deg, #006600, #004D00)',
          borderRadius: '16px', padding: '32px', marginTop: '20px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: '28px', alignItems: 'center', position: 'relative', overflow: 'hidden',
        }}>
          {/* Bot watermark */}
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.06, pointerEvents: 'none' }}>
            <Bot size={160} color="white" />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.15)', borderRadius: '6px',
              padding: '4px 10px', fontSize: '11px', color: 'white',
              fontWeight: 700, marginBottom: '12px', letterSpacing: '0.08em',
            }}>
              <Bot size={12} /> AI-POWERED
            </div>
            <h3 style={{
              color: 'white', fontWeight: 800, fontSize: '22px',
              fontFamily: "'Playfair Display', serif", marginBottom: '10px',
            }}>
              Legal Aid Assistant
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: 1.7 }}>
              Can't afford a lawyer? Our AI provides basic legal guidance, rights education, procedure explanations, and document generation — all in English, Kiswahili, and Sheng.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {AI_FEATURES.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'rgba(74,222,128,0.2)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <CheckCircle2 size={13} color="#4ade80" strokeWidth={2.5} />
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>{item}</span>
                </div>
              ))}
            </div>
            <button style={{
              background: 'white', color: '#006600', border: 'none',
              borderRadius: '8px', padding: '12px 24px',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', transition: 'opacity 0.2s',
            }}>
              <MessageSquare size={15} />
              Chat with AI Legal Aid
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}