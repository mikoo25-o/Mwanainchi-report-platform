'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Shield,
  ChevronLeft,
  Check,
  CheckCheck,
  Lock,
  MessageSquare,
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

function Avatar({
  initials,
  color,
  size = 40,
  online,
}: {
  initials: string
  color: string
  size?: number
  online?: boolean
}) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: size * 0.32,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      {online && (
        <div
          style={{
            position: 'absolute',
            bottom: 1,
            right: 1,
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid white',
          }}
        />
      )}
    </div>
  )
}

function conversationMeta(conv: Conversation) {
  if (conv.support_type === 'legal') {
    return {
      name: 'Legal Aid Team',
      avatar: 'LA',
      color: '#C8102E',
    }
  }

  if (conv.support_type === 'ai') {
    return {
      name: 'AI Legal Assistant',
      avatar: 'AI',
      color: '#006600',
    }
  }

  return {
    name: 'Mwanainchi Support',
    avatar: 'MS',
    color: '#006600',
  }
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
  const [aiThinking, setAiThinking] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const searchParams = useSearchParams()
  const requestedConversationId = searchParams.get('conversationId')

  const active = conversations.find((c) => c.id === activeId) || null
  const activeMeta = active ? conversationMeta(active) : null

  const loadConversations = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/messages?userId=${user.id}`)
      const data = await res.json()

      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Unable to load conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const loadMessages = useCallback(
    async (conversationId: string) => {
      if (!user) return

      setLoadingMessages(true)

      try {
        const res = await fetch(
          `/api/messages?userId=${user.id}&conversationId=${conversationId}`
        )

        const data = await res.json()

        setMessages(data.messages || [])
      } catch (error) {
        console.error('Unable to load messages:', error)
      } finally {
        setLoadingMessages(false)
      }
    },
    [user]
  )

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId)
    }
  }, [activeId, loadMessages])

  useEffect(() => {
    if (!loading && requestedConversationId && !activeId) {
      setActiveId(requestedConversationId)
      setMobileShowChat(true)
    }
  }, [loading, requestedConversationId, activeId])

  useEffect(() => {
    if (!activeId) return

    const channel = supabase
      .channel(`conversation:${activeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_messages',
          filter: `conversation_id=eq.${activeId}`,
        },
        (payload) => {
          const incomingMessage = payload.new as ConvMessage

          setMessages((previousMessages) => {
            const alreadyExists = previousMessages.some(
              (message) => message.id === incomingMessage.id
            )

            if (alreadyExists) return previousMessages

            return [...previousMessages, incomingMessage]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages.length, aiThinking])

  const sendMessage = async () => {
    if (!input.trim() || !activeId || !user || sending || !active) return

    const content = input.trim()

    setInput('')
    setSending(true)

    try {
      // 1. Save the user's message in Supabase
      const messageRes = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: activeId,
          senderId: user.id,
          content,
        }),
      })

      const messageData = await messageRes.json()

      if (!messageRes.ok) {
        throw new Error(messageData.error || 'Unable to send message')
      }

      // Add message immediately, while avoiding duplicates from realtime
      if (messageData.message) {
        setMessages((previousMessages) => {
          const alreadyExists = previousMessages.some(
            (message) => message.id === messageData.message.id
          )

          if (alreadyExists) return previousMessages

          return [...previousMessages, messageData.message]
        })
      }

      // Update sidebar order / latest preview
      loadConversations()

      // 2. Only AI conversations should call OpenAI
      if (active.support_type === 'ai') {
        setAiThinking(true)

        // Send the full visible conversation history to the AI
        const historyForAI = [
          ...messages,
          messageData.message,
        ]
          .filter(Boolean)
          .map((message: ConvMessage) => ({
            role:
              message.sender_type === 'user'
                ? 'user'
                : 'assistant',
            content: message.content,
          }))

        const aiRes = await fetch('/api/ai-legal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            conversationId: activeId,
            messages: historyForAI,
          }),
        })

        const aiData = await aiRes.json()

        if (!aiRes.ok) {
          throw new Error(aiData.error || 'AI assistant could not reply')
        }

        // The AI API saves its own reply in Supabase.
        // Add it immediately to screen too.
        if (aiData.message) {
          setMessages((previousMessages) => {
            const alreadyExists = previousMessages.some(
              (message) => message.id === aiData.message.id
            )

            if (alreadyExists) return previousMessages

            return [...previousMessages, aiData.message]
          })
        } else {
          // If the API only returns "response", reload messages from database.
          await loadMessages(activeId)
        }

        loadConversations()
      }
    } catch (error: any) {
      console.error('Send message error:', error)
      alert(error.message || 'Message could not be sent. Please try again.')
    } finally {
      setSending(false)
      setAiThinking(false)
    }
  }

  const filtered = conversations.filter((conversation) => {
    const meta = conversationMeta(conversation)

    const lastMessage =
      conversation.conversation_messages?.[
        conversation.conversation_messages.length - 1
      ]?.content || ''

    return (
      meta.name.toLowerCase().includes(search.toLowerCase()) ||
      lastMessage.toLowerCase().includes(search.toLowerCase())
    )
  })

  const formatTime = (iso: string) => {
    const date = new Date(iso)
    const now = new Date()

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-KE', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    return date.toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        height: 'calc(100vh - 108px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: 'clamp(20px, 3vw, 26px)',
            marginBottom: '2px',
          }}
        >
          Messages
        </h1>

        <p
          style={{
            color: '#6B7280',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Lock size={11} />
          Your conversations are private and secure.
        </p>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          border: '1px solid #E5E7EB',
          minHeight: 0,
          position: 'relative',
        }}
      >
        <div
          className="messages-sidebar"
          style={{
            width: '320px',
            flexShrink: 0,
            background: 'white',
            borderRight: '1px solid #F0F0F0',
            display: mobileShowChat ? 'none' : 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '16px', borderBottom: '1px solid #F0F0F0' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '16px' }}>Chats</span>

              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6B7280',
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <MoreVertical size={18} />
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#F5F5F5',
                borderRadius: '20px',
                padding: '8px 14px',
              }}
            >
              <Search size={14} color="#9CA3AF" />

              <input
                placeholder="Search conversations..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '13px',
                  width: '100%',
                  color: '#374151',
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: '8px 16px',
              background: '#F0FDF4',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'center',
            }}
          >
            <Lock size={11} color="#006600" />
            <span style={{ fontSize: '11px', color: '#006600', fontWeight: 500 }}>
              Secure conversations
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#9CA3AF',
                  fontSize: '13px',
                }}
              >
                Loading conversations...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <MessageSquare
                  size={32}
                  color="#D1D5DB"
                  style={{ margin: '0 auto 12px' }}
                />

                <p style={{ color: '#9CA3AF', fontSize: '13px', lineHeight: 1.5 }}>
                  No conversations yet.
                </p>
              </div>
            ) : (
              filtered.map((conversation) => {
                const meta = conversationMeta(conversation)

                const lastMessage =
                  conversation.conversation_messages?.[
                    conversation.conversation_messages.length - 1
                  ]

                const unread =
                  conversation.conversation_messages?.filter(
                    (message) =>
                      !message.is_read && message.sender_id !== user?.id
                  ).length || 0

                return (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      setActiveId(conversation.id)
                      setMobileShowChat(true)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      background:
                        activeId === conversation.id ? '#F0FDF4' : 'white',
                      borderLeft:
                        activeId === conversation.id
                          ? '3px solid #006600'
                          : '3px solid transparent',
                      borderBottom: '1px solid #F9F9F9',
                    }}
                  >
                    <Avatar initials={meta.avatar} color={meta.color} size={46} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          marginBottom: '3px',
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: '13.5px',
                            color: '#0A0A0A',
                          }}
                        >
                          {meta.name}
                        </span>

                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>
                          {lastMessage ? formatTime(lastMessage.created_at) : ''}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#6B7280',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '180px',
                          }}
                        >
                          {lastMessage?.content || 'No messages yet'}
                        </span>

                        {unread > 0 && (
                          <span
                            style={{
                              background: '#006600',
                              color: 'white',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              fontSize: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #F0F0F0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FAFAFA',
            }}
          >
            <Shield size={14} color="#C8102E" />
            <span style={{ fontSize: '11px', color: '#6B7280' }}>
              Your messages are private.
            </span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            position: 'relative',
          }}
        >
          {active && activeMeta ? (
            <>
              <div
                style={{
                  padding: '12px 20px',
                  background: 'white',
                  borderBottom: '1px solid #F0F0F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    className="mobile-back-btn"
                    onClick={() => setMobileShowChat(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#374151',
                      display: 'none',
                      padding: '4px',
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <Avatar
                    initials={activeMeta.avatar}
                    color={activeMeta.color}
                    size={40}
                    online={active.support_type === 'ai'}
                  />

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>
                      {activeMeta.name}
                    </div>

                    <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                      {active.support_type === 'ai'
                        ? aiThinking
                          ? 'Thinking...'
                          : 'AI Legal Assistant'
                        : 'Support'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button style={{ background: 'none', border: 'none', color: '#6B7280', padding: '8px' }}>
                    <Phone size={17} />
                  </button>

                  <button style={{ background: 'none', border: 'none', color: '#6B7280', padding: '8px' }}>
                    <Video size={17} />
                  </button>

                  <button style={{ background: 'none', border: 'none', color: '#6B7280', padding: '8px' }}>
                    <MoreVertical size={17} />
                  </button>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '20px',
                  background: '#F8F9FA',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(0,102,0,0.08)',
                      borderRadius: '12px',
                      padding: '6px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Lock size={11} color="#006600" />
                    <span style={{ fontSize: '11px', color: '#006600' }}>
                      Private conversation
                    </span>
                  </div>
                </div>

                {loadingMessages ? (
                  <div
                    style={{
                      textAlign: 'center',
                      color: '#9CA3AF',
                      fontSize: '13px',
                      padding: '20px',
                    }}
                  >
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      color: '#9CA3AF',
                      fontSize: '13px',
                      padding: '40px 20px',
                    }}
                  >
                    {active.support_type === 'ai'
                      ? 'Hello. Ask me a legal question and I will try to help.'
                      : 'No messages in this conversation yet.'}
                  </div>
                ) : (
                  messages.map((message) => {
                    const fromMe =
                      message.sender_id === user?.id &&
                      message.sender_type === 'user'

                    return (
                      <div
                        key={message.id}
                        style={{
                          display: 'flex',
                          justifyContent: fromMe ? 'flex-end' : 'flex-start',
                          marginBottom: '8px',
                        }}
                      >
                        {!fromMe && (
                          <div style={{ marginRight: '8px', marginTop: 'auto' }}>
                            <Avatar
                              initials={activeMeta.avatar}
                              color={activeMeta.color}
                              size={28}
                            />
                          </div>
                        )}

                        <div
                          style={{
                            maxWidth: '65%',
                            background: fromMe ? '#C8102E' : 'white',
                            color: fromMe ? 'white' : '#0A0A0A',
                            borderRadius: fromMe
                              ? '18px 18px 4px 18px'
                              : '18px 18px 18px 4px',
                            padding: '10px 14px',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                          }}
                        >
                          <p
                            style={{
                              fontSize: '13.5px',
                              lineHeight: 1.5,
                              margin: 0,
                              marginBottom: '4px',
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {message.content}
                          </p>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '4px',
                            }}
                          >
                            <span style={{ fontSize: '10px', opacity: 0.65 }}>
                              {formatTime(message.created_at)}
                            </span>

                            {fromMe &&
                              (message.is_read ? (
                                <CheckCheck size={12} style={{ opacity: 0.8 }} />
                              ) : (
                                <Check size={12} style={{ opacity: 0.6 }} />
                              ))}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}

                {aiThinking && active.support_type === 'ai' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '12px',
                    }}
                  >
                    <Avatar
                      initials={activeMeta.avatar}
                      color={activeMeta.color}
                      size={28}
                    />

                    <div
                      style={{
                        background: 'white',
                        borderRadius: '18px 18px 18px 4px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        color: '#6B7280',
                      }}
                    >
                      AI Legal Assistant is typing...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div
                style={{
                  padding: '12px 16px',
                  background: 'white',
                  borderTop: '1px solid #F0F0F0',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '10px',
                }}
              >
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    padding: '8px',
                    display: 'flex',
                  }}
                >
                  <Smile size={20} />
                </button>

                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    padding: '8px',
                    display: 'flex',
                  }}
                >
                  <Paperclip size={20} />
                </button>

                <div
                  style={{
                    flex: 1,
                    background: '#F5F5F5',
                    borderRadius: '24px',
                    padding: '10px 16px',
                    minHeight: '42px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <textarea
                    rows={1}
                    placeholder={
                      active.support_type === 'ai'
                        ? 'Ask a legal question...'
                        : 'Type a message...'
                    }
                    value={input}
                    disabled={sending || aiThinking}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault()
                        sendMessage()
                      }
                    }}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      fontSize: '13.5px',
                      width: '100%',
                      resize: 'none',
                      fontFamily: 'inherit',
                      color: '#374151',
                      lineHeight: 1.4,
                    }}
                  />
                </div>

                <button
                  onClick={sendMessage}
                  disabled={sending || aiThinking || !input.trim()}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: input.trim() && !sending && !aiThinking ? '#C8102E' : '#E5E7EB',
                    border: 'none',
                    cursor:
                      input.trim() && !sending && !aiThinking
                        ? 'pointer'
                        : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Send
                    size={17}
                    color={
                      input.trim() && !sending && !aiThinking
                        ? 'white'
                        : '#9CA3AF'
                    }
                  />
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                background: '#F8F9FA',
              }}
            >
              <Shield size={32} color="#006600" />

              <h2
                style={{
                  fontWeight: 700,
                  fontSize: '18px',
                  marginTop: '16px',
                  marginBottom: '8px',
                  color: '#374151',
                }}
              >
                Secure Messaging
              </h2>

              <p
                style={{
                  color: '#9CA3AF',
                  fontSize: '13px',
                  maxWidth: '300px',
                  textAlign: 'center',
                  lineHeight: 1.6,
                }}
              >
                Select a conversation from the left.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .messages-sidebar {
            display: ${mobileShowChat ? 'none' : 'flex'} !important;
            width: 100% !important;
          }

          .mobile-back-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  )
}