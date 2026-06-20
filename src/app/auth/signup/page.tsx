'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import BrandLogo from '@/components/ui/BrandLogo'

const COUNTIES = ['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Machakos','Nyeri','Meru','Embu','Garissa','Kakamega','Kisii','Kitale','Malindi','Kiambu','Murang\'a','Nyandarua','Laikipia','Samburu','Trans Nzoia','Uasin Gishu','Elgeyo-Marakwet','Nandi','Baringo','Kericho','Bomet','Siaya','Kisumu','Homa Bay','Migori','Nyamira','Narok','Kajiado','Makueni','Kitui','Machakos','Tharaka-Nithi','Isiolo','Marsabit','Moyale','Wajir','Mandera','Other']

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', county:'', password:'', confirmPassword:'', agreeTerms:false })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true)
    setTimeout(() => { window.location.href = '/dashboard' }, 1200)
  }

  const EyeIcon = ({ open }: { open: boolean }) => open
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

  const InputIcon = ({ children }: { children: React.ReactNode }) => (
    <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', display: 'flex' }}>
      {children}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', overflow: 'hidden' }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex" style={{
        width: '42%', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg,#0a0a0a 0%,#001a00 60%,#0a0a0a 100%)',
      }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '180px', overflow: 'hidden', pointerEvents: 'none' }}>
          <svg viewBox="0 0 500 180" fill="none" width="100%" height="180">
            <defs><clipPath id="lc2"><ellipse cx="60" cy="180" rx="480" ry="165"/></clipPath></defs>
            <g clipPath="url(#lc2)" transform="rotate(-14,250,90)">
              <rect x="-30" y="30" width="600" height="28" fill="#0A0A0A"/>
              <rect x="-30" y="56" width="600" height="6" fill="white"/>
              <rect x="-30" y="60" width="600" height="54" fill="#C8102E"/>
              <rect x="-30" y="112" width="600" height="6" fill="white"/>
              <rect x="-30" y="116" width="600" height="28" fill="#006600"/>
            </g>
          </svg>
        </div>
        <div style={{ position: 'absolute', top: '25%', right: '-60px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,102,0,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <BrandLogo variant="dark" size="md" showTagline={true} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '30px', color: 'white', marginBottom: '16px', lineHeight: 1.2 }}>
            Be the change<br />
            <span style={{ color: '#4ade80' }}>Kenya needs.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.7, maxWidth: '340px' }}>
            Join a growing community of Kenyans standing up for their rights and holding power to account.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '28px' }}>
            {[
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: 'Free to use for all citizens' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/><line x1="7" y1="3" x2="7" y2="21"/><line x1="17" y1="3" x2="17" y2="21"/></svg>, text: 'Access to verified legal professionals' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, text: 'Community-powered accountability' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.icon}
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>© 2024 Mwanainchi Report · Nairobi, Kenya</div>
      </div>

      {/* Right — form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'white', borderRadius: '24px 0 0 24px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div className="lg:hidden" style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <BrandLogo variant="light" size="md" showTagline={true} />
          </div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '24px' }}>
            {[1,2].map(s => (
              <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: s <= step ? '#C8102E' : '#E5E7EB', transition: 'background 0.3s' }} />
            ))}
          </div>

          <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: '24px', marginBottom: '4px', color: '#0A0A0A' }}>
            {step === 1 ? 'Create your account' : 'Secure your account'}
          </h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>
            {step === 1 ? 'Your identity is protected and secured.' : 'Choose a strong password for your account.'}
          </p>

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  {[['firstName','First Name','John',<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>],
                    ['lastName','Last Name','Kamau',<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>]
                  ].map(([key, label, ph, icon]) => (
                    <div key={key as string}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>{label as string} *</label>
                      <div style={{ position: 'relative' }}>
                        <InputIcon>{icon}</InputIcon>
                        <input type="text" required placeholder={ph as string}
                          value={(form as any)[key as string]} onChange={e => set(key as string, e.target.value)}
                          style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Email Address *</label>
                  <div style={{ position: 'relative' }}>
                    <InputIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></InputIcon>
                    <input type="email" required placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Phone Number</label>
                    <div style={{ position: 'relative' }}>
                      <InputIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.08 6.08l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.72 16z"/></svg></InputIcon>
                      <input type="tel" placeholder="+254 7XX XXX XXX" value={form.phone} onChange={e => set('phone', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>County</label>
                    <div style={{ position: 'relative' }}>
                      <InputIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/></svg></InputIcon>
                      <select value={form.county} onChange={e => set('county', e.target.value)}
                        style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', background: 'white', appearance: 'none' }}>
                        <option value="">Select county...</option>
                        {COUNTIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Create Password *</label>
                  <div style={{ position: 'relative' }}>
                    <InputIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></InputIcon>
                    <input type={showPass ? 'text' : 'password'} required placeholder="Min 8 characters"
                      value={form.password} onChange={e => set('password', e.target.value)}
                      style={{ width: '100%', padding: '9px 40px 9px 36px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                      <EyeIcon open={showPass} />
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <InputIcon><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></InputIcon>
                    <input type={showPass ? 'text' : 'password'} required placeholder="Repeat your password"
                      value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                </div>

                <div style={{ background: '#F0FDF4', border: '1px solid rgba(0,102,0,0.2)', borderRadius: '8px', padding: '12px', marginBottom: '14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006600" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: '1px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span style={{ fontSize: '11.5px', color: '#374151', lineHeight: 1.5 }}>
                    <strong>Your data is protected.</strong> End-to-end encryption. We never sell your information. You can report anonymously at any time.
                  </span>
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px', cursor: 'pointer' }}>
                  <input type="checkbox" required checked={form.agreeTerms} onChange={e => set('agreeTerms', e.target.checked)}
                    style={{ marginTop: '3px', accentColor: '#C8102E', width: '14px', height: '14px', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>
                    I agree to the <a href="#" style={{ color: '#C8102E' }}>Terms of Service</a> and <a href="#" style={{ color: '#C8102E' }}>Privacy Policy</a>
                  </span>
                </label>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)} style={{
                  background: '#F3F4F6', color: '#374151', border: 'none',
                  borderRadius: '8px', padding: '12px 18px', fontWeight: 600,
                  fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} style={{
                flex: 1, background: loading ? '#E5E7EB' : '#C8102E',
                color: loading ? '#9CA3AF' : 'white', border: 'none',
                borderRadius: '8px', padding: '12px', fontWeight: 700,
                fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.03em', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                {loading
                  ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }} strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Creating...</>
                  : step === 1 ? 'CONTINUE →' : 'CREATE ACCOUNT'
                }
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginTop: '18px' }}>
              Already have an account?{' '}
              <Link href="/auth/login" style={{ color: '#C8102E', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, select:focus { border-color: #C8102E !important; box-shadow: 0 0 0 3px rgba(200,16,46,0.1); }
      `}</style>
    </div>
  )
}
