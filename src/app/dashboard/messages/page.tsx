'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search, Send, Phone, Video, MoreVertical,
  Paperclip, Smile, Shield, ChevronLeft,
  Check, CheckCheck, Lock, MessageSquare,
} from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthContext'
import { supabase } from '@/lib/supabase/client'

interface ConvMessage {
  id: string
  content: string
  sender_id: string
  sender_type: 'user' | 'support' | 'ai'
  is_read: boolean
  created_at: string
}

interface Conversation {
  id: string
  title: string | null
  support_type: 'platform' | 'legal' | 'ai'
  updated_at: string
  conversation_messages: ConvMessage[]
}

function Avatar({ initials, color, size = 40, online }: { initials: string; color: string; size?: number; online?: boolean }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontWeight: 700, fontSize: size * 0.32, flexShrink: 0,
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

function conversationMeta(conv: Conversation) {
  if (conv.support_type === 'legal') return { name: 'Legal Aid Team', avatar: 'LA', color: '#C8102E' }
  if (conv.support_type === 'ai') return { name: 'AI Legal Assistant', avatar: 'AI', color: '#006600' }
  return { name: 'Mwanainchi Support', avatar: 'MS', color: '#006600' }
}

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ConvMessage[]>([])
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const searchParams = useSearchParams()
  const requestedConversationId = searchParams.get('conversationId')
  const active = conversations.find(c => c.id === activeId) || null
  const activeMeta = active ? conversationMeta(active) : null

  // Fetch conversations on load
  useEffect(() => {
    if (!user) { setLoading(false); return }
    fetch(`/api/messages?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        setConversations(data.conversations || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user])

  // Fetch messages when conversation is selected
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!user) return
    setLoadingMessages(true)
    try {
      const res = await fetch(`/api/messages?userId=${user.id}&conversationId=${conversationId}`)
      const data = await res.json()
      setMessages(data.messages || [])
    } finally {
      setLoadingMessages(false)
    }
  }, [user])

  useEffect(() => {
    if (activeId) loadMessages(activeId)
  }, [activeId, loadMessages])

  useEffect(() => {
    if (!loading && requestedConversationId && !activeId) {
      setActiveId(requestedConversationId)
      setMobileShowChat(true)
    }
  }, [loading, requestedConversationId, activeId])

  // Realtime subscription for the active conversation
  useEffect(() => {
    if (!activeId) return
    const channel = supabase
      .channel(`conversation:${activeId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'conversation_messages',
        filter: `conversation_id=eq.${activeId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as ConvMessage])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [activeId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const sendMessage = async () => {
    if (!input.trim() || !activeId || !user || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeId, senderId: user.id, content }),
      })
      const data = await res.json()
      if (data.message) setMessages(prev => [...prev, data.message])
    } finally {
      setSending(false)
    }
  }

  const filtered = conversations.filter(c => {
    const meta = conversationMeta(c)
    const lastMsg = c.conversation_messages?.[c.conversation_messages.length - 1]?.content || ''
    return meta.name.toLowerCase().includes(search.toLowerCase()) ||
           lastMsg.toLowerCase().includes(search.toLowerCase())
  })

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    if (isToday) return d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })
  }

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
        border: '1px solid #E5E7EB', minHeight: 0, position: 'relative',
      }}>

        {/* ── SIDEBAR ── */}
        <div
          className="messages-sidebar"
          style={{
            width: '320px', flexShrink: 0, background: 'white',
            borderRight: '1px solid #F0F0F0',
            display: mobileShowChat ? 'none' : 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Sidebar header */}
          <div style={{ padding: '16px', borderBottom: '1px solid #F0F0F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#0A0A0A' }}>Chats</span>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: '4px' }}>
                <MoreVertical size={18} />
              </button>
            </div>
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
            {loading ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>
                Loading conversations...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <MessageSquare size={32} color="#D1D5DB" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: 1.5 }}>
                  No conversations yet. Once you report an incident or contact support, your chats will appear here.
                </p>
              </div>
            ) : filtered.map(conv => {
              const meta = conversationMeta(conv)
              const lastMsg = conv.conversation_messages?.[conv.conversation_messages.length - 1]
              const unread = conv.conversation_messages?.filter(m => !m.is_read && m.sender_id !== user?.id).length || 0
              return (
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
                  <Avatar initials={meta.avatar} color={meta.color} size={46} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13.5px', color: '#0A0A0A' }}>{meta.name}</span>
                      <span style={{ fontSize: '11px', color: unread > 0 ? '#006600' : '#9CA3AF', fontWeight: unread > 0 ? 600 : 400 }}>
                        {lastMsg ? formatTime(lastMsg.created_at) : ''}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                        {lastMsg?.content || 'No messages yet'}
                      </span>
                      {unread > 0 && (
                        <span style={{
                          background: '#006600', color: 'white', borderRadius: '50%',
                          width: '18px', height: '18px', fontSize: '10px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, flexShrink: 0,
                        }}>
                          {unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer notice */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: '8px', background: '#FAFAFA' }}>
            <Shield size={14} color="#C8102E" />
            <span style={{ fontSize: '11px', color: '#6B7280', lineHeight: 1.4 }}>
              Messages are only visible to you and authorised personnel.
            </span>
          </div>
        </div>

        {/* ── CHAT AREA ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
          {active && activeMeta ? (
            <>
              {/* Chat header */}
              <div style={{
                padding: '12px 20px', background: 'white',
                borderBottom: '1px solid #F0F0F0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)', zIndex: 2,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    className="mobile-back-btn"
                    onClick={() => setMobileShowChat(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151', display: 'none', padding: '4px' }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <Avatar initials={activeMeta.avatar} color={activeMeta.color} size={40} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0A0A0A' }}>{activeMeta.name}</div>
                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>
                      {active.support_type === 'ai' ? 'AI Assistant' : 'Support'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[<Phone size={17} key="p" />, <Video size={17} key="v" />, <MoreVertical size={17} key="m" />].map((icon, i) => (
                    <button key={i} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages area */}
              <div style={{
                flex: 1, overflowY: 'auto', padding: '20px',
                position: 'relative',
                backgroundImage: 'url(/dashboard-bg-light.png)',
                backgroundSize: 'cover', backgroundPosition: 'right top', backgroundRepeat: 'no-repeat',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(248,249,250,0.82)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{ background: 'rgba(0,102,0,0.08)', borderRadius: '12px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Lock size={11} color="#006600" />
                      <span style={{ fontSize: '11px', color: '#006600', fontWeight: 500 }}>
                        Messages are end-to-end encrypted
                      </span>
                    </div>
                  </div>

                  {loadingMessages ? (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '13px', padding: '20px' }}>
                      Loading messages...
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '13px', padding: '40px 20px' }}>
                      No messages in this conversation yet.
                    </div>
                  ) : messages.map(msg => {
                    const fromMe = msg.sender_id === user?.id && msg.sender_type === 'user'
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: fromMe ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
                        {!fromMe && (
                          <div style={{ marginRight: '8px', marginTop: 'auto' }}>
                            <Avatar initials={activeMeta.avatar} color={activeMeta.color} size={28} />
                          </div>
                        )}
                        <div style={{
                          maxWidth: '65%',
                          background: fromMe ? '#C8102E' : 'white',
                          color: fromMe ? 'white' : '#0A0A0A',
                          borderRadius: fromMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          padding: '10px 14px',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        }}>
                          <p style={{ fontSize: '13.5px', lineHeight: 1.5, margin: 0, marginBottom: '4px' }}>
                            {msg.content}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                            <span style={{ fontSize: '10px', opacity: 0.65 }}>{formatTime(msg.created_at)}</span>
                            {fromMe && (
                              msg.is_read
                                ? <CheckCheck size={12} style={{ opacity: 0.8 }} />
                                : <Check size={12} style={{ opacity: 0.6 }} />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
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
                  disabled={sending || !input.trim()}
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
            /* Empty state — nothing selected */
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', padding: '40px',
              backgroundImage: 'url(/dashboard-bg-light.png)',
              backgroundSize: 'cover', backgroundPosition: 'right top', position: 'relative',
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