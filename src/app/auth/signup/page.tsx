'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BrandLogo from '@/components/ui/BrandLogo'
import { supabase } from '@/lib/supabase/client'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  MailCheck,
} from 'lucide-react'

const COUNTIES = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Thika',
  'Machakos',
  'Nyeri',
  'Meru',
  'Embu',
  'Garissa',
  'Kakamega',
  'Kisii',
  'Kitale',
  'Malindi',
  'Kiambu',
  "Murang'a",
  'Other',
]

export default function SignupPage() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [signupComplete, setSignupComplete] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    county: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const set = (key: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (step === 1) {
      if (!form.firstName.trim() || !form.lastName.trim()) {
        setError('Please enter your first name and last name.')
        return
      }

      if (!form.email.trim()) {
        setError('Please enter your email address.')
        return
      }

      setStep(2)
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (!form.agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.')
      return
    }

    setLoading(true)

    const email = form.email.trim().toLowerCase()

    const { data: signUpData, error: authError } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: {
        data: {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone: form.phone.trim(),
          county: form.county,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (!signUpData.user) {
      setError('Account creation did not complete. Please try again.')
      setLoading(false)
      return
    }

    /*
      This creates the profile if it does not exist yet,
      or updates it if it already exists.
    */
    const { error: profileError } = await supabase.from('profiles').upsert(
      {
        id: signUpData.user.id,
        email,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        phone: form.phone.trim() || null,
        county: form.county || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'id',
      }
    )

    if (profileError) {
      console.error('Profile creation error:', profileError)

      /*
        The account may still have been created successfully in Supabase Auth.
        We show the exact database problem instead of pretending signup failed.
      */
      setError(
        `Your account was created, but your profile could not be saved: ${profileError.message}`
      )
      setLoading(false)
      return
    }

    /*
      If email confirmation is enabled in Supabase:
      signUpData.session will be null.
      The user must confirm their email before login.
    */
    if (!signUpData.session) {
      setSignupComplete(true)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  if (signupComplete) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            background: 'white',
            borderRadius: '18px',
            padding: '40px 32px',
            textAlign: 'center',
            boxShadow: '0 18px 60px rgba(0,0,0,0.25)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 18px',
              borderRadius: '50%',
              background: '#F0FDF4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MailCheck size={30} color="#006600" />
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '26px',
              fontWeight: 800,
              color: '#0A0A0A',
              marginBottom: '10px',
            }}
          >
            Check your email
          </h1>

          <p
            style={{
              color: '#6B7280',
              fontSize: '14px',
              lineHeight: 1.7,
              marginBottom: '24px',
            }}
          >
            We sent a confirmation link to{' '}
            <strong style={{ color: '#374151' }}>{form.email}</strong>.
            Confirm your email, then return here to sign in.
          </p>

          <Link
            href="/auth/login"
            style={{
              display: 'block',
              background: '#C8102E',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              padding: '13px',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            GO TO SIGN IN
          </Link>
        </div>
      </div>
    )
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
      {/* Left panel */}
      <div
        className="hidden lg:flex"
        style={{
          width: '42%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(160deg,#0a0a0a 0%,#001a00 60%,#0a0a0a 100%)',
        }}
      >
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
              <clipPath id="signup-flag-clip">
                <ellipse cx="60" cy="180" rx="480" ry="165" />
              </clipPath>
            </defs>

            <g
              clipPath="url(#signup-flag-clip)"
              transform="rotate(-14,250,90)"
            >
              <rect x="-30" y="30" width="600" height="28" fill="#0A0A0A" />
              <rect x="-30" y="56" width="600" height="6" fill="white" />
              <rect x="-30" y="60" width="600" height="54" fill="#C8102E" />
              <rect x="-30" y="112" width="600" height="6" fill="white" />
              <rect x="-30" y="116" width="600" height="28" fill="#006600" />
            </g>
          </svg>
        </div>

        <BrandLogo variant="dark" size="md" showTagline={true} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "'Playfair Display',serif",
              fontWeight: 800,
              fontSize: '30px',
              color: 'white',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            Be the change
            <br />
            <span style={{ color: '#4ade80' }}>Kenya needs.</span>
          </h2>

          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '14px',
              lineHeight: 1.7,
              maxWidth: '340px',
            }}
          >
            Join a growing community of Kenyans standing up for their rights.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '28px',
            }}
          >
            {[
              {
                icon: <ShieldCheck size={16} color="#4ade80" />,
                text: 'Free to use for all citizens',
              },
              {
                icon: <CheckCircle2 size={16} color="#4ade80" />,
                text: 'Access to verified legal professionals',
              },
              {
                icon: <ShieldCheck size={16} color="#4ade80" />,
                text: 'Community-powered accountability',
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
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

      {/* Right form */}
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
        <div style={{ width: '100%', maxWidth: '420px' }}>
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

          <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
            {[1, 2].map((number) => (
              <div
                key={number}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: number <= step ? '#C8102E' : '#E5E7EB',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
              fontWeight: 800,
              fontSize: '24px',
              marginBottom: '4px',
              color: '#0A0A0A',
            }}
          >
            {step === 1 ? 'Create your account' : 'Secure your account'}
          </h1>

          <p
            style={{
              color: '#6B7280',
              fontSize: '13px',
              marginBottom: '24px',
            }}
          >
            {step === 1
              ? 'Your identity is protected and secured.'
              : 'Choose a strong password.'}
          </p>

          {error && (
            <div
              style={{
                background: '#FEF2F2',
                border: '1px solid rgba(200,16,46,0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                fontSize: '13px',
                color: '#C8102E',
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '14px',
                  }}
                >
                  {[
                    ['firstName', 'First Name', 'John'],
                    ['lastName', 'Last Name', 'Kamau'],
                  ].map(([key, label, placeholder]) => (
                    <div key={key}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '5px',
                        }}
                      >
                        {label} *
                      </label>

                      <div style={{ position: 'relative' }}>
                        <User
                          size={14}
                          color="#9CA3AF"
                          style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                          }}
                        />

                        <input
                          type="text"
                          required
                          placeholder={placeholder}
                          value={form[key as 'firstName' | 'lastName']}
                          onChange={(e) =>
                            set(
                              key as 'firstName' | 'lastName',
                              e.target.value
                            )
                          }
                          style={{
                            width: '100%',
                            padding: '9px 12px 9px 32px',
                            border: '1.5px solid #E5E7EB',
                            borderRadius: '8px',
                            fontSize: '13px',
                            outline: 'none',
                            fontFamily: 'inherit',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '5px',
                    }}
                  >
                    Email Address *
                  </label>

                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={14}
                      color="#9CA3AF"
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />

                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 32px',
                        border: '1.5px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '5px',
                      }}
                    >
                      Phone
                    </label>

                    <div style={{ position: 'relative' }}>
                      <Phone
                        size={14}
                        color="#9CA3AF"
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      />

                      <input
                        type="tel"
                        placeholder="+254 7XX XXX XXX"
                        value={form.phone}
                        onChange={(e) => set('phone', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 32px',
                          border: '1.5px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '13px',
                          outline: 'none',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '5px',
                      }}
                    >
                      County
                    </label>

                    <div style={{ position: 'relative' }}>
                      <MapPin
                        size={14}
                        color="#9CA3AF"
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 1,
                        }}
                      />

                      <select
                        value={form.county}
                        onChange={(e) => set('county', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 32px',
                          border: '1.5px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '13px',
                          outline: 'none',
                          fontFamily: 'inherit',
                          background: 'white',
                          appearance: 'none',
                        }}
                      >
                        <option value="">Select county...</option>
                        {COUNTIES.map((county) => (
                          <option key={county} value={county}>
                            {county}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '14px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '5px',
                    }}
                  >
                    Create Password *
                  </label>

                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={14}
                      color="#9CA3AF"
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />

                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={(e) => set('password', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 40px 9px 32px',
                        border: '1.5px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9CA3AF',
                        display: 'flex',
                      }}
                    >
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '5px',
                    }}
                  >
                    Confirm Password *
                  </label>

                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={14}
                      color="#9CA3AF"
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    />

                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={(e) => set('confirmPassword', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 32px',
                        border: '1.5px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    background: '#F0FDF4',
                    border: '1px solid rgba(0,102,0,0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '14px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}
                >
                  <ShieldCheck
                    size={15}
                    color="#006600"
                    style={{ flexShrink: 0, marginTop: '1px' }}
                  />

                  <span
                    style={{
                      fontSize: '11.5px',
                      color: '#374151',
                      lineHeight: 1.5,
                    }}
                  >
                    <strong>Your data is protected.</strong> Your account is
                    secured by Supabase authentication.
                  </span>
                </div>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '20px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    required
                    checked={form.agreeTerms}
                    onChange={(e) => set('agreeTerms', e.target.checked)}
                    style={{
                      marginTop: '3px',
                      accentColor: '#C8102E',
                      width: '14px',
                      height: '14px',
                      flexShrink: 0,
                    }}
                  />

                  <span
                    style={{
                      fontSize: '12px',
                      color: '#6B7280',
                      lineHeight: 1.5,
                    }}
                  >
                    I agree to the{' '}
                    <a href="#" style={{ color: '#C8102E' }}>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" style={{ color: '#C8102E' }}>
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setStep(1)
                  }}
                  style={{
                    background: '#F3F4F6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 18px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <ChevronLeft size={14} /> Back
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  background: loading ? '#E5E7EB' : '#C8102E',
                  color: loading ? '#9CA3AF' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.03em',
                  fontFamily: 'inherit',
                }}
              >
                {loading
                  ? 'Creating Account...'
                  : step === 1
                    ? 'CONTINUE →'
                    : 'CREATE ACCOUNT'}
              </button>
            </div>

            <p
              style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#6B7280',
                marginTop: '18px',
              }}
            >
              Already have an account?{' '}
              <Link
                href="/auth/login"
                style={{
                  color: '#C8102E',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        input:focus,
        select:focus {
          border-color: #C8102E !important;
          box-shadow: 0 0 0 3px rgba(200,16,46,0.1);
        }
      `}</style>
    </div>
  )
}