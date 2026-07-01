'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { supabase } from '@/lib/supabase/client'
import {
  Plus, Folder, CheckCircle2, Circle, Download,
  Scale, FileText, Calendar, Lock,
  ChevronRight, AlertCircle, Clock, Shield, MapPin,
} from 'lucide-react'

const STEPS = ['Report Submitted', 'Evidence Uploaded', 'Under Review', 'Investigation', 'Referred', 'In Court', 'Resolved']
const STEP_KEYS = ['submitted', 'evidence_uploaded', 'under_review', 'investigation', 'referred', 'in_court', 'resolved']

const TABS = ['All Cases', 'Ongoing', 'Under Review', 'In Progress', 'Resolved', 'Closed']

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  evidence_uploaded: 'Evidence Uploaded',
  under_review: 'Under Review',
  investigation: 'Investigation',
  referred: 'Referred',
  in_court: 'In Court',
  resolved: 'Resolved',
  closed: 'Closed',
}

const STATUS_COLORS: Record<string, string> = {
  submitted: '#D97706',
  evidence_uploaded: '#2563EB',
  under_review: '#D97706',
  investigation: '#7C3AED',
  referred: '#2563EB',
  in_court: '#C8102E',
  resolved: '#006600',
  closed: '#6B7280',
}

interface CaseRow {
  id: string
  case_number: string
  category: string
  status: string
  location: string | null
  incident_date: string | null
  created_at: string
  evidenceCount: number
}

export default function CasesPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('All Cases')
  const [cases, setCases] = useState<CaseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCase, setSelectedCase] = useState<CaseRow | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }

    const loadCases = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('id, case_number, category, status, location, incident_date, created_at, evidence(count)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('[CASES] Query error:', error.message)
          setCases([])
        } else {
          const mapped: CaseRow[] = (data || []).map((c: any) => ({
            id: c.id,
            case_number: c.case_number,
            category: c.category,
            status: c.status,
            location: c.location,
            incident_date: c.incident_date,
            created_at: c.created_at,
            evidenceCount: c.evidence?.[0]?.count || 0,
          }))
          setCases(mapped)
          if (mapped.length > 0) setSelectedCase(mapped[0])
        }
      } finally {
        setLoading(false)
      }
    }

    loadCases()
  }, [user, authLoading])

  // Filter by tab
  const filteredCases = cases.filter(c => {
    if (activeTab === 'All Cases') return true
    if (activeTab === 'Ongoing') return !['resolved', 'closed'].includes(c.status)
    if (activeTab === 'Under Review') return c.status === 'under_review'
    if (activeTab === 'In Progress') return ['investigation', 'referred', 'in_court'].includes(c.status)
    if (activeTab === 'Resolved') return c.status === 'resolved'
    if (activeTab === 'Closed') return c.status === 'closed'
    return true
  })

  // Live stats
  const totalCases = cases.length
  const inProgressCount = cases.filter(c => ['investigation', 'referred', 'in_court', 'under_review'].includes(c.status)).length
  const resolvedCount = cases.filter(c => c.status === 'resolved' || c.status === 'closed').length
  const totalEvidence = cases.reduce((sum, c) => sum + c.evidenceCount, 0)

  const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getStepIndex = (status: string) => {
    const idx = STEP_KEYS.indexOf(status)
    return idx === -1 ? 0 : idx
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>

      {/* ── Background image only for this page section (not covering menu) ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        <img
          src="/dashboard-bg-light.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right top', opacity: 0.45 }}
        />
      </div>

      {/* All content sits above bg */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          flexWrap: 'wrap', gap: '16px', marginBottom: '24px', position: 'relative',
        }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,30px)', marginBottom: '4px' }}>
              My Cases
            </h1>
            <p style={{ color: '#6B7280', fontSize: '13px' }}>Track and manage all your reported cases in one place.</p>
          </div>

          {/* Kenya flag accent */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: '130px', height: '55px', overflow: 'hidden', borderRadius: '0 12px 0 0', opacity: 0.7, pointerEvents: 'none' }}>
            <div style={{ height: '18px', background: '#0A0A0A' }} />
            <div style={{ height: '5px', background: '#C8102E' }} />
            <div style={{ height: '18px', background: '#006600' }} />
            <div style={{ height: '5px', background: '#C8102E' }} />
            <div style={{ height: '9px', background: '#0A0A0A' }} />
          </div>

          <Link href="/dashboard/report" style={{
            background: '#C8102E', color: 'white', textDecoration: 'none',
            padding: '10px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
            display: 'flex', alignItems: 'center', gap: '7px',
          }}>
            <Plus size={15} strokeWidth={2.5} />
            Report New Incident
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>

          {/* ── Left column ── */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '18px', overflowX: 'auto', paddingBottom: '4px' }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '7px 14px', borderRadius: '6px', border: 'none',
                  background: activeTab === tab ? '#C8102E' : 'rgba(255,255,255,0.9)',
                  color: activeTab === tab ? 'white' : '#6B7280',
                  fontWeight: activeTab === tab ? 700 : 400,
                  fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'all 0.2s',
                }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Loading */}
            {loading ? (
              <div style={{
                background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                borderRadius: '16px', padding: '60px 32px', textAlign: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <div style={{
                  width: '34px', height: '34px', border: '4px solid #F3F4F6',
                  borderTopColor: '#C8102E', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 14px',
                }} />
                <p style={{ color: '#9CA3AF', fontSize: '13px' }}>Loading your cases...</p>
              </div>
            ) : filteredCases.length === 0 ? (
              /* Empty state */
              <div style={{
                background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                borderRadius: '16px', padding: '60px 32px',
                textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    background: '#F3F4F6', border: '2px solid #E5E7EB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Folder size={32} color="#9CA3AF" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px', color: '#374151' }}>
                  {cases.length === 0 ? 'No Cases Yet' : 'No cases match this filter'}
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '13px', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                  {cases.length === 0
                    ? 'You have not reported any incidents yet. When you do, your cases will appear here with full tracking.'
                    : 'Try selecting a different tab to see your other cases.'}
                </p>
                {cases.length === 0 && (
                  <Link href="/dashboard/report" style={{
                    background: '#C8102E', color: 'white', textDecoration: 'none',
                    padding: '11px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
                    display: 'inline-flex', alignItems: 'center', gap: '7px',
                  }}>
                    <Plus size={14} strokeWidth={2.5} />
                    Report Your First Incident
                  </Link>
                )}
              </div>
            ) : (
              /* Real case cards */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredCases.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCase(c); router.push(`/dashboard/cases/${c.id}`) }}
                    style={{
                      background: selectedCase?.id === c.id ? 'rgba(254,242,242,0.95)' : 'rgba(255,255,255,0.92)',
                      backdropFilter: 'blur(8px)', textAlign: 'left',
                      border: selectedCase?.id === c.id ? '1.5px solid rgba(200,16,46,0.3)' : '1.5px solid transparent',
                      borderRadius: '14px', padding: '18px 20px', cursor: 'pointer',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }}>
                      <div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '14px', color: '#0A0A0A', marginBottom: '4px' }}>
                          {c.case_number}
                        </div>
                        <div style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>{c.category}</div>
                      </div>
                      <span style={{
                        background: `${STATUS_COLORS[c.status] || '#9CA3AF'}15`,
                        color: STATUS_COLORS[c.status] || '#9CA3AF',
                        fontSize: '11px', fontWeight: 700, padding: '4px 10px',
                        borderRadius: '20px', whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                        {STATUS_LABELS[c.status] || c.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '11px', color: '#9CA3AF', marginBottom: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={11} /> {formatDate(c.incident_date)}
                      </span>
                      {c.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={11} /> {c.location}
                        </span>
                      )}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={11} /> {c.evidenceCount} evidence file{c.evidenceCount !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Mini progress bar */}
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {STEP_KEYS.map((key, i) => (
                        <div key={key} style={{
                          flex: 1, height: '4px', borderRadius: '2px',
                          background: i <= getStepIndex(c.status) ? (STATUS_COLORS[c.status] || '#006600') : '#E5E7EB',
                        }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Progress legend */}
            <div style={{
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
              borderRadius: '14px', padding: '20px',
              marginTop: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <Scale size={16} color="#C8102E" />
                <h3 style={{ fontWeight: 700, fontSize: '14px' }}>Case Progress — How It Works</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto' }}>
                {STEPS.map((step, i) => {
                  const referenceIdx = selectedCase ? getStepIndex(selectedCase.status) : -1
                  const done = i < referenceIdx
                  const active = i === referenceIdx
                  return (
                    <React.Fragment key={step}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '80px' }}>
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '50%',
                          background: done ? '#006600' : active ? '#C8102E' : '#E5E7EB',
                          color: done || active ? 'white' : '#9CA3AF',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          {done
                            ? <CheckCircle2 size={15} strokeWidth={2.5} />
                            : active
                            ? <AlertCircle size={15} strokeWidth={2.5} />
                            : <span style={{ fontSize: '11px', fontWeight: 700 }}>{i + 1}</span>
                          }
                        </div>
                        <span style={{ fontSize: '10px', color: '#6B7280', textAlign: 'center', lineHeight: 1.3 }}>{step}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div style={{ flex: 1, height: '2px', minWidth: '10px', marginBottom: '20px', background: done ? '#006600' : '#E5E7EB' }} />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '14px', flexWrap: 'wrap' }}>
                {[
                  { color: '#006600', icon: <CheckCircle2 size={12} />, label: 'Completed' },
                  { color: '#C8102E', icon: <AlertCircle size={12} />, label: 'In Progress' },
                  { color: '#9CA3AF', icon: <Circle size={12} />, label: 'Pending' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: item.color }}>
                    {item.icon}
                    <span style={{ fontSize: '11px', color: '#6B7280' }}>{item.label}</span>
                  </div>
                ))}
              </div>
              {selectedCase && (
                <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '12px' }}>
                  Showing progress for <strong style={{ color: '#374151' }}>{selectedCase.case_number}</strong>
                </p>
              )}
            </div>

            {/* Stats row — real counts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginTop: '16px' }}>
              {[
                { icon: <FileText size={18} color="#C8102E" />, label: 'Total Cases', value: String(totalCases), bg: '#FEF2F2' },
                { icon: <Clock size={18} color="#D97706" />, label: 'In Progress', value: String(inProgressCount), bg: '#FFFBEB' },
                { icon: <CheckCircle2 size={18} color="#006600" />, label: 'Resolved', value: String(resolvedCount), bg: '#F0FDF4' },
                { icon: <Shield size={18} color="#2563EB" />, label: 'Evidence', value: String(totalEvidence), bg: '#EFF6FF' },
              ].map(card => (
                <div key={card.label} style={{
                  background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
                  borderRadius: '12px', padding: '16px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0A0A0A', lineHeight: 1 }}>{card.value}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{card.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right panel ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '80px' }}>

            {/* Case summary — real data of selected case */}
            <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <FileText size={15} color="#C8102E" />
                <h3 style={{ fontWeight: 700, fontSize: '14px' }}>Case Summary</h3>
              </div>
              {[
                { label: 'Case ID', icon: <Lock size={11} color="#9CA3AF" />, value: selectedCase?.case_number },
                { label: 'Category', icon: <Folder size={11} color="#9CA3AF" />, value: selectedCase?.category },
                { label: 'Date Reported', icon: <Calendar size={11} color="#9CA3AF" />, value: selectedCase ? formatDate(selectedCase.created_at) : undefined },
                { label: 'Status', icon: <AlertCircle size={11} color="#9CA3AF" />, value: selectedCase ? (STATUS_LABELS[selectedCase.status] || selectedCase.status) : undefined },
                { label: 'Evidence', icon: <Shield size={11} color="#9CA3AF" />, value: selectedCase ? `${selectedCase.evidenceCount} file(s)` : undefined },
              ].map(({ label, icon, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6', fontSize: '12px' }}>
                  <span style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {icon} {label}
                  </span>
                  <span style={{ fontWeight: 600, color: '#0A0A0A' }}>{value || '—'}</span>
                </div>
              ))}
              {selectedCase ? (
                <Link href={`/dashboard/cases/${selectedCase.id}`} style={{
                  fontSize: '11px', color: '#C8102E', marginTop: '12px', textAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  textDecoration: 'none', fontWeight: 600,
                }}>
                  View full details <ChevronRight size={11} />
                </Link>
              ) : (
                <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <ChevronRight size={11} /> Select a case to view details
                </p>
              )}
            </div>

            {/* Legal support */}
            <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Scale size={15} color="#006600" />
                <h3 style={{ fontWeight: 700, fontSize: '14px' }}>Need Legal Support?</h3>
              </div>
              <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '14px', lineHeight: 1.5 }}>
                Connect with a trusted lawyer for guidance and representation.
              </p>
              <Link href="/dashboard/legal-support" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                background: '#006600', color: 'white', textDecoration: 'none',
                padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '13px',
              }}>
                <Scale size={14} /> Browse Lawyers
              </Link>
            </div>

            {/* Download rights guide — constitution image */}
            <div style={{ borderRadius: '14px', overflow: 'hidden', position: 'relative', minHeight: '160px' }}>
              <img
                src="/constitution-kenya.jpg"
                alt="Constitution of Kenya"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.55) 100%)' }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <FileText size={15} color="white" />
                  <h3 style={{ fontWeight: 700, fontSize: '14px', color: 'white' }}>Download Your Rights Guide</h3>
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginBottom: '14px', lineHeight: 1.5 }}>
                  Know your rights and the laws that protect you.
                </p>
                <button style={{
                  background: 'white', color: '#0A0A0A', border: 'none',
                  borderRadius: '7px', padding: '9px 16px', fontSize: '12px',
                  fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                  <Download size={13} strokeWidth={2.5} />
                  Download Guide
                </button>
              </div>
            </div>

            {/* Security notice */}
            <div style={{
              background: 'rgba(240,253,244,0.95)', border: '1px solid rgba(0,102,0,0.15)',
              borderRadius: '12px', padding: '14px',
              display: 'flex', alignItems: 'flex-start', gap: '10px',
            }}>
              <Lock size={15} color="#006600" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#006600', marginBottom: '3px' }}>Your Cases Are Secure</div>
                <p style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.5 }}>
                  All case data is encrypted and only visible to you and authorised legal personnel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}