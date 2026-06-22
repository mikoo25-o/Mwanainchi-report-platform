'use client'

import React, { useEffect, useState } from 'react'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  UserPlus,
  Shield,
  CheckCircle2,
  Camera,
  AlertCircle,
  Lock,
  Loader2,
  Trash2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
  'Machakos', 'Nyeri', 'Meru', 'Embu', 'Garissa', 'Kakamega',
  'Kisii', 'Kitale', 'Malindi', 'Kiambu', "Murang'a", 'Other',
]

type ProfileForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  county: string
  bio: string
}

type TrustedContact = {
  id: string
  name: string
  phone: string
  relationship: string | null
}

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    county: '',
    bio: '',
  })

  const [contacts, setContacts] = useState<TrustedContact[]>([])
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: '',
  })

  const [userId, setUserId] = useState<string | null>(null)
  const [memberSince, setMemberSince] = useState('')
  const [caseCount, setCaseCount] = useState(0)
  const [evidenceCount, setEvidenceCount] = useState(0)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [addingContact, setAddingContact] = useState(false)
  const [savingContact, setSavingContact] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const set = (key: keyof ProfileForm, value: string) => {
    setForm(current => ({ ...current, [key]: value }))
  }

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      setError('')

      const { data: authData, error: authError } = await supabase.auth.getUser()

      if (authError || !authData.user) {
        setError('You are not signed in. Please log in again.')
        setLoading(false)
        return
      }

      const user = authData.user
      setUserId(user.id)

      setMemberSince(
        new Date(user.created_at).toLocaleDateString('en-KE', {
          month: 'short',
          year: 'numeric',
        })
      )

      const [
        profileResult,
        contactsResult,
        casesResult,
        evidenceResult,
      ] = await Promise.all([
        supabase
          .from('profiles')
          .select('first_name, last_name, email, phone, county, bio')
          .eq('id', user.id)
          .single(),

        supabase
          .from('trusted_contacts')
          .select('id, name, phone, relationship')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),

        supabase
          .from('cases')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),

        supabase
          .from('evidence')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
      ])

      if (profileResult.error && profileResult.error.code !== 'PGRST116') {
        setError(`Could not load profile: ${profileResult.error.message}`)
      }

      if (profileResult.data) {
        setForm({
          firstName: profileResult.data.first_name || '',
          lastName: profileResult.data.last_name || '',
          email: profileResult.data.email || user.email || '',
          phone: profileResult.data.phone || '',
          county: profileResult.data.county || '',
          bio: profileResult.data.bio || '',
        })
      } else {
        setForm(current => ({
          ...current,
          email: user.email || '',
        }))
      }

      if (contactsResult.error) {
        setError(`Could not load trusted contacts: ${contactsResult.error.message}`)
      } else {
        setContacts(contactsResult.data || [])
      }

      setCaseCount(casesResult.count || 0)
      setEvidenceCount(evidenceResult.count || 0)
      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!userId) {
      setError('No signed-in user was found. Please log in again.')
      return
    }

    setSaving(true)
    setError('')
    setMessage('')
    setSaved(false)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: form.firstName.trim() || null,
        last_name: form.lastName.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        county: form.county || null,
        bio: form.bio.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    setSaving(false)

    if (updateError) {
      setError(`Profile could not be saved: ${updateError.message}`)
      return
    }

    setSaved(true)
    setMessage('Your profile details have been saved successfully.')

    window.setTimeout(() => {
      setSaved(false)
      setMessage('')
    }, 3500)
  }

  const addTrustedContact = async () => {
    if (!userId) {
      setError('No signed-in user was found. Please log in again.')
      return
    }

    if (!newContact.name.trim() || !newContact.phone.trim()) {
      setError('Please enter both the contact name and phone number.')
      return
    }

    setSavingContact(true)
    setError('')

    const { data, error: contactError } = await supabase
      .from('trusted_contacts')
      .insert({
        user_id: userId,
        name: newContact.name.trim(),
        phone: newContact.phone.trim(),
        relationship: newContact.relationship.trim() || null,
      })
      .select('id, name, phone, relationship')
      .single()

    setSavingContact(false)

    if (contactError) {
      setError(`Contact could not be saved: ${contactError.message}`)
      return
    }

    if (data) {
      setContacts(current => [data, ...current])
    }

    setNewContact({ name: '', phone: '', relationship: '' })
    setAddingContact(false)
    setMessage('Trusted contact added successfully.')

    window.setTimeout(() => setMessage(''), 3000)
  }

  const deleteTrustedContact = async (contactId: string) => {
    const confirmed = window.confirm('Remove this trusted contact?')
    if (!confirmed) return

    setError('')

    const { error: deleteError } = await supabase
      .from('trusted_contacts')
      .delete()
      .eq('id', contactId)

    if (deleteError) {
      setError(`Contact could not be removed: ${deleteError.message}`)
      return
    }

    setContacts(current => current.filter(contact => contact.id !== contactId))
    setMessage('Trusted contact removed.')

    window.setTimeout(() => setMessage(''), 3000)
  }

  const initials =
    form.firstName && form.lastName
      ? `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()
      : form.firstName
        ? form.firstName[0].toUpperCase()
        : form.email
          ? form.email[0].toUpperCase()
          : 'MR'

  if (loading) {
    return (
      <div style={{
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        color: '#6B7280',
        fontSize: '14px',
      }}>
        <Loader2 size={20} className="animate-spin" />
        Loading your profile...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontFamily: "'Playfair Display',serif",
          fontWeight: 800,
          fontSize: 'clamp(22px,3vw,28px)',
          marginBottom: '4px',
        }}>
          My Profile
        </h1>
        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          Manage your personal information and trusted emergency contacts.
        </p>
      </div>

      {error && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 14px',
          borderRadius: '8px',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#B91C1C',
          fontSize: '13px',
        }}>
          {error}
        </div>
      )}

      {message && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 14px',
          borderRadius: '8px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          color: '#047857',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
        }}>
          <CheckCircle2 size={16} />
          {message}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '220px minmax(0, 1fr)',
        gap: '20px',
        alignItems: 'start',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '14px' }}>
              <div style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#C8102E,#8B0000)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontWeight: 800, fontSize: '28px' }}>
                  {initials}
                </span>
              </div>

              <button
                type="button"
                title="Profile photo upload will be added later"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#C8102E',
                  border: '2px solid white',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
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
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: '#F0FDF4',
              color: '#059669',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 600,
            }}>
              <CheckCircle2 size={12} />
              Verified Account
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '14px',
            padding: '18px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}>
            <h3 style={{ fontWeight: 700, fontSize: '13px', marginBottom: '14px', color: '#374151' }}>
              Account Overview
            </h3>

            {[
              {
                label: 'Member Since',
                value: memberSince || '—',
                icon: <CheckCircle2 size={12} color="#9CA3AF" />,
              },
              {
                label: 'Total Cases',
                value: String(caseCount),
                icon: <Shield size={12} color="#9CA3AF" />,
              },
              {
                label: 'Evidence Files',
                value: String(evidenceCount),
                icon: <Lock size={12} color="#9CA3AF" />,
              },
              {
                label: 'Account Status',
                value: 'Active',
                icon: <AlertCircle size={12} color="#059669" />,
              },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid #F3F4F6',
                fontSize: '12px',
              }}>
                <span style={{
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}>
                  {icon}
                  {label}
                </span>
                <span style={{ fontWeight: 600, color: '#0A0A0A' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <form onSubmit={handleSave}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              marginBottom: '16px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                paddingBottom: '14px',
                borderBottom: '1px solid #F3F4F6',
              }}>
                <User size={16} color="#C8102E" />
                <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#0A0A0A' }}>
                  Personal Information
                </h2>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '14px',
                marginBottom: '14px',
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                    First Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                      <User size={14} color="#9CA3AF" />
                    </div>
                    <input
                      type="text"
                      placeholder="John"
                      value={form.firstName}
                      onChange={event => set('firstName', event.target.value)}
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                    Last Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                      <User size={14} color="#9CA3AF" />
                    </div>
                    <input
                      type="text"
                      placeholder="Kamau"
                      value={form.lastName}
                      onChange={event => set('lastName', event.target.value)}
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
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                    <Mail size={14} color="#9CA3AF" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={event => set('email', event.target.value)}
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

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '14px',
                marginBottom: '14px',
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                    Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Phone size={14} color="#9CA3AF" />
                    </div>
                    <input
                      type="tel"
                      placeholder="+254 7XX XXX XXX"
                      value={form.phone}
                      onChange={event => set('phone', event.target.value)}
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                    County
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                      <MapPin size={14} color="#9CA3AF" />
                    </div>
                    <select
                      value={form.county}
                      onChange={event => set('county', event.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 32px',
                        border: '1.5px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        background: 'white',
                      }}
                    >
                      <option value="">Select county...</option>
                      {COUNTIES.map(county => (
                        <option key={county} value={county}>
                          {county}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                  Brief Description (Optional)
                </label>
                <textarea
                  placeholder="A brief description of yourself..."
                  value={form.bio}
                  onChange={event => set('bio', event.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1.5px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    minHeight: '80px',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              marginBottom: '16px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                paddingBottom: '14px',
                borderBottom: '1px solid #F3F4F6',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} color="#C8102E" />
                  <h2 style={{ fontWeight: 700, fontSize: '15px' }}>
                    Trusted Emergency Contacts
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setAddingContact(true)}
                  style={{
                    background: '#C8102E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '7px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <UserPlus size={13} />
                  Add Contact
                </button>
              </div>

              <p style={{ color: '#6B7280', fontSize: '12px', marginBottom: '16px', lineHeight: 1.5 }}>
                These people will be notified when you press the SOS button.
              </p>

              {contacts.length === 0 && !addingContact && (
                <div style={{
                  border: '1.5px dashed #E5E7EB',
                  borderRadius: '10px',
                  padding: '24px',
                  textAlign: 'center',
                }}>
                  <UserPlus size={28} color="#D1D5DB" style={{ margin: '0 auto 8px' }} />
                  <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
                    No trusted contacts added yet
                  </p>
                </div>
              )}

              {contacts.map(contact => (
                <div
                  key={contact.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    background: '#F8F9FA',
                    borderRadius: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#006600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {contact.name.charAt(0).toUpperCase()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{contact.name}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                      {contact.phone}
                      {contact.relationship ? ` · ${contact.relationship}` : ''}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteTrustedContact(contact.id)}
                    title="Remove contact"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {addingContact && (
                <div style={{
                  background: '#F8F9FA',
                  borderRadius: '10px',
                  padding: '14px',
                  marginTop: '12px',
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '10px',
                  }}>
                    <input
                      placeholder="Contact name"
                      value={newContact.name}
                      onChange={event => setNewContact(current => ({
                        ...current,
                        name: event.target.value,
                      }))}
                      style={{
                        padding: '8px 12px',
                        border: '1.5px solid #E5E7EB',
                        borderRadius: '7px',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />

                    <input
                      placeholder="+254 7XX XXX XXX"
                      value={newContact.phone}
                      onChange={event => setNewContact(current => ({
                        ...current,
                        phone: event.target.value,
                      }))}
                      style={{
                        padding: '8px 12px',
                        border: '1.5px solid #E5E7EB',
                        borderRadius: '7px',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  <input
                    placeholder="Relationship (optional), e.g. Parent"
                    value={newContact.relationship}
                    onChange={event => setNewContact(current => ({
                      ...current,
                      relationship: event.target.value,
                    }))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1.5px solid #E5E7EB',
                      borderRadius: '7px',
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: 'inherit',
                      marginBottom: '10px',
                    }}
                  />

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={addTrustedContact}
                      disabled={savingContact}
                      style={{
                        background: '#006600',
                        color: 'white',
                        border: 'none',
                        borderRadius: '7px',
                        padding: '7px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: savingContact ? 'not-allowed' : 'pointer',
                        opacity: savingContact ? 0.7 : 1,
                      }}
                    >
                      {savingContact ? 'Saving...' : 'Save Contact'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAddingContact(false)
                        setNewContact({ name: '', phone: '', relationship: '' })
                      }}
                      style={{
                        background: '#F3F4F6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '7px',
                        padding: '7px 14px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '12px',
            }}>
              {saved && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#F0FDF4',
                  border: '1px solid rgba(0,102,0,0.2)',
                  borderRadius: '8px',
                  padding: '9px 14px',
                  fontSize: '13px',
                  color: '#059669',
                  fontWeight: 600,
                }}>
                  <CheckCircle2 size={15} />
                  Changes saved
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                style={{
                  background: '#C8102E',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px 28px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                }}
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}