'use client'
import React, { useState } from 'react'
import {
  Globe, Bell, BellOff, MessageSquare, Shield,
  Lock, Smartphone, Mail, Trash2, Download,
  Sun, Moon, CheckCircle2, AlertTriangle,
} from 'lucide-react'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button" onClick={() => onChange(!value)}
      style={{
        width: '44px', height: '24px', borderRadius: '12px',
        background: value ? '#C8102E' : '#E5E7EB',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', width: '18px', height: '18px',
        borderRadius: '50%', background: 'white',
        top: '3px', left: value ? '23px' : '3px',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #F3F4F6' }}>
        {icon}
        <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#0A0A0A' }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Row({ icon, label, desc, value, onChange }: { icon: React.ReactNode; label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F9F9F9', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1 }}>
        <div style={{ marginTop: '1px', color: '#9CA3AF', flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A0A0A' }}>{label}</div>
          {desc && <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px', lineHeight: 1.4 }}>{desc}</div>}
        </div>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

export default function SettingsPage() {
  const [s, setS] = useState({
    emailNotifs: true, smsNotifs: false, pushNotifs: true,
    caseUpdates: true, messageAlerts: true, marketing: false,
    twoFactor: false, anonymousMode: false, dataSharing: false,
    theme: 'light', language: 'en',
  })
  const set = (k: string, v: any) => setS(prev => ({ ...prev, [k]: v }))
  const [saved, setSaved] = useState(false)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,28px)', marginBottom: '4px' }}>
          Settings
        </h1>
        <p style={{ color: '#6B7280', fontSize: '13px' }}>Manage your account preferences, privacy, and notifications.</p>
      </div>

      {/* Language & Display */}
      <Section title="Language & Display" icon={<Globe size={16} color="#C8102E" />}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Platform Language</label>
            <div style={{ position: 'relative' }}>
              <Globe size={14} color="#9CA3AF" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <select value={s.language} onChange={e => set('language', e.target.value)}
                style={{ width: '100%', padding: '9px 12px 9px 32px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', background: 'white', appearance: 'none', fontFamily: 'inherit' }}>
                <option value="en">English</option>
                <option value="sw">Kiswahili</option>
                <option value="sh">Sheng</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Interface Theme</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { val: 'light', label: 'Light', icon: <Sun size={13} /> },
                { val: 'dark', label: 'Dark', icon: <Moon size={13} /> },
              ].map(t => (
                <button key={t.val} type="button" onClick={() => set('theme', t.val)} style={{
                  flex: 1, padding: '9px 12px', borderRadius: '8px',
                  border: `1.5px solid ${s.theme === t.val ? '#C8102E' : '#E5E7EB'}`,
                  background: s.theme === t.val ? '#FEF2F2' : 'white',
                  color: s.theme === t.val ? '#C8102E' : '#6B7280',
                  fontSize: '12px', fontWeight: s.theme === t.val ? 700 : 400,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={<Bell size={16} color="#C8102E" />}>
        <Row icon={<Mail size={15} />} label="Email Notifications" desc="Receive updates about your cases via email" value={s.emailNotifs} onChange={v => set('emailNotifs', v)} />
        <Row icon={<Smartphone size={15} />} label="SMS Notifications" desc="Receive SMS alerts for urgent updates" value={s.smsNotifs} onChange={v => set('smsNotifs', v)} />
        <Row icon={<Bell size={15} />} label="Push Notifications" desc="Browser notifications for real-time alerts" value={s.pushNotifs} onChange={v => set('pushNotifs', v)} />
        <Row icon={<MessageSquare size={15} />} label="Case Status Updates" desc="Notify me when my case status changes" value={s.caseUpdates} onChange={v => set('caseUpdates', v)} />
        <Row icon={<MessageSquare size={15} />} label="Message Alerts" desc="Notify me when I receive new messages" value={s.messageAlerts} onChange={v => set('messageAlerts', v)} />
        <Row icon={<BellOff size={15} />} label="Marketing Emails" desc="Receive updates about new platform features" value={s.marketing} onChange={v => set('marketing', v)} />
      </Section>

      {/* Privacy & Security */}
      <Section title="Privacy & Security" icon={<Lock size={16} color="#C8102E" />}>
        <Row icon={<Shield size={15} />} label="Two-Factor Authentication" desc="Add an extra layer of security to your account" value={s.twoFactor} onChange={v => set('twoFactor', v)} />
        <Row icon={<Lock size={15} />} label="Anonymous Reporting Mode" desc="Hide your identity when submitting reports by default" value={s.anonymousMode} onChange={v => set('anonymousMode', v)} />
        <Row icon={<Globe size={15} />} label="Anonymized Data Sharing" desc="Help improve the platform by sharing anonymized usage data" value={s.dataSharing} onChange={v => set('dataSharing', v)} />

        {/* Danger zone */}
        <div style={{
          background: '#FEF2F2', border: '1px solid rgba(200,16,46,0.15)',
          borderRadius: '10px', padding: '16px', marginTop: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
            <AlertTriangle size={14} color="#C8102E" />
            <span style={{ fontWeight: 700, fontSize: '13px', color: '#C8102E' }}>Danger Zone</span>
          </div>
          <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '14px', lineHeight: 1.5 }}>
            These actions are irreversible. Please be certain before proceeding.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="button" style={{
              background: 'white', border: '1.5px solid #C8102E', color: '#C8102E',
              borderRadius: '7px', padding: '8px 14px', fontSize: '12px',
              fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <Download size={13} /> Download My Data
            </button>
            <button type="button" style={{
              background: '#C8102E', color: 'white', border: 'none',
              borderRadius: '7px', padding: '8px 14px', fontSize: '12px',
              fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <Trash2 size={13} /> Delete Account
            </button>
          </div>
        </div>
      </Section>

      {/* Save */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F0FDF4', border: '1px solid rgba(0,102,0,0.2)', borderRadius: '8px', padding: '9px 14px', fontSize: '13px', color: '#059669', fontWeight: 600 }}>
            <CheckCircle2 size={15} /> Settings saved
          </div>
        )}
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000) }} style={{
          background: '#C8102E', color: 'white', border: 'none',
          borderRadius: '8px', padding: '11px 28px',
          fontWeight: 700, fontSize: '14px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '7px',
        }}>
          <CheckCircle2 size={15} /> Save Settings
        </button>
      </div>
    </div>
  )
}