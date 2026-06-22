'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import BrandLogo from '@/components/ui/BrandLogo'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex"
        style={{
          width: '45%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          background:
            'linear-gradient(160deg,#0a0a0a 0%,#1a0000 60%,#0a0a0a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Kenya flag ribbons */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '180px',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <svg viewBox="0 0 500 180" fill="none" width="100%" height="180">
            <defs>
              <clipPath id="lc">
                <ellipse cx="60" cy="180" rx="480" ry="165" />
              </clipPath>
            </defs>
            <g clipPath="url(#lc)" transform="rotate(-14,250,90)">
              <rect x="-30" y="30" width="600" height="28" fill="#0A0A0A" />
              <rect x="-30" y="56" width="600" height="6" fill="white" />
              <rect x="-30" y="60" width="600" height="54" fill="#C8102E" />
              <rect x="-30" y="112" width="600" height="6" fill="white" />
              <rect x="-30" y="116" width="600" height="28" fill="#006600" />
            </g>
          </svg>
        </div>

        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle,rgba(200,16,46,0.1) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <BrandLogo variant="dark" size="md" showTagline={true} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontWeight: 800,
              fontSize: '32px',
              color: 'white',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            Justice starts with
            <br />
            <span style={{ color: '#C8102E' }}>your voice.</span>
          </h2>

          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '14px',
              lineHeight: 1.7,
              maxWidth: '360px',
            }}
          >
            Every report matters. Every piece of evidence counts. Every Kenyan
            deserves justice.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '32px',
            }}
          >
            {[
              {
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                text: 'End-to-end encrypted reporting',
              },
              {
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                text: 'Anonymous reporting available',
              },
              {
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ),
                text: 'Verified legal professionals',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                {item.icon}
                <span
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '13px',
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>
          © 2024 Mwanainchi Report · Nairobi, Kenya
        </div>
      </div>

      {/* Right panel — form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'white',
          borderRadius: '24px 0 0 24px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div
            className="lg:hidden"
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '28px',
            }}
          >
            <BrandLogo variant="light" size="md" showTagline={true} />
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontWeight: 800,
              fontSize: '26px',
              marginBottom: '6px',
              color: '#0A0A0A',
            }}
          >
            Welcome back
          </h1>

          <p
            style={{
              color: '#6B7280',
              fontSize: '13px',
              marginBottom: '28px',
            }}
          >
            Sign in to your secure Mwanainchi Report account
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Email Address
              </label>

              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>

                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 40px',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '8px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Password
              </label>

              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>

                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 40px',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    display: 'flex',
                  }}
                >
                  {showPass ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#B91C1C',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  marginTop: '14px',
                  marginBottom: '14px',
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            )}

            <div style={{ textAlign: 'right', marginBottom: '22px' }}>
              <a
                href="#"
                style={{
                  color: '#C8102E',
                  fontSize: '12px',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#E5E7EB' : '#C8102E',
                color: loading ? '#9CA3AF' : 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '13px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.03em',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ animation: 'spin 1s linear infinite' }}
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Signing in...
                </>
              ) : (
                'SIGN IN'
              )}
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '20px 0',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
              <span style={{ color: '#9CA3AF', fontSize: '12px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            </div>

            <Link
              href="/dashboard/report"
              style={{
                background: '#FEF2F2',
                border: '1px solid rgba(200,16,46,0.18)',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '22px',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C8102E"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <line x1="18" y1="8" x2="23" y2="13" />
                <line x1="23" y1="8" x2="18" y2="13" />
              </svg>

              <div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#374151',
                  }}
                >
                  Report Anonymously
                </div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>
                  No account needed — your identity is protected
                </div>
              </div>
            </Link>

            <p
              style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#6B7280',
              }}
            >
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                style={{
                  color: '#C8102E',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        input:focus {
          border-color: #C8102E !important;
          box-shadow: 0 0 0 3px rgba(200,16,46,0.1);
        }
      `}</style>
    </div>
  )
}