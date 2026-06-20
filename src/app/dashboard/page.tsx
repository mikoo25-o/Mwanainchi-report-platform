'use client'
import React from 'react'
import Link from 'next/link'

const STATS = [
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    bg: '#F0FDF4', label: 'My Cases', value: '0', sub: 'No cases yet', sub2: 'Start by reporting an incident.' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    bg: '#FEF2F2', label: 'Evidence Uploaded', value: '0', sub: 'Your evidence is safe', sub2: 'Secure. Private. Tamper-proof.' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/><line x1="7" y1="3" x2="7" y2="21"/><line x1="17" y1="3" x2="17" y2="21"/></svg>,
    bg: '#FFFBEB', label: 'Messages', value: '0', sub: 'No new messages', sub2: 'From legal team or support.' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    bg: '#F0FDF4', label: 'Alerts', value: '0', sub: 'No new alerts', sub2: "You're all caught up." },
]

const JOURNEY = [
  { n: 1, label: 'Report', desc: 'Submit details of the incident', color: '#006600' },
  { n: 2, label: 'Evidence', desc: 'Upload any supporting evidence', color: '#C8102E' },
  { n: 3, label: 'Review', desc: 'Our team reviews your report', color: '#D97706' },
  { n: 4, label: 'Support', desc: 'Connect with lawyers and get help', color: '#006600' },
]

const RIGHTS_ITEMS = [
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title: 'Confidential', desc: 'Your identity is always protected' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: 'Secure', desc: 'Your data is encrypted and safe' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, title: 'Independent', desc: 'We are independent and impartial' },
  { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title: 'Accessible', desc: 'Accessible from anywhere in Kenya' },
]

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Welcome banner — uses dashboard-header-bg.png */}
      <div style={{
        borderRadius: '16px', marginBottom: '24px',
        position: 'relative', overflow: 'hidden', minHeight: '130px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '28px 28px',
      }}>
        {/* Background image */}
        <img src="/dashboard-header-bg.png" alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center' }} />
        {/* Dark overlay so text reads */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.92) 40%, rgba(10,10,10,0.5) 80%, rgba(10,10,10,0.2) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: "'Playfair Display',serif", color: 'white',
            fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, marginBottom: '4px',
          }}>
            karibu sanaa👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
            You are not alone. We are here to help you seek justice and protect your rights.
          </p>
        </div>

        {/* SOS banner */}
        <div style={{
          position: 'relative', zIndex: 1,
          background: 'linear-gradient(135deg,#1a0000,#2d0000)',
          border: '1px solid rgba(200,16,46,0.35)',
          borderRadius: '12px', padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: '14px',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '13px', marginBottom: '2px' }}>Need Urgent Help?</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Press for Emergency</div>
          </div>
          <button style={{
            background: '#C8102E', color: 'white', border: 'none',
            borderRadius: '8px', padding: '10px 18px',
            fontWeight: 800, fontSize: '15px', cursor: 'pointer',
            letterSpacing: '0.05em',
            animation: 'sosPulse 1.5s ease-in-out infinite',
          }}>
            SOS
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '16px', marginBottom: '24px' }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            background: 'white', borderRadius: '12px', padding: '18px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            display: 'flex', gap: '12px',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px', fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0A0A0A', lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#374151', fontWeight: 600 }}>{s.sub}</div>
              <div style={{ fontSize: '10px', color: '#9CA3AF' }}>{s.sub2}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '20px', marginBottom: '20px' }}>

        {/* Report card — uses report-card-bg.png (lady justice + Kenya flag) */}
        <div style={{
          borderRadius: '16px', overflow: 'hidden', position: 'relative', minHeight: '220px',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <img src="/report-card-bg.png" alt="Report"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.92) 45%, rgba(10,10,10,0.3) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1, padding: '24px' }}>
            <h2 style={{
              fontFamily: "'Playfair Display',serif", color: 'white',
              fontWeight: 800, fontSize: '22px', marginBottom: '8px',
            }}>
              Report an Incident
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', marginBottom: '18px', lineHeight: 1.5, maxWidth: '260px' }}>
              Share what happened. Your report is confidential and your data is protected.
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link href="/dashboard/report" style={{
                background: '#C8102E', color: 'white', textDecoration: 'none',
                padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                Report Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <button style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)',
                fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                How it works
              </button>
            </div>
          </div>
        </div>

        {/* Journey to justice */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>Your Journey to Justice</h3>
          <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '20px' }}>Follow these simple steps</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {JOURNEY.map(step => (
              <div key={step.n} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: step.color, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '13px', flexShrink: 0,
                }}>
                  {step.n}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: '#0A0A0A' }}>{step.label}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px' }}>

        {/* Your rights */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '18px' }}>Your Rights, Our Priority</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {RIGHTS_ITEMS.map(r => (
              <div key={r.title} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {r.icon}
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#0A0A0A' }}>{r.title}</div>
                <div style={{ fontSize: '11px', color: '#9CA3AF', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Know your rights — uses dashboard-bg.png (constitution image) */}
        <div style={{
          borderRadius: '16px', overflow: 'hidden',
          position: 'relative', minHeight: '200px',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <img src="/constitution-kenya.jpg" alt="Know Your Rights"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,60,0,0.92) 40%, rgba(0,60,0,0.3) 100%)' }} />
          <div style={{ position: 'relative', zIndex: 1, padding: '24px' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '18px', marginBottom: '6px' }}>Know Your Rights</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '14px', lineHeight: 1.5 }}>
              Learn about your rights and the laws that protect you as a Kenyan citizen.
            </p>
            <Link href="/dashboard/rights" style={{
              background: 'white', color: '#006600', textDecoration: 'none',
              padding: '9px 18px', borderRadius: '7px', fontWeight: 700, fontSize: '12px',
              display: 'inline-block',
            }}>
              Explore Rights
            </Link>
          </div>
        </div>

        {/* Legal support */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '16px' }}>Need Legal Support?</h3>
            <Link href="/dashboard/legal-support" style={{ color: '#C8102E', fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}>
              View All Lawyers →
            </Link>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '14px', lineHeight: 1.5 }}>
            Connect with qualified lawyers who can help you. Lawyers appear once they register.
          </p>
          <Link href="/dashboard/legal-support" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            background: '#F8F9FA', border: '1.5px dashed #E5E7EB',
            borderRadius: '10px', padding: '14px',
            color: '#9CA3AF', textDecoration: 'none', fontSize: '13px',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Browse Available Lawyers
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes sosPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(200,16,46,0.7); }
          70% { box-shadow: 0 0 0 10px rgba(200,16,46,0); }
        }
      `}</style>
    </div>
  )
}
