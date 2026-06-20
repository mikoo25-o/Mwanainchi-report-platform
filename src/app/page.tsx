'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import BrandLogo from '@/components/ui/BrandLogo'

/* ── Typewriter hook ── */
function useTypewriter(phrases: string[], typeSpeed=75, deleteSpeed=38, pause=2300) {
  const [text, setText] = useState('')
  const [pi, setPi] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [waiting, setWaiting] = useState(false)

  useEffect(() => {
    const word = phrases[pi]
    if (waiting) {
      const t = setTimeout(() => { setWaiting(false); setDeleting(true) }, pause)
      return () => clearTimeout(t)
    }
    if (deleting) {
      if (text.length === 0) { setDeleting(false); setPi(i => (i+1)%phrases.length); return }
      const t = setTimeout(() => setText(s => s.slice(0,-1)), deleteSpeed)
      return () => clearTimeout(t)
    }
    if (text.length < word.length) {
      const t = setTimeout(() => setText(word.slice(0, text.length+1)), typeSpeed)
      return () => clearTimeout(t)
    }
    setWaiting(true)
  }, [text, deleting, waiting, pi, phrases, typeSpeed, deleteSpeed, pause])

  return text
}

const PHRASES = ['MWANAINCHI', 'YOUR VOICE.', 'YOUR RIGHTS.', 'YOUR JUSTICE.', 'MWANAINCHI']

export default function LandingPage() {
  const typed = useTypewriter(PHRASES)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* render typed text — colour AI red when showing MWANAINCHI */
  const renderTyped = () => {
    const up = typed.toUpperCase()
    const isMwana = 'MWANAINCHI'.startsWith(up) && up.length <= 10
    if (!isMwana) return <span>{typed}</span>
    const pre = typed.slice(0, 4)   // MWAN
    const ai  = typed.slice(4, 6)   // AI
    const suf = typed.slice(6)      // NCHI
    return <><span>{pre}</span>{ai && <span style={{color:'#C8102E'}}>{ai}</span>}<span>{suf}</span></>
  }

  /* second line only visible when MWANAINCHI is fully typed */
  const showReport = typed.toUpperCase() === 'MWANAINCHI'

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif", background:'#0a0a0a', minHeight:'100vh', overflowX:'hidden'}}>

      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:300,
        height:'72px',
        background: scrolled ? 'rgba(10,10,10,0.98)' : 'rgba(10,10,10,0.92)',
        backdropFilter:'blur(14px)',
        borderBottom:'1px solid rgba(255,255,255,0.07)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 40px',
        transition:'background 0.3s',
      }}>

        {/* ── Logo block ── */}
        <BrandLogo variant="dark" size="sm" showTagline={true} />

        {/* Desktop nav */}
        <div className="hidden md:flex" style={{alignItems:'center', gap:'26px'}}>
          {['Home','Report','About Us','Resources','Legal Help','Contact'].map(item => (
            <a key={item} href="#" style={{
              color: item==='Home' ? 'white' : 'rgba(255,255,255,0.68)',
              textDecoration:'none', fontSize:'13.5px',
              fontWeight: item==='Home' ? 600 : 400,
              display:'flex', alignItems:'center', gap:'3px',
            }}>
              {item}{item==='Report' ? <span style={{fontSize:'9px',opacity:0.6}}>▾</span> : ''}
            </a>
          ))}
          <span style={{color:'rgba(255,255,255,0.45)', fontSize:'12.5px', cursor:'pointer'}}>
            🌐 EN <span style={{fontSize:'9px'}}>▾</span>
          </span>
          <Link href="/auth/login" style={{
            background:'#C8102E', color:'white', textDecoration:'none',
            padding:'10px 22px', borderRadius:'8px',
            fontSize:'13.5px', fontWeight:700, whiteSpace:'nowrap',
          }}>
            Login / Sign Up
          </Link>
        </div>

        {/* Mobile burger */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}
          style={{background:'none', border:'none', color:'white', fontSize:'22px', cursor:'pointer'}}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position:'fixed', top:'72px', left:0, right:0, zIndex:299,
          background:'#0a0a0a', borderBottom:'1px solid rgba(255,255,255,0.08)',
          padding:'16px 24px',
        }}>
          {['Home','Report','About Us','Resources','Legal Help','Contact'].map(item => (
            <a key={item} href="#" onClick={() => setMenuOpen(false)} style={{
              display:'block', color:'rgba(255,255,255,0.8)',
              textDecoration:'none', padding:'12px 0',
              borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:'15px',
            }}>{item}</a>
          ))}
          <Link href="/auth/login" style={{
            display:'block', background:'#C8102E', color:'white',
            textDecoration:'none', padding:'12px 20px', borderRadius:'8px',
            textAlign:'center', fontWeight:700, marginTop:'16px',
          }}>
            Login / Sign Up
          </Link>
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section style={{
        position:'relative', minHeight:'100vh',
        display:'flex', alignItems:'center',
        overflow:'hidden', paddingTop:'72px',
      }}>

        {/* ── Hero composite image (right 65%) ── */}
        <div style={{
          position:'absolute', top:0, right:0, bottom:0,
          width:'65%', zIndex:0,
        }}>
          <img
            src="/hero-composite.png"
            alt="Justice Hero"
            style={{
              width:'100%', height:'100%',
              objectFit:'cover',
              objectPosition:'center top',
              display:'block',
            }}
          />
          {/* Gradient: dark on left to let text read, transparent on right */}
          <div style={{
            position:'absolute', inset:0,
            background:'linear-gradient(to right, #0a0a0a 0%, #0a0a0a 8%, rgba(10,10,10,0.75) 30%, rgba(10,10,10,0.2) 55%, rgba(10,10,10,0) 75%)',
          }} />
        </div>

        {/* Pure black left panel background */}
        <div style={{
          position:'absolute', top:0, left:0, bottom:0, width:'40%',
          background:'#0a0a0a', zIndex:0,
        }} />

        {/* Subtle red glow */}
        <div style={{
          position:'absolute', bottom:'-80px', left:'-80px', zIndex:0,
          width:'440px', height:'440px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(200,16,46,0.1) 0%, transparent 70%)',
          pointerEvents:'none',
        }} />

        {/* ── Left text content ── */}
        <div style={{
          position:'relative', zIndex:2,
          padding:'clamp(32px,5vw,80px) clamp(20px,5vw,80px)',
          maxWidth:'580px', width:'100%',
        }}>

          {/* "WELCOME TO" label */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'18px',
          }}>
            <div style={{height:'1.5px', width:'26px', background:'#C8102E'}} />
            <span style={{
              color:'rgba(255,255,255,0.65)', fontSize:'12px',
              fontWeight:600, letterSpacing:'0.14em',
            }}>
              WELCOME TO
            </span>
          </div>

          {/* Giant morphing heading */}
          <h1 style={{
            fontFamily:"'Playfair Display',Georgia,serif",
            fontWeight:900,
            fontSize:'clamp(54px,7.5vw,92px)',
            lineHeight:1.0, color:'white',
            margin:'0 0 0 0',
            letterSpacing:'-0.01em',
          }}>
            {renderTyped()}
            {showReport && <><br /><span>REPORT</span></>}
            {/* blinking cursor */}
            <span style={{
              display:'inline-block', width:'4px',
              height:'0.75em', background:'#C8102E',
              marginLeft:'5px', verticalAlign:'middle',
              animation:'blink 0.7s step-end infinite',
            }} />
          </h1>

          {/* Subtitle */}
          <p style={{
            color:'rgba(255,255,255,0.68)',
            fontSize:'clamp(14px,1.6vw,16.5px)',
            lineHeight:1.75, marginTop:'18px', marginBottom:'30px',
            maxWidth:'450px',
          }}>
            A secure platform for every Kenyan to report, protect,
            and seek{' '}
            <span style={{color:'#4ade80', fontWeight:600}}>justice</span>
            {' '}with dignity and confidence.
          </p>

          {/* CTA buttons */}
          <div style={{display:'flex', flexWrap:'wrap', gap:'12px', marginBottom:'40px'}}>
            <Link href="/auth/signup" style={{
              background:'#C8102E', color:'white', textDecoration:'none',
              padding:'13px 26px', borderRadius:'8px',
              fontSize:'13px', fontWeight:800, letterSpacing:'0.04em',
              display:'flex', alignItems:'center', gap:'6px',
              boxShadow:'0 4px 20px rgba(200,16,46,0.35)',
            }}>
              REPORT AN INCIDENT →
            </Link>
            <a href="#how-it-works" style={{
              background:'rgba(255,255,255,0.07)', color:'white',
              textDecoration:'none', padding:'13px 26px', borderRadius:'8px',
              fontSize:'13px', fontWeight:700, letterSpacing:'0.04em',
              border:'1.5px solid rgba(255,255,255,0.22)',
              display:'flex', alignItems:'center', gap:'6px',
            }}>
              LEARN MORE →
            </a>
          </div>

          {/* Secure badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:'10px',
            background:'rgba(0,0,0,0.45)',
            border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:'10px', padding:'10px 16px',
          }}>
            <div style={{
              width:'34px', height:'34px', borderRadius:'50%',
              background:'#006600', display:'flex', alignItems:'center',
              justifyContent:'center', fontSize:'16px', flexShrink:0,
            }}></div>
            <div>
              <div style={{color:'white', fontSize:'13px', fontWeight:700, lineHeight:1.3}}>Secure. Private.</div>
              <div style={{color:'rgba(255,255,255,0.45)', fontSize:'11px'}}>Tamper-Proof.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES STRIP ═══ */}
      <section style={{background:'white', padding:'0 40px'}}>
        <div style={{
          maxWidth:'1160px', margin:'0 auto',
          display:'grid',
          gridTemplateColumns:'repeat(5,1fr)',
          background:'white',
          boxShadow:'0 -4px 40px rgba(0,0,0,0.15)',
          borderRadius:'16px 16px 0 0',
          marginTop:'-2px',
          overflow:'hidden',
        }}>
          {[
            { svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
              title:'Secure Reporting', desc:'Report safely and anonymously.' },
            { svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
              title:'Evidence Protection', desc:'Your evidence is encrypted and tamper-proof.' },
            { svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
              title:'Legal Support', desc:'Connect with trusted lawyers and legal aid.' },
            { svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#006600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
              title:'Case Tracking', desc:'Track your case every step of the way.' },
            { svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C8102E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
              title:'Citizen First', desc:'Empowering every Kenyan, everywhere.' },
          ].map((f,i) => (
            <div key={i} style={{
              display:'flex', alignItems:'flex-start', gap:'12px',
              padding:'24px 16px',
              borderRight: i<4 ? '1px solid #F0F0F0' : 'none',
            }}>
              <div style={{flexShrink:0, marginTop:'2px'}}>{f.svg}</div>
              <div>
                <div style={{fontWeight:700, fontSize:'13.5px', color:'#0a0a0a', marginBottom:'4px'}}>{f.title}</div>
                <div style={{fontSize:'11.5px', color:'#6B7280', lineHeight:1.5}}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TAGLINE ═══ */}
      <section style={{
        background:'white', padding:'68px 40px 72px',
        textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        {/* Kenya flag stripe bottom */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:'4px',
          background:'linear-gradient(90deg,#0A0A0A 33.3%,#C8102E 33.3%,#C8102E 66.6%,#006600 66.6%)',
        }} />
        {/* Left ribbon */}
        <div style={{position:'absolute',bottom:0,left:0,width:'310px',height:'155px',overflow:'hidden',pointerEvents:'none'}}>
          <svg viewBox="0 0 310 155" fill="none" width="310" height="155">
            <defs><clipPath id="rl"><ellipse cx="40" cy="155" rx="290" ry="140"/></clipPath></defs>
            <g clipPath="url(#rl)" transform="rotate(-16,155,77)">
              <rect x="-20" y="28" width="380" height="24" fill="#0A0A0A"/>
              <rect x="-20" y="50" width="380" height="5" fill="white"/>
              <rect x="-20" y="53" width="380" height="46" fill="#C8102E"/>
              <rect x="-20" y="97" width="380" height="5" fill="white"/>
              <rect x="-20" y="100" width="380" height="24" fill="#006600"/>
            </g>
          </svg>
        </div>
        {/* Right ribbon */}
        <div style={{position:'absolute',bottom:0,right:0,width:'310px',height:'155px',overflow:'hidden',pointerEvents:'none',transform:'scaleX(-1)'}}>
          <svg viewBox="0 0 310 155" fill="none" width="310" height="155">
            <defs><clipPath id="rr"><ellipse cx="40" cy="155" rx="290" ry="140"/></clipPath></defs>
            <g clipPath="url(#rr)" transform="rotate(-16,155,77)">
              <rect x="-20" y="28" width="380" height="24" fill="#0A0A0A"/>
              <rect x="-20" y="50" width="380" height="5" fill="white"/>
              <rect x="-20" y="53" width="380" height="46" fill="#C8102E"/>
              <rect x="-20" y="97" width="380" height="5" fill="white"/>
              <rect x="-20" y="100" width="380" height="24" fill="#006600"/>
            </g>
          </svg>
        </div>

        <h2 style={{
          fontFamily:"'Playfair Display',Georgia,serif",
          fontWeight:800, fontSize:'clamp(28px,4vw,48px)',
          color:'#0a0a0a', marginBottom:'14px',
        }}>
          Justice. Transparency.{' '}
          <span style={{color:'#006600'}}>Dignity.</span>
        </h2>
        <p style={{
          color:'#6B7280', fontSize:'clamp(14px,1.5vw,16px)',
          maxWidth:'530px', margin:'0 auto 20px', lineHeight:1.75,
        }}>
          Mwanainchi Report bridges the gap between citizens and justice.<br />
          We use technology to ensure your voice is heard and your rights are protected.
        </p>
        <div style={{display:'flex', justifyContent:'center', gap:'12px'}}>
          {['#0A0A0A','#C8102E','#006600'].map((c,i) => (
            <div key={i} style={{width:'40px', height:'4px', borderRadius:'2px', background:c}} />
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" style={{background:'#0a0a0a', padding:'80px 40px'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto'}}>
          <div style={{textAlign:'center', marginBottom:'48px'}}>
            <div style={{
              display:'inline-block',
              background:'rgba(200,16,46,0.12)', border:'1px solid rgba(200,16,46,0.28)',
              borderRadius:'20px', padding:'5px 14px',
              fontSize:'11px', color:'#C8102E', fontWeight:700, letterSpacing:'0.1em', marginBottom:'14px',
            }}>
              YOUR JOURNEY TO JUSTICE
            </div>
            <h2 style={{fontFamily:"'Playfair Display',serif", color:'white', fontSize:'clamp(24px,3.5vw,40px)', fontWeight:800}}>
              How It Works
            </h2>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'20px'}}>
            {[
              { n:'01', title:'Report', desc:'Submit your incident details securely from anywhere in Kenya, in your own language.', color:'#006600',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
              { n:'02', title:'Preserve', desc:'Upload photos, videos, and documents to our tamper-proof encrypted Evidence Vault.', color:'#C8102E',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
              { n:'03', title:'Connect', desc:'Get matched with qualified lawyers and legal aid organizations across all 47 counties.', color:'#006600',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
              { n:'04', title:'Track', desc:'Follow your case in real-time from the moment you report to final resolution.', color:'#006600',
                icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
            ].map(item => (
              <div key={item.n} style={{
                background:'rgba(255,255,255,0.04)',
                border:`1px solid ${item.color}28`,
                borderRadius:'16px', padding:'28px 22px',
                position:'relative', overflow:'hidden',
              }}>
                <div style={{
                  position:'absolute', top:'-10px', right:'-6px',
                  fontFamily:"'Playfair Display',serif", fontWeight:900,
                  fontSize:'78px', color:`${item.color}0e`, lineHeight:1, userSelect:'none',
                }}>
                  {item.n}
                </div>
                <div style={{
                  width:'40px', height:'40px', borderRadius:'10px',
                  background:`${item.color}18`, color:item.color,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  marginBottom:'16px',
                }}>
                  {item.icon}
                </div>
                <h3 style={{fontFamily:"'Playfair Display',serif", color:'white', fontWeight:700, fontSize:'18px', marginBottom:'8px'}}>
                  {item.title}
                </h3>
                <p style={{color:'rgba(255,255,255,0.5)', fontSize:'13px', lineHeight:1.65}}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{
        background:'linear-gradient(135deg,#C8102E 0%,#8B0000 100%)',
        padding:'72px 40px', textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        <div style={{position:'absolute',inset:0, backgroundImage:`radial-gradient(circle at 15% 50%,rgba(255,255,255,0.07) 0%,transparent 55%), radial-gradient(circle at 85% 50%,rgba(0,0,0,0.2) 0%,transparent 55%)`, pointerEvents:'none'}} />
        <div style={{position:'relative', zIndex:1}}>
          <h2 style={{fontFamily:"'Playfair Display',serif", color:'white', fontWeight:900, fontSize:'clamp(26px,4vw,46px)', marginBottom:'14px'}}>
            Ready to Seek Justice?
          </h2>
          <p style={{color:'rgba(255,255,255,0.8)', fontSize:'15px', maxWidth:'460px', margin:'0 auto 32px', lineHeight:1.75}}>
            Join thousands of Kenyans using Mwanainchi Report to access justice, report corruption, and protect their rights.
          </p>
          <div style={{display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap'}}>
            <Link href="/auth/signup" style={{background:'white', color:'#C8102E', textDecoration:'none', padding:'14px 32px', borderRadius:'8px', fontWeight:800, fontSize:'13.5px', letterSpacing:'0.03em'}}>
              CREATE FREE ACCOUNT
            </Link>
            <Link href="/auth/login" style={{background:'transparent', color:'white', textDecoration:'none', padding:'14px 32px', borderRadius:'8px', fontWeight:600, fontSize:'13.5px', border:'1.5px solid rgba(255,255,255,0.45)'}}>
              SIGN IN
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{background:'#050505', padding:'48px 40px 24px', borderTop:'1px solid rgba(255,255,255,0.06)'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'32px', marginBottom:'36px'}}>
          <div>
            <div style={{marginBottom:'14px'}}>
              <BrandLogo variant="dark" size="sm" showTagline={false} />
            </div>
            <p style={{color:'rgba(255,255,255,0.32)', fontSize:'12px', lineHeight:1.7, maxWidth:'210px'}}>
              An AI-powered digital justice infrastructure for every Kenyan citizen.
            </p>
          </div>
          {[
            {h:'PLATFORM', links:['Report Incident','Evidence Vault','Legal Support','Case Tracking']},
            {h:'RESOURCES', links:["Know Your Rights",'Legal Aid','Whistleblower','Oversight Hub']},
            {h:'SUPPORT',   links:['Contact Us','FAQ','Privacy Policy','Terms of Use']},
          ].map(col => (
            <div key={col.h}>
              <div style={{color:'white', fontWeight:700, fontSize:'11px', letterSpacing:'0.1em', marginBottom:'14px'}}>{col.h}</div>
              {col.links.map(l => (
                <a key={l} href="#" style={{display:'block', color:'rgba(255,255,255,0.38)', textDecoration:'none', fontSize:'13px', marginBottom:'8px'}}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:'18px', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'10px'}}>
          <span style={{color:'rgba(255,255,255,0.22)', fontSize:'12px'}}>© 2024 Mwanainchi Report. All rights reserved.</span>
          <span style={{color:'rgba(255,255,255,0.22)', fontSize:'12px'}}>🇰🇪 Nairobi, Kenya</span>
        </div>
      </footer>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{overflow-x:hidden;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-thumb{background:#C8102E;border-radius:3px;}
      `}</style>
    </div>
  )
}