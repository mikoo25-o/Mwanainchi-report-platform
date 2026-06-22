'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import {
  AlertTriangle,
  ChevronDown,
  FileText,
  Gavel,
  LogOut,
  MapPin,
  Phone,
  ShieldCheck,
  Siren,
  X,
} from 'lucide-react'

const STATS = [
  {
    icon: <FileText size={22} color="#006600" />,
    bg: '#F0FDF4',
    label: 'My Cases',
    value: '0',
    sub: 'No cases yet',
    sub2: 'Start by reporting an incident.',
  },
  {
    icon: <ShieldCheck size={22} color="#C8102E" />,
    bg: '#FEF2F2',
    label: 'Evidence Uploaded',
    value: '0',
    sub: 'Your evidence is safe',
    sub2: 'Secure. Private. Tamper-proof.',
  },
  {
    icon: <Gavel size={22} color="#D97706" />,
    bg: '#FFFBEB',
    label: 'Messages',
    value: '0',
    sub: 'No new messages',
    sub2: 'From legal team or support.',
  },
  {
    icon: <ShieldCheck size={22} color="#059669" />,
    bg: '#F0FDF4',
    label: 'Alerts',
    value: '0',
    sub: 'No new alerts',
    sub2: "You're all caught up.",
  },
]

const JOURNEY = [
  { n: 1, label: 'Report', desc: 'Submit details of the incident', color: '#006600' },
  { n: 2, label: 'Evidence', desc: 'Upload any supporting evidence', color: '#C8102E' },
  { n: 3, label: 'Review', desc: 'Our team reviews your report', color: '#D97706' },
  { n: 4, label: 'Support', desc: 'Connect with lawyers and get help', color: '#006600' },
]

const RIGHTS_ITEMS = [
  {
    icon: <ShieldCheck size={22} color="#374151" />,
    title: 'Confidential',
    desc: 'Your identity is always protected',
  },
  {
    icon: <ShieldCheck size={22} color="#374151" />,
    title: 'Secure',
    desc: 'Your data is encrypted and safe',
  },
  {
    icon: <Gavel size={22} color="#374151" />,
    title: 'Independent',
    desc: 'We are independent and impartial',
  },
  {
    icon: <MapPin size={22} color="#374151" />,
    title: 'Accessible',
    desc: 'Accessible from anywhere in Kenya',
  },
]

export default function DashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [showSOS, setShowSOS] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/auth/login')
        return
      }

      const metadata = session.user.user_metadata

      const firstName =
        metadata?.first_name ||
        metadata?.firstName ||
        session.user.email?.split('@')[0] ||
        'Mwananchi'

      setUserName(firstName)
      setLoading(false)
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/auth/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    setLoggingOut(true)

    await supabase.auth.signOut()

    router.replace('/auth/login')
    router.refresh()
  }

  const handleSOS = () => {
    setShowSOS(true)
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '34px',
            height: '34px',
            border: '4px solid #F3F4F6',
            borderTopColor: '#C8102E',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: '13px', color: '#6B7280' }}>
          Securing your dashboard...
        </span>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      {/* SOS emergency modal */}
      {showSOS && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '430px',
              background: 'white',
              borderRadius: '18px',
              padding: '28px',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <button
              onClick={() => setShowSOS(false)}
              aria-label="Close emergency options"
              style={{
                position: 'absolute',
                top: '14px',
                right: '14px',
                background: '#F3F4F6',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={17} color="#374151" />
            </button>

            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
              }}
            >
              <Siren size={27} color="#C8102E" />
            </div>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: '23px',
                color: '#0A0A0A',
                marginBottom: '8px',
              }}
            >
              Emergency Help
            </h2>

            <p
              style={{
                color: '#6B7280',
                fontSize: '13px',
                lineHeight: 1.6,
                marginBottom: '20px',
              }}
            >
              If you are in immediate danger, call emergency services now.
            </p>

            <a
              href="tel:999"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '9px',
                background: '#C8102E',
                color: 'white',
                textDecoration: 'none',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '15px',
                marginBottom: '10px',
              }}
            >
              <Phone size={18} />
              Call Emergency 999
            </a>

            <a
              href="tel:112"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '9px',
                background: '#F3F4F6',
                color: '#374151',
                textDecoration: 'none',
                padding: '13px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                marginBottom: '16px',
              }}
            >
              <Phone size={17} />
              Alternative Emergency 112
            </a>

            <Link
              href="/dashboard/report"
              onClick={() => setShowSOS(false)}
              style={{
                display: 'block',
                textAlign: 'center',
                color: '#C8102E',
                fontWeight: 700,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              I am safe — report an incident instead
            </Link>
          </div>
        </div>
      )}

      {/* Top actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '12px',
        }}
      >
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            background: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            color: '#374151',
            fontSize: '12px',
            fontWeight: 700,
            cursor: loggingOut ? 'not-allowed' : 'pointer',
          }}
        >
          <LogOut size={15} />
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>

      {/* Welcome banner */}
      <div
        style={{
          borderRadius: '16px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '130px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '28px',
        }}
      >
        <img
          src="/dashboard-header-bg.png"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'right center',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(10,10,10,0.92) 40%, rgba(10,10,10,0.5) 80%, rgba(10,10,10,0.2) 100%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              color: 'white',
              fontSize: 'clamp(20px,3vw,28px)',
              fontWeight: 800,
              marginBottom: '4px',
            }}
          >
            Karibu sana, {userName}!
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>
            You are not alone. We are here to help you seek justice and protect
            your rights.
          </p>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            background: 'linear-gradient(135deg,#1a0000,#2d0000)',
            border: '1px solid rgba(200,16,46,0.35)',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                color: 'white',
                fontWeight: 700,
                fontSize: '13px',
                marginBottom: '2px',
              }}
            >
              Need Urgent Help?
            </div>

            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>
              Press for Emergency
            </div>
          </div>

          <button
            onClick={handleSOS}
            style={{
              background: '#C8102E',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              animation: 'sosPulse 1.5s ease-in-out infinite',
            }}
          >
            SOS
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '18px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              display: 'flex',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: s.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>

            <div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#9CA3AF',
                  marginBottom: '2px',
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>

              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#0A0A0A',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}
              >
                {s.value}
              </div>

              <div style={{ fontSize: '11px', color: '#374151', fontWeight: 600 }}>
                {s.sub}
              </div>

              <div style={{ fontSize: '10px', color: '#9CA3AF' }}>
                {s.sub2}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <img
            src="/report-card-bg.png"
            alt="Report"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'right center',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(10,10,10,0.92) 45%, rgba(10,10,10,0.3) 100%)',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, padding: '24px' }}>
            <h2
              style={{
                fontFamily: "'Playfair Display',serif",
                color: 'white',
                fontWeight: 800,
                fontSize: '22px',
                marginBottom: '8px',
              }}
            >
              Report an Incident
            </h2>

            <p
              style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '13px',
                marginBottom: '18px',
                lineHeight: 1.5,
                maxWidth: '260px',
              }}
            >
              Share what happened. Your report is confidential and your data is
              protected.
            </p>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link
                href="/dashboard/report"
                style={{
                  background: '#C8102E',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Report Now →
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
            Your Journey to Justice
          </h3>

          <p style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '20px' }}>
            Follow these simple steps
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {JOURNEY.map((step) => (
              <div
                key={step.n}
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: step.color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '13px',
                    flexShrink: 0,
                  }}
                >
                  {step.n}
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: '13px',
                      color: '#0A0A0A',
                    }}
                  >
                    {step.label}
                  </div>

                  <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
          gap: '20px',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '18px' }}>
            Your Rights, Our Priority
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
            }}
          >
            {RIGHTS_ITEMS.map((r) => (
              <div
                key={r.title}
                style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
              >
                {r.icon}

                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '12px',
                    color: '#0A0A0A',
                  }}
                >
                  {r.title}
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: '#9CA3AF',
                    lineHeight: 1.4,
                  }}
                >
                  {r.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <img
            src="/constitution-kenya.jpg"
            alt="Know Your Rights"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,60,0,0.92) 40%, rgba(0,60,0,0.3) 100%)',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, padding: '24px' }}>
            <h3
              style={{
                color: 'white',
                fontWeight: 700,
                fontSize: '18px',
                marginBottom: '6px',
              }}
            >
              Know Your Rights
            </h3>

            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '12px',
                marginBottom: '14px',
                lineHeight: 1.5,
              }}
            >
              Learn about your rights and the laws that protect you as a Kenyan
              citizen.
            </p>

            <Link
              href="/dashboard/rights"
              style={{
                background: 'white',
                color: '#006600',
                textDecoration: 'none',
                padding: '9px 18px',
                borderRadius: '7px',
                fontWeight: 700,
                fontSize: '12px',
                display: 'inline-block',
              }}
            >
              Explore Rights
            </Link>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: '16px' }}>
              Need Legal Support?
            </h3>

            <Link
              href="/dashboard/legal-support"
              style={{
                color: '#C8102E',
                fontSize: '12px',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              View All Lawyers →
            </Link>
          </div>

          <p
            style={{
              color: '#9CA3AF',
              fontSize: '12px',
              marginBottom: '14px',
              lineHeight: 1.5,
            }}
          >
            Connect with qualified lawyers who can help you. Lawyers appear once
            they register.
          </p>

          <Link
            href="/dashboard/legal-support"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: '#F8F9FA',
              border: '1.5px dashed #E5E7EB',
              borderRadius: '10px',
              padding: '14px',
              color: '#9CA3AF',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
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