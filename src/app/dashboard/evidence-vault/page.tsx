'use client'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthContext'
import { supabase } from '@/lib/supabase/client'

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

interface EvidenceRow {
  id: string
  case_id: string
  file_name: string
  file_url: string
  file_type: string
  file_size: number
  uploaded_at: string
  case_number?: string
}

interface CaseOption {
  id: string
  case_number: string
}

export default function EvidenceVaultPage() {
  const { user } = useAuth()
  const [dragOver, setDragOver] = useState(false)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [evidence, setEvidence] = useState<EvidenceRow[]>([])
  const [cases, setCases] = useState<CaseOption[]>([])
  const [selectedCaseId, setSelectedCaseId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // Load existing evidence + user's cases (for the upload dropdown)
  useEffect(() => {
    if (!user) { setLoading(false); return }

    const loadData = async () => {
      setLoading(true)
      try {
        const { data: casesData } = await supabase
          .from('cases')
          .select('id, case_number')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        setCases(casesData || [])
        if (casesData && casesData.length > 0) setSelectedCaseId(casesData[0].id)

        const { data: evidenceData, error } = await supabase
          .from('evidence')
          .select('id, case_id, file_name, file_url, file_type, file_size, uploaded_at, cases(case_number)')
          .eq('user_id', user.id)
          .order('uploaded_at', { ascending: false })

        if (error) {
          console.error('[VAULT] Evidence query error:', error.message)
        } else {
          const mapped: EvidenceRow[] = (evidenceData || []).map((e: any) => ({
            id: e.id,
            case_id: e.case_id,
            file_name: e.file_name,
            file_url: e.file_url,
            file_type: e.file_type,
            file_size: e.file_size,
            uploaded_at: e.uploaded_at,
            case_number: e.cases?.case_number,
          }))
          setEvidence(mapped)
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const addPendingFiles = (newFiles: File[]) => {
    setPendingFiles(prev => [...prev, ...newFiles])
  }

  const uploadPendingFiles = async () => {
    if (!user || pendingFiles.length === 0 || !selectedCaseId) {
      setUploadError(!selectedCaseId ? 'Please select a case to attach this evidence to.' : '')
      return
    }

    setUploading(true)
    setUploadError('')

    try {
      for (const file of pendingFiles) {
        const filePath = `${user.id}/${selectedCaseId}/${Date.now()}-${file.name}`

        const { error: uploadErr } = await supabase.storage
          .from('evidence')
          .upload(filePath, file, { contentType: file.type })

        if (uploadErr) {
          console.error('[VAULT] Upload failed for', file.name, uploadErr.message)
          setUploadError(`Failed to upload ${file.name}: ${uploadErr.message}`)
          continue
        }

        const { data: urlData } = await supabase.storage
          .from('evidence')
          .createSignedUrl(filePath, 60 * 60 * 24 * 365)

        const { data: inserted, error: insertErr } = await supabase
          .from('evidence')
          .insert({
            case_id: selectedCaseId,
            user_id: user.id,
            file_name: file.name,
            file_url: urlData?.signedUrl || '',
            file_type: file.type,
            file_size: file.size,
            description: null,
          })
          .select('id, case_id, file_name, file_url, file_type, file_size, uploaded_at')
          .single()

        if (insertErr) {
          console.error('[VAULT] DB insert failed:', insertErr.message)
          continue
        }

        if (inserted) {
          const caseInfo = cases.find(c => c.id === selectedCaseId)
          setEvidence(prev => [{ ...inserted, case_number: caseInfo?.case_number }, ...prev])
        }
      }

      // Mark case as having evidence
      await supabase
        .from('cases')
        .update({ status: 'evidence_uploaded' })
        .eq('id', selectedCaseId)
        .eq('status', 'submitted')

      setPendingFiles([])
    } finally {
      setUploading(false)
    }
  }

  // Stats
  const totalFiles = evidence.length
  const totalBytes = evidence.reduce((sum, e) => sum + (e.file_size || 0), 0)
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2)
  const casesWithEvidence = new Set(evidence.map(e => e.case_id)).size
  const lastUpload = evidence.length > 0
    ? new Date(evidence[0].uploaded_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Never'

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
          {/* Case selector — required before upload */}
          {cases.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Attach evidence to which case?
              </label>
              <select
                value={selectedCaseId}
                onChange={e => setSelectedCaseId(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', background: 'white' }}
              >
                {cases.map(c => <option key={c.id} value={c.id}>{c.case_number}</option>)}
              </select>
            </div>
          )}

          {cases.length === 0 && !loading && (
            <div style={{ background: '#FFFBEB', border: '1px solid rgba(217,119,6,0.2)', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', fontSize: '13px', color: '#92400E' }}>
              You don't have any cases yet. Report an incident first, then you can attach evidence to it here.
            </div>
          )}

          {/* Upload zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); e.dataTransfer.files && addPendingFiles(Array.from(e.dataTransfer.files)) }}
            onClick={() => document.getElementById('vault-upload')?.click()}
            style={{
              background: dragOver ? '#FEF2F2' : 'white',
              border:`2px dashed ${dragOver ? '#C8102E' : '#E5E7EB'}`,
              borderRadius:'16px', padding:'48px 32px', textAlign:'center',
              cursor: cases.length === 0 ? 'not-allowed' : 'pointer', transition:'all 0.2s', marginBottom:'20px',
              opacity: cases.length === 0 ? 0.5 : 1,
            }}
          >
            <input id="vault-upload" type="file" multiple style={{ display:'none' }}
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              disabled={cases.length === 0}
              onChange={e => e.target.files && addPendingFiles(Array.from(e.target.files))} />
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

          {/* Pending files (not yet uploaded) */}
          {pendingFiles.length > 0 && (
            <div style={{ background:'white', borderRadius:'12px', padding:'16px', marginBottom:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight:600, fontSize:'13px', marginBottom:'10px' }}>Ready to upload ({pendingFiles.length})</div>
              {pendingFiles.map((f,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', background:'#FFFBEB', borderRadius:'8px', padding:'10px 14px', marginBottom:'6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span style={{ flex:1, fontSize:'13px' }}>{f.name}</span>
                  <span style={{ fontSize:'11px', color:'#9CA3AF' }}>{(f.size/1024).toFixed(1)} KB</span>
                  <button onClick={() => setPendingFiles(pendingFiles.filter((_,j)=>j!==i))} disabled={uploading} style={{ background:'none', border:'none', color:'#EF4444', cursor: uploading ? 'not-allowed' : 'pointer', display:'flex' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
              {uploadError && (
                <div style={{ fontSize: '12px', color: '#C8102E', marginTop: '8px', marginBottom: '8px' }}>{uploadError}</div>
              )}
              <button
                onClick={uploadPendingFiles}
                disabled={uploading}
                style={{
                  width: '100%', marginTop: '8px', background: uploading ? '#E5A0A8' : '#C8102E',
                  color: 'white', border: 'none', borderRadius: '8px', padding: '10px',
                  fontSize: '13px', fontWeight: 700, cursor: uploading ? 'not-allowed' : 'pointer',
                }}
              >
                {uploading ? 'Uploading...' : `Upload ${pendingFiles.length} file(s) to Vault`}
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ background:'white', borderRadius:'16px', padding:'48px 24px', textAlign:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{
                width: '32px', height: '32px', border: '4px solid #F3F4F6',
                borderTopColor: '#C8102E', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 14px',
              }} />
              <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Loading your evidence vault...</p>
            </div>
          )}

          {/* Real evidence list */}
          {!loading && evidence.length > 0 && (
            <div style={{ background:'white', borderRadius:'16px', padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '14px' }}>Stored Evidence ({evidence.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {evidence.map(e => (
                  <a key={e.id} href={e.file_url} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', gap: '10px', background: '#F0FDF4',
                    borderRadius: '8px', padding: '10px 14px', textDecoration: 'none',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#006600" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', color: '#0A0A0A', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {e.file_name}
                      </div>
                      <div style={{ fontSize: '10px', color: '#9CA3AF' }}>
                        {e.case_number ? `${e.case_number} · ` : ''}{new Date(e.uploaded_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#9CA3AF', flexShrink: 0 }}>{(e.file_size / 1024).toFixed(1)} KB</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Empty vault */}
          {!loading && evidence.length === 0 && (
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

        {/* Right panel — real stats */}
        <div style={{ display:'flex', flexDirection:'column', gap:'16px', position:'sticky', top:'80px' }}>
          <div style={{ background:'white', borderRadius:'14px', padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight:700, fontSize:'14px', marginBottom:'16px' }}>Vault Overview</h3>
            {[
              { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>, label:'Total Files', value: String(totalFiles) },
              { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>, label:'Storage Used', value: `${totalMB} MB` },
              { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>, label:'Cases with Evidence', value: String(casesWithEvidence) },
              { icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label:'Last Upload', value: lastUpload },
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

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}