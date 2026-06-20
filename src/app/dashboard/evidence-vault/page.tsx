'use client'
import React, { useState } from 'react'

const FEATURES = [
  { color:'#006600', bg:'#F0FDF4', title:'End-to-End Encrypted', desc:'AES-256 encryption',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#006600" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
  { color:'#2563EB', bg:'#EFF6FF', title:'Tamper-Proof Timestamps', desc:'Blockchain-verified time',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { color:'#7C3AED', bg:'#F5F3FF', title:'Chain of Custody', desc:'Every access logged',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
  { color:'#D97706', bg:'#FFFBEB', title:'Multiple Backups', desc:'Redundant secure storage',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg> },
]

export default function EvidenceVaultPage() {
  const [dragOver, setDragOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:'clamp(22px,3vw,30px)', marginBottom:'4px' }}>
          Evidence Vault
        </h1>
        <p style={{ color:'#6B7280', fontSize:'13px' }}>
          All your evidence is encrypted, timestamped, and tamper-proof.
        </p>
      </div>

      {/* Security features */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'12px', marginBottom:'24px' }}>
        {FEATURES.map(f => (
          <div key={f.title} style={{ background:'white', borderRadius:'12px', padding:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', display:'flex', gap:'10px', alignItems:'flex-start' }}>
            <div style={{ width:'38px', height:'38px', borderRadius:'9px', background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {f.icon}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:'12px', color:'#0A0A0A', marginBottom:'2px' }}>{f.title}</div>
              <div style={{ fontSize:'11px', color:'#9CA3AF' }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'20px', alignItems:'start' }}>
        <div>
          {/* Upload zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); e.dataTransfer.files && setFiles(f => [...f, ...Array.from(e.dataTransfer.files)]) }}
            onClick={() => document.getElementById('vault-upload')?.click()}
            style={{
              background: dragOver ? '#FEF2F2' : 'white',
              border:`2px dashed ${dragOver ? '#C8102E' : '#E5E7EB'}`,
              borderRadius:'16px', padding:'48px 32px', textAlign:'center',
              cursor:'pointer', transition:'all 0.2s', marginBottom:'20px',
            }}
          >
            <input id="vault-upload" type="file" multiple style={{ display:'none' }}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              onChange={e => e.target.files && setFiles(f => [...f, ...Array.from(e.target.files!)])} />
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'14px', color:dragOver?'#C8102E':'#9CA3AF' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
            </div>
            <h3 style={{ fontWeight:700, fontSize:'16px', marginBottom:'6px' }}>Upload Evidence to Secure Vault</h3>
            <p style={{ color:'#9CA3AF', fontSize:'13px', marginBottom:'20px', lineHeight:1.5 }}>
              Photos, videos, documents, or audio recordings.<br/>Each file gets a digital fingerprint and timestamp.
            </p>
            <div style={{ display:'flex', gap:'8px', justifyContent:'center', flexWrap:'wrap' }}>
              {['Photos','Videos','Documents','Audio'].map(t => (
                <span key={t} style={{ background:'#F3F4F6', borderRadius:'20px', padding:'5px 12px', fontSize:'12px', color:'#6B7280' }}>{t}</span>
              ))}
            </div>
          </div>

          {files.length > 0 && (
            <div style={{ background:'white', borderRadius:'12px', padding:'16px', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight:600, fontSize:'13px', marginBottom:'10px' }}>Uploaded files ({files.length})</div>
              {files.map((f,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', background:'#F0FDF4', borderRadius:'8px', padding:'10px 14px', marginBottom:'6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006600" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span style={{ flex:1, fontSize:'13px' }}>{f.name}</span>
                  <span style={{ fontSize:'11px', color:'#9CA3AF' }}>{(f.size/1024).toFixed(1)} KB</span>
                  <button onClick={() => setFiles(files.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:'#EF4444', cursor:'pointer', display:'flex' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Empty vault */}
          {files.length === 0 && (
            <div style={{ background:'white', borderRadius:'16px', padding:'48px 24px', textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'16px', opacity:0.25 }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 style={{ fontWeight:700, fontSize:'18px', marginBottom:'8px', color:'#374151' }}>Your Vault is Empty</h3>
              <p style={{ color:'#9CA3AF', fontSize:'13px', maxWidth:'360px', margin:'0 auto', lineHeight:1.6 }}>
                Evidence you upload will appear here with full metadata, chain of custody records, and tamper detection.
              </p>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px', position:'sticky', top:'80px' }}>
          <div style={{ background:'white', borderRadius:'14px', padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight:700, fontSize:'14px', marginBottom:'16px' }}>Vault Overview</h3>
            {[
              { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>, label:'Total Files', value:'0' },
              { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>, label:'Storage Used', value:'0 MB' },
              { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>, label:'Cases with Evidence', value:'0' },
              { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label:'Last Upload', value:'Never' },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #F3F4F6', fontSize:'12px' }}>
                <span style={{ color:'#6B7280', display:'flex', alignItems:'center', gap:'6px' }}>{icon} {label}</span>
                <span style={{ fontWeight:700, color:'#0A0A0A' }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ background:'#F8F9FA', borderRadius:'14px', padding:'20px', border:'1px solid #E5E7EB' }}>
            <h3 style={{ fontWeight:700, fontSize:'13px', marginBottom:'12px' }}>
              How Evidence Protection Works
            </h3>
            {[
              'You upload a file to the vault',
              'System generates a unique SHA-256 hash (digital fingerprint)',
              'Timestamp and metadata are recorded immutably',
              'Any future tampering is instantly detectable',
            ].map((text, i) => (
              <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start', marginBottom:'10px' }}>
                <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:'#C8102E', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700, flexShrink:0 }}>
                  {i+1}
                </div>
                <span style={{ fontSize:'12px', color:'#6B7280', lineHeight:1.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
