'use client'
import React, { useState } from 'react'
import {
  User, Mail, Phone, MapPin, Save,
  UserPlus, Shield, CheckCircle2, Camera,
  AlertCircle, Lock,
} from 'lucide-react'

const COUNTIES = [
  'Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika',
  'Machakos','Nyeri','Meru','Embu','Garissa','Kakamega',
  'Kisii','Kitale','Malindi','Kiambu',"Murang'a",'Other',
]

export default function ProfilePage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', county: '', bio: '',
  })
  const [saved, setSaved] = useState(false)
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>([])
  const [newContact, setNewContact] = useState({ name: '', phone: '' })
  const [addingContact, setAddingContact] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const initials = form.firstName && form.lastName
    ? `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()
    : 'MR'

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 'clamp(22px,3vw,28px)', marginBottom: '4px' }}>
          My Profile
        </h1>
        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          Manage your personal information and account preferences.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Left — avatar + stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            {/* Avatar */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '14px' }}>
              <div style={{
                width: '88px', height: '88px', borderRadius: '50%',
                background: 'linear-gradient(135deg,#C8102E,#8B0000)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto', position: 'relative',
              }}>
                <span style={{ color: 'white', fontWeight: 800, fontSize: '28px' }}>{initials}</span>
              </div>
              <button style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '28px', height: '28px', borderRadius: '50%',
                background: '#C8102E', border: '2px solid white',
                color: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Camera size={13} />
              </button>
            </div>

            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px', color: '#0A0A0A' }}>
              {form.firstName || form.lastName
                ? `${form.firstName} ${form.lastName}`.trim()
                : 'Your Name'}
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '14px' }}>
              {form.county || 'Kenya'}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              background: '#F0FDF4', color: '#059669',
              borderRadius: '20px', padding: '4px 12px',
              fontSize: '11px', fontWeight: 600,
            }}>
              <CheckCircle2 size={12} /> Verified Account
            </div>
          </div>

          {/* Account stats */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '13px', marginBottom: '14px', color: '#374151' }}>Account Overview</h3>
            {[
              { label: 'Member Since', value: new Date().toLocaleDateString('en-KE', { month: 'short', year: 'numeric' }), icon: <CheckCircle2 size={12} color="#9CA3AF" /> },
              { label: 'Total Cases', value: '0', icon: <Shield size={12} color="#9CA3AF" /> },
              { label: 'Evidence Files', value: '0', icon: <Lock size={12} color="#9CA3AF" /> },
              { label: 'Account Status', value: 'Active', icon: <AlertCircle size={12} color="#059669" /> },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F3F4F6', fontSize: '12px' }}>
                <span style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '5px' }}>{icon} {label}</span>
                <span style={{ fontWeight: 600, color: '#0A0A0A' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div>
          <form onSubmit={handleSave}>

            {/* Personal info */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #F3F4F6' }}>
                <User size={16} color="#C8102E" />
                <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#0A0A0A' }}>Personal Information</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                {[
                  { key: 'firstName', label: 'First Name', placeholder: 'John', icon: <User size={14} color="#9CA3AF" /> },
                  { key: 'lastName', label: 'Last Name', placeholder: 'Kamau', icon: <User size={14} color="#9CA3AF" /> },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>{f.label}</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>{f.icon}</div>
                      <input
                        type="text" placeholder={f.placeholder}
                        value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)}
                        style={{ width: '100%', padding: '9px 12px 9px 32px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}><Mail size={14} color="#9CA3AF" /></div>
                  <input type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => set('email', e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 32px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}><Phone size={14} color="#9CA3AF" /></div>
                    <input type="tel" placeholder="+254 7XX XXX XXX"
                      value={form.phone} onChange={e => set('phone', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px 9px 32px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>County</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}><MapPin size={14} color="#9CA3AF" /></div>
                    <select value={form.county} onChange={e => set('county', e.target.value)}
                      style={{ width: '100%', padding: '9px 12px 9px 32px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', background: 'white', appearance: 'none' }}>
                      <option value="">Select county...</option>
                      {COUNTIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Brief Description (Optional)</label>
                <textarea placeholder="A brief description of yourself..."
                  value={form.bio} onChange={e => set('bio', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit', minHeight: '80px', resize: 'vertical' }} />
              </div>
            </div>

            {/* Trusted contacts */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '14px', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} color="#C8102E" />
                  <h2 style={{ fontWeight: 700, fontSize: '15px' }}>Trusted Emergency Contacts</h2>
                </div>
                <button type="button" onClick={() => setAddingContact(true)} style={{
                  background: '#C8102E', color: 'white', border: 'none',
                  borderRadius: '7px', padding: '6px 12px', fontSize: '12px',
                  fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <UserPlus size={13} /> Add Contact
                </button>
              </div>

              <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '16px', lineHeight: 1.5 }}>
                These people will be notified immediately when you press the SOS button.
              </p>

              {contacts.length === 0 && !addingContact ? (
                <div style={{ border: '1.5px dashed #E5E7EB', borderRadius: '10px', padding: '24px', textAlign: 'center' }}>
                  <UserPlus size={28} color="#D1D5DB" style={{ margin: '0 auto 8px' }} />
                  <p style={{ color: '#9CA3AF', fontSize: '13px' }}>No trusted contacts added yet</p>
                </div>
              ) : (
                <>
                  {contacts.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#F8F9FA', borderRadius: '8px', marginBottom: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#006600', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                        {c.name[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{c.name}</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF' }}>{c.phone}</div>
                      </div>
                      <button type="button" onClick={() => setContacts(contacts.filter((_, j) => j !== i))}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>
                        ×
                      </button>
                    </div>
                  ))}
                </>
              )}

              {addingContact && (
                <div style={{ background: '#F8F9FA', borderRadius: '10px', padding: '14px', marginTop: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input placeholder="Contact name" value={newContact.name}
                      onChange={e => setNewContact(n => ({ ...n, name: e.target.value }))}
                      style={{ padding: '8px 12px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                    <input placeholder="+254 7XX XXX XXX" value={newContact.phone}
                      onChange={e => setNewContact(n => ({ ...n, phone: e.target.value }))}
                      style={{ padding: '8px 12px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => {
                      if (newContact.name && newContact.phone) {
                        setContacts([...contacts, newContact])
                        setNewContact({ name: '', phone: '' })
                        setAddingContact(false)
                      }
                    }} style={{
                      background: '#006600', color: 'white', border: 'none', borderRadius: '7px',
                      padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    }}>
                      Save
                    </button>
                    <button type="button" onClick={() => setAddingContact(false)} style={{
                      background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: '7px',
                      padding: '7px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Save */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
              {saved && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F0FDF4', border: '1px solid rgba(0,102,0,0.2)', borderRadius: '8px', padding: '9px 14px', fontSize: '13px', color: '#059669', fontWeight: 600 }}>
                  <CheckCircle2 size={15} /> Changes saved
                </div>
              )}
              <button type="submit" style={{
                background: '#C8102E', color: 'white', border: 'none',
                borderRadius: '8px', padding: '11px 28px',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '7px',
              }}>
                <Save size={15} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}