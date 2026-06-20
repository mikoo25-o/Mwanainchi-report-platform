'use client'
import React, { useState, useRef, useEffect } from 'react'
import {
  Search, Send, Phone, Video, MoreVertical,
  Paperclip, Smile, Shield, ChevronLeft,
  Check, CheckCheck, Lock, Circle,
} from 'lucide-react'

interface Message {
  id: number
  text: string
  time: string
  fromMe: boolean
  status: 'sent' | 'delivered' | 'read'
}

interface Conversation {
  id: number
  name: string
  role: string
  avatar: string
  color: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
  messages: Message[]
}

const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: 'Mwanainchi Support',
    role: 'Platform Support',
    avatar: 'MS',
    color: '#006600',
    lastMessage: 'Your account has been created successfully.',
    time: 'Just now',
    unread: 1,
    online: true,
    messages: [
      { id: 1, text: 'Welcome to Mwanainchi Report. Your account has been created successfully.', time: '10:00 AM', fromMe: false, status: 'read' },
      { id: 2, text: 'You can now report incidents, upload evidence, and connect with legal professionals.', time: '10:00 AM', fromMe: false, status: 'read' },
      { id: 3, text: 'Your identity and data are fully protected. Feel free to reach out if you need help.', time: '10:01 AM', fromMe: false, status: 'read' },
    ],
  },
  {
    id: 2,
    name: 'Legal Aid Team',
    role: 'Legal Assistance',
    avatar: 'LA',
    color: '#C8102E',
    lastMessage: 'We have reviewed your case and will assign a lawyer shortly.',
    time: 'Yesterday',
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: 'Hello, we have received your incident report.', time: 'Yesterday 2:15 PM', fromMe: false, status: 'read' },
      { id: 2, text: 'Thank you. When will someone be assigned to my case?', time: 'Yesterday 2:20 PM', fromMe: true, status: 'read' },
      { id: 3, text: 'We have reviewed your case and will assign a lawyer shortly.', time: 'Yesterday 2:45 PM', fromMe: false, status: 'read' },
    ],
  },
]

function Avatar({ initials, color, size = 40, online }: { initials: string; color: string; size?: number; online?: boolean }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: 700, fontSize: size * 0.32,
        flexShrink: 0,
      }}>
        {initials}
      </div>
      {online && (
        <div style={{
          position: 'absolute', bottom: 1, right: 1,
          width: size * 0.28, height: size * 0.28, borderRadius: '50%',
          background: '#22c55e', border: '2px solid white',
        }} />
      )}
    </div>
  )
}

export default function MessagesPage() {
  const [activeId, setActiveId] = useState<number | null>(1)
  const [input, setInput] = useState('')
  const [conversations, setConversations] = useState(CONVERSATIONS)
  const [search, setSearch] = useState('')
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const active = conversations.find(c => c.id === activeId) || null

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.messages.length])

  const sendMessage = () => {
    if (!input.trim() || !activeId) return
    const now = new Date()
    const time = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
    setConversations(prev => prev.map(c =>
      c.id === activeId
        ? { ...c, lastMessage: input, time: 'Just now', messages: [...c.messages, { id: Date.now(), text: input, time, fromMe: true, status: 'sent' }] }
        : c
    ))
    setInput('')
  }

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{
      maxWidth: '1200px', margin: '0 auto',
      height: 'calc(100vh - 108px)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: 'clamp(20px,3vw,26px)', marginBottom: '2px' }}>
          Messages
        </h1>
        <p style={{ color: '#6B7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Lock size={11} /> End-to-end encrypted. Your conversations are private and secure.
        </p>
      </div>

      <div style={{
        flex: 1, display: 'flex', borderRadius: '16px',
        overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB', minHeight: 0,
        position: 'relative',
      }}>

        {/* ── SIDEBAR ── */}
        <div style={{
          width: '320px', flexShrink: 0,
          background: 'white',
          borderRight: '1px solid #F0F0F0',
          display: 'flex', flexDirection: 'column',
          ...(mobileShowChat ? { display: 'none' } : {}),
        }}
          className="messages-sidebar"
        >
          {/* Sidebar header */}
          <div style={{ padding: '16px', borderBottom: '1px solid #F0F0F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#0A0A0A' }}>Chats</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: '4px' }}>
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
            {/* Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F5F5F5', borderRadius: '20px', padding: '8px 14px' }}>
              <Search size={14} color="#9CA3AF" />
              <input
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', width: '100%', color: '#374151' }}
              />
            </div>
          </div>

          {/* Encryption notice */}
          <div style={{ padding: '8px 16px', background: '#F0FDF4', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
            <Lock size={11} color="#006600" />
            <span style={{ fontSize: '11px', color: '#006600', fontWeight: 500 }}>End-to-end encrypted</span>
          </div>

          {/* Conversation list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
                No conversations found
              </div>
            ) : filtered.map(conv => (
              <div
                key={conv.id}
                onClick={() => { setActiveId(conv.id); setMobileShowChat(true) }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 16px', cursor: 'pointer',
                  background: activeId === conv.id ? '#F0FDF4' : 'white',
                  borderLeft: activeId === conv.id ? '3px solid #006600' : '3px solid transparent',
                  borderBottom: '1px solid #F9F9F9',
                  transition: 'background 0.15s',
                }}
              >
                <Avatar initials={conv.avatar} color={conv.color} size={46} online={conv.online} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#0A0A0A' }}>{conv.name}</span>
                    <span style={{ fontSize: '11px', color: conv.unread > 0 ? '#006600' : '#9CA3AF', fontWeight: conv.unread > 0 ? 600 : 400 }}>
                      {conv.time}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                      {conv.lastMessage}
                    </span>
                    {conv.unread > 0 && (
                      <span style={{
                        background: '#006600', color: 'white', borderRadius: '50%',
                        width: '18px', height: '18px', fontSize: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, flexShrink: 0,
                      }}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shield notice */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: '8px', background: '#FAFAFA' }}>
            <Shield size={14} color="#C8102E" />
            <span style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.4 }}>
              Messages are only visible to you and authorised personnel.
            </span>
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
          position: 'relative',
          ...(mobileShowChat === false ? {} : {}),
        }}>
          {active ? (
            <>
              {/* Chat header */}
              <div style={{
                padding: '12px 20px', background: 'white',
                borderBottom: '1px solid #F0F0F0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                zIndex: 2,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    className="mobile-back-btn"
                    onClick={() => setMobileShowChat(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151', display: 'none', padding: '4px' }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <Avatar initials={active.avatar} color={active.color} size={40} online={active.online} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0A0A0A' }}>{active.name}</div>
                    <div style={{ fontSize: '11px', color: active.online ? '#22c55e' : '#9CA3AF', fontWeight: 500 }}>
                      {active.online ? 'Online' : 'Offline'} · {active.role}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[<Phone size={17} />, <Video size={17} />, <MoreVertical size={17} />].map((icon, i) => (
                    <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages area — bg image */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '20px',
                position: 'relative',
                backgroundImage: 'url(/dashboard-bg-light.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'right top',
                backgroundRepeat: 'no-repeat',
              }}>
                {/* Light overlay so messages read clearly */}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(248,249,250,0.82)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  {/* Date separator */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                    <span style={{ fontSize: '11px', color: '#9CA3AF', background: 'rgba(255,255,255,0.8)', padding: '3px 10px', borderRadius: '10px', fontWeight: 500 }}>
                      Today
                    </span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.08)' }} />
                  </div>

                  {/* Encryption notice in chat */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{ background: 'rgba(0,102,0,0.08)', borderRadius: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Lock size={11} color="#006600" />
                      <span style={{ fontSize: '11px', color: '#006600', fontWeight: 500 }}>
                        Messages are end-to-end encrypted
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  {active.messages.map(msg => (
                    <div key={msg.id} style={{
                      display: 'flex',
                      justifyContent: msg.fromMe ? 'flex-end' : 'flex-start',
                      marginBottom: '8px',
                    }}>
                      {!msg.fromMe && (
                        <div style={{ marginRight: '8px', marginTop: 'auto' }}>
                          <Avatar initials={active.avatar} color={active.color} size={28} />
                        </div>
                      )}
                      <div style={{
                        maxWidth: '65%',
                        background: msg.fromMe ? '#C8102E' : 'white',
                        color: msg.fromMe ? 'white' : '#0A0A0A',
                        borderRadius: msg.fromMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        padding: '10px 14px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        position: 'relative',
                      }}>
                        <p style={{ fontSize: '13.5px', lineHeight: 1.5, margin: 0, marginBottom: '4px' }}>
                          {msg.text}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                          <span style={{ fontSize: '10px', opacity: 0.65 }}>{msg.time}</span>
                          {msg.fromMe && (
                            msg.status === 'read'
                              ? <CheckCheck size={12} style={{ opacity: 0.8 }} />
                              : <Check size={12} style={{ opacity: 0.6 }} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input bar */}
              <div style={{
                padding: '12px 16px', background: 'white',
                borderTop: '1px solid #F0F0F0',
                display: 'flex', alignItems: 'flex-end', gap: '10px',
              }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '8px', display: 'flex', flexShrink: 0 }}>
                  <Smile size={20} />
                </button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '8px', display: 'flex', flexShrink: 0 }}>
                  <Paperclip size={20} />
                </button>
                <div style={{ flex: 1, background: '#F5F5F5', borderRadius: '24px', padding: '10px 16px', minHeight: '42px', display: 'flex', alignItems: 'center' }}>
                  <textarea
                    rows={1}
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                    style={{
                      border: 'none', background: 'transparent', outline: 'none',
                      fontSize: '13.5px', width: '100%', resize: 'none',
                      fontFamily: 'inherit', color: '#374151', lineHeight: 1.4,
                    }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  style={{
                    width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                    background: input.trim() ? '#C8102E' : '#E5E7EB',
                    border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                >
                  <Send size={17} color={input.trim() ? 'white' : '#9CA3AF'} />
                </button>
              </div>
            </>
          ) : (
            /* Empty state */
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', padding: '40px',
              backgroundImage: 'url(/dashboard-bg-light.png)',
              backgroundSize: 'cover', backgroundPosition: 'right top',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(248,249,250,0.88)' }} />
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#F0FDF4', border: '2px solid rgba(0,102,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Shield size={32} color="#006600" strokeWidth={1.5} />
                </div>
                <h2 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px', color: '#374151' }}>
                  Secure Messaging
                </h2>
                <p style={{ color: '#9CA3AF', fontSize: '13px', maxWidth: '300px', lineHeight: 1.6 }}>
                  Select a conversation from the left to start messaging your legal team securely.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .messages-sidebar { display: ${mobileShowChat ? 'none' : 'flex'} !important; width: 100% !important; }
          .mobile-back-btn { display: flex !important; }
        }
      `}</style>
    </div>
  )
}