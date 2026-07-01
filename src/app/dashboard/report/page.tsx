'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import SOSButton from '@/components/ui/SOSButton'
import { useAuth } from '@/lib/auth/AuthContext'
import { supabase } from '@/lib/supabase/client'
import {
  CheckCircle2,
  ArrowLeft,
  MapPin,
  Paperclip,
  FileText,
  Lock,
  Save,
  ChevronRight,
  ShieldCheck,
  Siren,
  Phone,
  Scale,
  Shield,
  AlertCircle,
} from 'lucide-react'

const STEPS = ['Incident Details', 'Upload Evidence', 'Additional Information', 'Review & Confirm', 'Submission Complete']
const CATEGORIES = ['Theft / Robbery', 'Assault / Physical Harm', 'Sexual Violence', 'Domestic Violence', 'Corruption / Bribery', 'Land Disputes', 'Fraud / Cybercrime', 'Police Misconduct', 'Human Trafficking', 'Other']

export default function ReportPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [anonymous, setAnonymous] = useState(false)
  const [form, setForm] = useState({
    category: '', type: '', date: '', time: '', location: '',
    description: '', victimSelf: true, witnesses: false, involvedDesc: '',
    policeReported: 'No, not yet',
    legalRepresentation: 'No, I just need to document this',
    preferredLanguage: 'English',
    additionalContext: '',
  })
  const [files, setFiles] = useState<File[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [caseNumber, setCaseNumber] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // ── Validation per step ──
  const validateStep = (currentStep: number): boolean => {
    const errors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!form.category) errors.category = 'Please select a category'
      if (!form.type) errors.type = 'Please select an incident type'
      if (!form.date) errors.date = 'Please provide the date of the incident'
      if (!form.location.trim()) errors.location = 'Please provide a location'
      if (!form.description.trim() || form.description.trim().length < 20) {
        errors.description = 'Please describe what happened (at least 20 characters)'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = async () => {
    // Steps 1–3 require validation before advancing
    if (step < 4) {
      if (!validateStep(step)) return
      setStep(step + 1)
      return
    }

    // Step 4 = final submit
    if (step === 4) {
      if (!user) {
        setSubmitError('You must be signed in to submit a report.')
        return
      }

      setSubmitting(true)
      setSubmitError('')

      try {
        const { data: caseRow, error: insertError } = await supabase
          .from('cases')
          .insert({
            user_id: user.id,
            category: form.category,
            incident_type: form.type,
            incident_date: form.date || null,
            incident_time: form.time || null,
            location: form.location,
            description: form.description,
            involved_description: form.involvedDesc || null,
            victim_self: form.victimSelf,
            has_witnesses: form.witnesses,
            police_reported: form.policeReported,
            legal_representation: form.legalRepresentation,
            preferred_language: form.preferredLanguage,
            additional_context: form.additionalContext || null,
            is_anonymous: anonymous,
            status: 'submitted',
          })
          .select()
          .single()

        if (insertError) {
          console.error('[REPORT] Insert failed:', insertError.message)
          setSubmitError(insertError.message || 'Failed to submit report. Please try again.')
          setSubmitting(false)
          return
        }

        console.log('[REPORT] Case created:', caseRow)
        setCaseNumber(caseRow.case_number)

        // Upload evidence files if any
        if (files.length > 0) {
          for (const file of files) {
            const filePath = `${user.id}/${caseRow.id}/${Date.now()}-${file.name}`
            const { error: uploadError } = await supabase.storage
              .from('evidence')
              .upload(filePath, file, { contentType: file.type })

            if (uploadError) {
              console.error('[REPORT] Evidence upload failed for', file.name, uploadError.message)
              continue
            }

            const { data: urlData } = await supabase.storage
              .from('evidence')
              .createSignedUrl(filePath, 60 * 60 * 24 * 365)

            await supabase.from('evidence').insert({
              case_id: caseRow.id,
              user_id: user.id,
              file_name: file.name,
              file_url: urlData?.signedUrl || '',
              file_type: file.type,
              file_size: file.size,
              description: null,
            })
          }

          // Mark case as having evidence uploaded
          await supabase
            .from('cases')
            .update({ status: 'evidence_uploaded' })
            .eq('id', caseRow.id)
        }

        setSubmitted(true)
        setStep(5)
      } catch (err: any) {
        console.error('[REPORT] Unexpected error:', err)
        setSubmitError(err?.message || 'Something went wrong. Please try again.')
      } finally {
        setSubmitting(false)
      }
    }
  }

  if (submitted || step === 5) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <CheckCircle2 size={72} color="#006600" strokeWidth={1.5} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '28px', marginBottom: '12px' }}>
          Report Submitted Successfully
        </h1>
        <p style={{ color: '#6B7280', marginBottom: '8px', fontSize: '15px', lineHeight: 1.7 }}>
          Your report has been received and secured. A case ID has been generated for you.
        </p>
        <div style={{
          background: '#F0FDF4', border: '1px solid rgba(0,102,0,0.2)',
          borderRadius: '12px', padding: '20px', margin: '24px auto', maxWidth: '360px',
        }}>
          <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Your Case ID</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '20px', color: '#006600' }}>
            {caseNumber}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/dashboard/cases" style={{
            background: '#C8102E', color: 'white', textDecoration: 'none',
            padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px',
          }}>
            View My Cases
          </Link>
          <Link href="/dashboard" style={{
            background: '#F3F4F6', color: '#374151', textDecoration: 'none',
            padding: '12px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
          }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/dashboard" style={{
          color: '#6B7280', textDecoration: 'none', fontSize: '13px',
          display: 'inline-flex', alignItems: 'center', gap: '6px',
        }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' }}>

        {/* ── Main form ── */}
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,30px)', marginBottom: '4px' }}>
            Report an Incident
          </h1>
          <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>
            Your report is confidential and your identity is protected.
          </p>

          {/* Step progress */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', overflowX: 'auto' }}>
            {STEPS.map((s, i) => {
              const n = i + 1
              const done = n < step
              const active = n === step
              return (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '60px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: done ? '#006600' : active ? '#C8102E' : '#E5E7EB',
                      color: done || active ? 'white' : '#9CA3AF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '13px', transition: 'all 0.3s',
                    }}>
                      {done ? <CheckCircle2 size={16} strokeWidth={2.5} /> : n}
                    </div>
                    <span style={{ fontSize: '10px', color: active ? '#C8102E' : '#9CA3AF', fontWeight: active ? 700 : 400, textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {s}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      flex: 1, height: '2px', minWidth: '20px', marginBottom: '20px',
                      background: done ? '#006600' : '#E5E7EB', transition: 'background 0.3s',
                    }} />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Form card */}
          <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(20px,4vw,32px)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '24px', color: '#0A0A0A' }}>
                  1. What happened?
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px', marginBottom: '6px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Incident Category *</label>
                    <select className="form-input" value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      style={{ borderColor: fieldErrors.category ? '#C8102E' : undefined }}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    {fieldErrors.category && <FieldError text={fieldErrors.category} />}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Incident Type *</label>
                    <select className="form-input" value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      style={{ borderColor: fieldErrors.type ? '#C8102E' : undefined }}>
                      <option value="">Select type</option>
                      <option>Single incident</option>
                      <option>Ongoing / Repeated</option>
                    </select>
                    {fieldErrors.type && <FieldError text={fieldErrors.type} />}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '16px', marginBottom: '6px', marginTop: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Date of Incident *</label>
                    <input type="date" className="form-input" value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      style={{ borderColor: fieldErrors.date ? '#C8102E' : undefined }} />
                    {fieldErrors.date && <FieldError text={fieldErrors.date} />}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Time (Optional)</label>
                    <input type="time" className="form-input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Location of Incident *</label>
                    <div style={{ position: 'relative' }}>
                      <input type="text" placeholder="Enter location" className="form-input"
                        style={{ paddingRight: '120px', borderColor: fieldErrors.location ? '#C8102E' : undefined }} value={form.location}
                        onChange={e => setForm({ ...form, location: e.target.value })} />
                      <button type="button" style={{
                        position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', color: '#C8102E',
                        fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap',
                      }}>
                        <MapPin size={12} /> Use My Location
                      </button>
                    </div>
                    {fieldErrors.location && <FieldError text={fieldErrors.location} />}
                  </div>
                </div>

                <div style={{ marginBottom: '24px', marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Description of Incident *</label>
                  <p style={{ color: '#9CA3AF', fontSize: '11px', marginBottom: '6px' }}>Please provide a detailed description of what happened.</p>
                  <textarea placeholder="Write your description here..." className="form-input"
                    style={{ minHeight: '120px', resize: 'vertical', borderColor: fieldErrors.description ? '#C8102E' : undefined }} maxLength={2000}
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {fieldErrors.description ? <FieldError text={fieldErrors.description} /> : <span />}
                    <div style={{ textAlign: 'right', fontSize: '11px', color: '#9CA3AF' }}>{form.description.length}/2000</div>
                  </div>
                </div>

                <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '20px', color: '#0A0A0A' }}>2. Who was involved?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                  {[
                    { label: 'Were you the victim?', name: 'victim', val: form.victimSelf, set: (v: boolean) => setForm({ ...form, victimSelf: v }) },
                    { label: 'Were there any witnesses?', name: 'witnesses', val: form.witnesses, set: (v: boolean) => setForm({ ...form, witnesses: v }) },
                  ].map(({ label, name, val, set }) => (
                    <div key={name}>
                      <label style={{ fontWeight: 600, fontSize: '13px', display: 'block', marginBottom: '8px' }}>{label}</label>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        {['Yes', 'No'].map(v => (
                          <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px' }}>
                            <input type="radio" name={name} checked={val === (v === 'Yes')}
                              onChange={() => set(v === 'Yes')} style={{ accentColor: '#C8102E' }} />
                            {v}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Describe the people involved (Optional)</label>
                  <textarea placeholder="Names, physical descriptions or any other relevant details..."
                    className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} maxLength={1000}
                    value={form.involvedDesc} onChange={e => setForm({ ...form, involvedDesc: e.target.value })} />
                  <div style={{ textAlign: 'right', fontSize: '11px', color: '#9CA3AF' }}>{form.involvedDesc.length}/1000</div>
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Upload Evidence</h2>
                <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '24px' }}>
                  Upload photos, videos, documents, or voice recordings. All evidence is encrypted and timestamped.
                </p>
                <div
                  style={{ border: '2px dashed #E5E7EB', borderRadius: '12px', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', color: '#9CA3AF' }}>
                    <Paperclip size={40} strokeWidth={1.5} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>Drag & drop files here</p>
                  <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '16px' }}>
                    or click to browse — Photos, Videos, Documents, Audio
                  </p>
                  <input id="file-upload" type="file" multiple style={{ display: 'none' }}
                    onChange={e => e.target.files && setFiles([...files, ...Array.from(e.target.files)])}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx" />
                  <button type="button" style={{
                    background: '#F3F4F6', border: 'none', borderRadius: '8px',
                    padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: 600,
                  }}>
                    Choose Files
                  </button>
                </div>
                {files.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>Uploaded files ({files.length})</p>
                    {files.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F0FDF4', borderRadius: '8px', padding: '10px 14px', marginBottom: '6px' }}>
                        <FileText size={16} color="#006600" />
                        <span style={{ flex: 1, fontSize: '13px' }}>{f.name}</span>
                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{(f.size / 1024).toFixed(1)} KB</span>
                        <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '24px' }}>Additional Information</h2>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Have you reported this to police?</label>
                  <select className="form-input" value={form.policeReported}
                    onChange={e => setForm({ ...form, policeReported: e.target.value })}>
                    {['No, not yet', 'Yes, OB number obtained', 'Yes, but no action taken', 'Afraid to report'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Do you need legal representation?</label>
                  <select className="form-input" value={form.legalRepresentation}
                    onChange={e => setForm({ ...form, legalRepresentation: e.target.value })}>
                    {['Yes, please connect me with a lawyer', 'No, I just need to document this', 'I need legal aid (cannot afford a lawyer)'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Preferred Language for Follow-Up</label>
                  <select className="form-input" value={form.preferredLanguage}
                    onChange={e => setForm({ ...form, preferredLanguage: e.target.value })}>
                    {['English', 'Kiswahili', 'Sheng'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Any additional context (Optional)</label>
                  <textarea className="form-input" placeholder="Any other information that may help..."
                    style={{ minHeight: '100px', resize: 'vertical' }}
                    value={form.additionalContext}
                    onChange={e => setForm({ ...form, additionalContext: e.target.value })} />
                </div>
              </div>
            )}

            {/* ── STEP 4 ── */}
            {step === 4 && (
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '20px' }}>Review & Confirm</h2>
                <div style={{ background: '#F8F9FA', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#374151' }}>Incident Summary</div>
                  {[
                    { label: 'Category', value: form.category || 'Not specified' },
                    { label: 'Date', value: form.date || 'Not specified' },
                    { label: 'Location', value: form.location || 'Not specified' },
                    { label: 'Evidence Files', value: `${files.length} file(s) uploaded` },
                    { label: 'Reporting Mode', value: anonymous ? 'Anonymous' : 'Identified' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB', fontSize: '13px' }}>
                      <span style={{ color: '#6B7280' }}>{label}</span>
                      <span style={{ fontWeight: 600, color: '#0A0A0A' }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#FEF2F2', border: '1px solid rgba(200,16,46,0.2)', borderRadius: '8px', padding: '12px 16px', fontSize: '12px', color: '#374151', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Lock size={14} color="#C8102E" style={{ flexShrink: 0, marginTop: '2px' }} />
                  By submitting, you confirm that this report is truthful to the best of your knowledge. Your evidence will be encrypted and time-stamped.
                </div>
                {submitError && (
                  <div style={{ marginTop: '14px', background: '#FEF2F2', border: '1px solid rgba(200,16,46,0.3)', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#C8102E', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                    {submitError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} disabled={submitting} style={{
                  background: '#F3F4F6', color: '#374151', border: 'none',
                  borderRadius: '8px', padding: '11px 20px', fontWeight: 600, fontSize: '13px',
                  cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1,
                }}>
                  Back
                </button>
              )}
              <button style={{
                background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '8px',
                padding: '11px 20px', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <Save size={14} /> Save Draft
              </button>
            </div>
            <button onClick={handleNext} disabled={submitting} style={{
              background: submitting ? '#E5A0A8' : '#C8102E', color: 'white', border: 'none', borderRadius: '8px',
              padding: '11px 28px', fontWeight: 700, fontSize: '14px', cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {submitting ? 'Submitting...' : step === 4 ? 'Submit Report' : 'Next'} {!submitting && <ChevronRight size={16} />}
            </button>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>

          {/* Safety */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={18} color="#006600" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Your Safety Matters</span>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.6, marginBottom: '14px' }}>
              You can report anonymously. Your information and evidence are encrypted and secure.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#374151', fontWeight: 500 }}>Report Anonymously ⓘ</span>
              <button onClick={() => setAnonymous(!anonymous)} style={{
                width: '40px', height: '22px', borderRadius: '11px',
                background: anonymous ? '#C8102E' : '#E5E7EB',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
              }}>
                <span style={{
                  position: 'absolute', width: '18px', height: '18px', borderRadius: '50%',
                  background: 'white', top: '2px', left: anonymous ? '20px' : '2px', transition: 'left 0.2s',
                }} />
              </button>
            </div>
          </div>

          {/* Emergency */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Siren size={18} color="#C8102E" />
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#C8102E' }}>Need Immediate Help?</span>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '12px', lineHeight: 1.5 }}>
              If you are in danger or need urgent assistance, call for help now.
            </p>
            <a href="tel:999" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              background: '#C8102E', color: 'white', textAlign: 'center', textDecoration: 'none',
              padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', marginBottom: '8px',
            }}>
              <Phone size={14} /> Call Emergency (999)
            </a>
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '8px', textAlign: 'center' }}>
              Or use our SOS button anywhere on the platform.
            </p>
            <SOSButton variant="inline" />
          </div>

          {/* What happens next */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '14px' }}>What Happens Next?</div>
            {[
              { icon: <Shield size={14} />, text: 'We securely receive your report', color: '#006600' },
              { icon: <Scale size={14} />, text: 'Our team reviews and verifies it', color: '#D97706' },
              { icon: <Scale size={14} />, text: 'You get connected to legal support', color: '#2563EB' },
              { icon: <CheckCircle2 size={14} />, text: 'We help you seek justice', color: '#C8102E' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: `${item.color}20`, color: item.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '12px', color: '#374151' }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div style={{ background: '#F0FDF4', border: '1px solid rgba(0,102,0,0.2)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '24px', color: '#006600', lineHeight: 1, marginBottom: '8px' }}>"</div>
            <p style={{ fontSize: '13px', color: '#006600', fontStyle: 'italic', fontWeight: 600, lineHeight: 1.5, marginBottom: '6px' }}>
              Haki ni msingi wa amani na maendeleo ya jamii.
            </p>
            <p style={{ fontSize: '11px', color: '#6B7280' }}>Justice is the foundation of peace and development.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function FieldError({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', color: '#C8102E', fontSize: '11px' }}>
      <AlertCircle size={11} /> {text}
    </div>
  )
}