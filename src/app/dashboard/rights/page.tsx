'use client'
import React, { useState } from 'react'
import {
  Heart, Equal, Users, ShieldOff, Lock, Scale,
  BookOpen, Gavel, Shield, Search, MapPin, Eye,
  FileText, ChevronRight, Download, Building2,
  ExternalLink,
} from 'lucide-react'

const RIGHTS = [
  {
    title: 'Right to Life',
    article: 'Article 26',
    desc: 'Every person has the right to life. The life of a person begins at conception.',
    color: '#C8102E',
    icon: <Heart size={20} />,
  },
  {
    title: 'Right to Equality',
    article: 'Article 27',
    desc: 'Every person is equal before the law and has the right to equal protection and benefit of the law.',
    color: '#2563EB',
    icon: <Equal size={20} />,
  },
  {
    title: 'Right to Human Dignity',
    article: 'Article 28',
    desc: 'Every person has inherent dignity and the right to have that dignity respected and protected.',
    color: '#7C3AED',
    icon: <Users size={20} />,
  },
  {
    title: 'Freedom from Torture',
    article: 'Article 29',
    desc: 'Every person has the right to freedom and security, and shall not be subjected to torture or cruel treatment.',
    color: '#006600',
    icon: <ShieldOff size={20} />,
  },
  {
    title: 'Right to Privacy',
    article: 'Article 31',
    desc: 'Every person has the right to privacy, including the right not to have their home or possessions searched.',
    color: '#D97706',
    icon: <Lock size={20} />,
  },
  {
    title: 'Right to Fair Trial',
    article: 'Article 50',
    desc: 'Every person has the right to have any dispute resolved by the application of law decided in a fair and public hearing.',
    color: '#0A0A0A',
    icon: <Scale size={20} />,
  },
]

const RESOURCES = [
  { title: 'Constitution of Kenya 2010', type: 'Document', color: '#006600', icon: <BookOpen size={20} /> },
  { title: 'Penal Code of Kenya', type: 'Legislation', color: '#C8102E', icon: <Gavel size={20} /> },
  { title: 'Sexual Offences Act', type: 'Legislation', color: '#7C3AED', icon: <Shield size={20} /> },
  { title: 'Anti-Corruption Act', type: 'Legislation', color: '#D97706', icon: <Search size={20} /> },
  { title: 'Land Act 2012', type: 'Legislation', color: '#2563EB', icon: <MapPin size={20} /> },
  { title: 'How to File a Police Report', type: 'Guide', color: '#059669', icon: <FileText size={20} /> },
  { title: 'Court Procedures in Kenya', type: 'Guide', color: '#0A0A0A', icon: <Building2 size={20} /> },
  { title: 'Witness Protection Rights', type: 'Guide', color: '#C8102E', icon: <Eye size={20} /> },
]

const ORGS = [
  {
    name: 'Kenya National Commission on Human Rights',
    abbr: 'KNCHR',
    desc: 'Independent constitutional commission protecting human rights',
    color: '#C8102E',
    icon: <MapPin size={20} />,
  },
  {
    name: 'Law Society of Kenya',
    abbr: 'LSK',
    desc: 'Professional body for lawyers; advocates for rule of law',
    color: '#006600',
    icon: <Scale size={20} />,
  },
  {
    name: 'Independent Policing Oversight Authority',
    abbr: 'IPOA',
    desc: 'Oversight of police conduct and accountability',
    color: '#2563EB',
    icon: <Shield size={20} />,
  },
  {
    name: 'Kenya Women & Children Foundation',
    abbr: 'KWCF',
    desc: 'Support and protection for women and children',
    color: '#7C3AED',
    icon: <Users size={20} />,
  },
]

const TABS = [
  { key: 'rights', label: 'Your Rights', icon: <Scale size={14} /> },
  { key: 'resources', label: 'Legal Resources', icon: <BookOpen size={14} /> },
  { key: 'orgs', label: 'Support Organizations', icon: <Building2 size={14} /> },
]

export default function RightsPage() {
  const [tab, setTab] = useState<'rights' | 'resources' | 'orgs'>('rights')
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,30px)', marginBottom: '4px' }}>
          Rights & Resources
        </h1>
        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          Know your constitutional rights and access legal resources. Knowledge is power.
        </p>
      </div>

      {/* Constitution banner */}
      <div style={{
        borderRadius: '16px', overflow: 'hidden', marginBottom: '24px',
        position: 'relative', minHeight: '160px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '32px', flexWrap: 'wrap', gap: '20px',
      }}>
        <img src="/dashboard-header-bg.png" alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(10,10,10,0.95) 40%,rgba(10,10,10,0.6) 75%,rgba(10,10,10,0.1) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ color: '#C8102E', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '8px' }}>
            CONSTITUTION OF KENYA 2010
          </div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: 'white', fontWeight: 800, fontSize: 'clamp(16px,2.5vw,22px)', marginBottom: '8px', maxWidth: '500px' }}>
            "Every Kenyan has fundamental rights and freedoms."
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
            The Bill of Rights is an integral part of Kenya's democratic state.
          </p>
        </div>

        {/* Constitution book */}
        <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
          <div style={{ width: 'clamp(90px,10vw,130px)', height: 'clamp(110px,13vw,160px)', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            <img src="/constitution-kenya.jpg" alt="Constitution of Kenya"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <button style={{
          position: 'relative', zIndex: 1,
          background: '#C8102E', color: 'white', border: 'none',
          borderRadius: '10px', padding: '12px 22px',
          fontWeight: 700, fontSize: '13px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap',
        }}>
          <Download size={15} strokeWidth={2.5} />
          Download Full Constitution
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)} style={{
            padding: '9px 20px', borderRadius: '8px', border: 'none',
            background: tab === t.key ? '#C8102E' : 'white',
            color: tab === t.key ? 'white' : '#6B7280',
            fontWeight: tab === t.key ? 700 : 500,
            fontSize: '13px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '7px',
            boxShadow: tab === t.key ? '0 4px 14px rgba(200,16,46,0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
            transition: 'all 0.2s',
            transform: tab === t.key ? 'translateY(-1px)' : 'none',
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── RIGHTS TAB ── */}
      {tab === 'rights' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '16px' }}>
          {RIGHTS.map(r => (
            <div
              key={r.title}
              onMouseEnter={() => setHoveredCard(r.title)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: 'white',
                borderRadius: '14px',
                padding: '24px',
                boxShadow: hoveredCard === r.title
                  ? `0 12px 32px rgba(0,0,0,0.12), 0 0 0 2px ${r.color}30`
                  : '0 2px 8px rgba(0,0,0,0.06)',
                transform: hoveredCard === r.title ? 'translateY(-4px)' : 'none',
                transition: 'all 0.25s ease',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left accent bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, bottom: 0,
                width: '4px', background: r.color,
                borderRadius: '14px 0 0 14px',
              }} />

              <div style={{ paddingLeft: '8px' }}>
                {/* Icon + title row */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '10px',
                    background: `${r.color}12`, color: r.color, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                    ...(hoveredCard === r.title ? { background: `${r.color}22` } : {}),
                  }}>
                    {r.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0A0A0A', marginBottom: '3px' }}>
                      {r.title}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      background: `${r.color}12`, color: r.color,
                      fontSize: '10px', fontWeight: 700,
                      padding: '2px 8px', borderRadius: '20px',
                      letterSpacing: '0.05em',
                    }}>
                      {r.article}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '12.5px', color: '#6B7280', lineHeight: 1.65, margin: 0 }}>
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── RESOURCES TAB ── */}
      {tab === 'resources' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '14px' }}>
          {RESOURCES.map(r => (
            <a
              key={r.title}
              href="#"
              onMouseEnter={() => setHoveredCard(r.title)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '18px 20px',
                textDecoration: 'none',
                boxShadow: hoveredCard === r.title
                  ? `0 10px 28px rgba(0,0,0,0.1), 0 0 0 2px ${r.color}30`
                  : '0 2px 8px rgba(0,0,0,0.06)',
                transform: hoveredCard === r.title ? 'translateY(-3px)' : 'none',
                transition: 'all 0.22s ease',
                display: 'flex', gap: '14px', alignItems: 'center',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Bottom accent line */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '3px', background: r.color,
                transform: hoveredCard === r.title ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform 0.25s ease',
              }} />

              <div style={{
                width: '46px', height: '46px', borderRadius: '10px',
                background: `${r.color}10`, color: r.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'background 0.2s',
                ...(hoveredCard === r.title ? { background: `${r.color}20` } : {}),
              }}>
                {r.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '13px', color: '#0A0A0A', marginBottom: '5px', lineHeight: 1.3 }}>
                  {r.title}
                </div>
                <span style={{
                  background: `${r.color}12`, color: r.color,
                  fontSize: '10px', fontWeight: 700,
                  padding: '2px 8px', borderRadius: '10px',
                  letterSpacing: '0.05em',
                }}>
                  {r.type}
                </span>
              </div>

              <ExternalLink size={15} color={hoveredCard === r.title ? r.color : '#D1D5DB'}
                style={{ flexShrink: 0, transition: 'color 0.2s' }} />
            </a>
          ))}
        </div>
      )}

      {/* ── ORGS TAB ── */}
      {tab === 'orgs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '16px' }}>
          {ORGS.map(org => (
            <div
              key={org.abbr}
              onMouseEnter={() => setHoveredCard(org.abbr)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: 'white',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: hoveredCard === org.abbr
                  ? `0 12px 32px rgba(0,0,0,0.12), 0 0 0 2px ${org.color}30`
                  : '0 2px 8px rgba(0,0,0,0.06)',
                transform: hoveredCard === org.abbr ? 'translateY(-4px)' : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Top colour strip */}
              <div style={{ height: '5px', background: org.color }} />

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '12px',
                    background: `${org.color}12`, color: org.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {org.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: '#0A0A0A', letterSpacing: '0.02em' }}>
                      {org.abbr}
                    </div>
                    <div style={{ fontSize: '11px', color: org.color, fontWeight: 600, lineHeight: 1.3 }}>
                      {org.desc}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.6, marginBottom: '16px' }}>
                  {org.name}
                </p>

                <button style={{
                  background: `${org.color}10`,
                  border: `1.5px solid ${org.color}25`,
                  borderRadius: '7px',
                  padding: '8px 16px', fontSize: '12px', fontWeight: 700,
                  cursor: 'pointer', color: org.color,
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.2s',
                  width: '100%', justifyContent: 'center',
                }}>
                  Learn More <ChevronRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap');
      `}</style>
    </div>
  )
}