'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import {
  Siren,
  Mic,
  Video,
  Smartphone,
  Package,
  Scale,
  CheckCircle2,
  UserPlus,
  Phone,
  ShieldAlert,
  Flame,
  AlertTriangle,
  XCircle,
  Loader2,
  Camera,
  MapPin,
} from 'lucide-react'

const EMERGENCY_CONTACTS = [
  {
    label: 'Police Emergency',
    number: '999',
    color: '#2563EB',
    bg: '#EFF6FF',
    icon: <ShieldAlert size={22} color="#2563EB" />,
  },
  {
    label: 'Alternative Emergency',
    number: '112',
    color: '#059669',
    bg: '#F0FDF4',
    icon: <Phone size={22} color="#059669" />,
  },
  {
    label: 'Fire Brigade',
    number: '999',
    color: '#D97706',
    bg: '#FFFBEB',
    icon: <Flame size={22} color="#D97706" />,
  },
  {
    label: 'Gender Violence Support',
    number: '1195',
    color: '#7C3AED',
    bg: '#F5F3FF',
    icon: <AlertTriangle size={22} color="#7C3AED" />,
  },
]

const SOS_ACTIONS = [
  {
    icon: <MapPin size={18} color="#C8102E" />,
    bg: '#FEF2F2',
    title: 'Location Captured',
    desc: 'Your GPS coordinates are recorded when permission is granted.',
  },
  {
    icon: <Mic size={18} color="#C8102E" />,
    bg: '#FEF2F2',
    title: 'Audio Recording',
    desc: 'Audio is recorded after you allow microphone access.',
  },
  {
    icon: <Video size={18} color="#C8102E" />,
    bg: '#FEF2F2',
    title: 'Video Recording',
    desc: 'Camera recording begins after you allow camera access.',
  },
  {
    icon: <Smartphone size={18} color="#C8102E" />,
    bg: '#FEF2F2',
    title: 'Emergency Case',
    desc: 'An emergency case is created in your account.',
  },
  {
    icon: <Package size={18} color="#C8102E" />,
    bg: '#FEF2F2',
    title: 'Evidence Ready',
    desc: 'The recording is prepared for evidence upload after you stop SOS.',
  },
  {
    icon: <Scale size={18} color="#C8102E" />,
    bg: '#FEF2F2',
    title: 'Legal Support',
    desc: 'Your case can later be reviewed by the legal support team.',
  },
]

type CapturedLocation = {
  latitude: number
  longitude: number
  accuracy: number
}

export default function EmergencyPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const [sosActive, setSosActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [location, setLocation] = useState<CapturedLocation | null>(null)
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null)
  const [caseId, setCaseId] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      stopCameraTracks()

      if (recordedVideo) {
        URL.revokeObjectURL(recordedVideo)
      }
    }
  }, [recordedVideo])

  const stopCameraTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const captureLocation = async (): Promise<CapturedLocation | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setStatus('Location is not supported on this device.')
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const capturedLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }

          setLocation(capturedLocation)
          resolve(capturedLocation)
        },
        () => {
          setStatus(
            'Location permission was not granted. You can still call emergency services.'
          )
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      )
    })
  }

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error(
        'Camera and microphone recording require HTTPS or localhost.'
      )
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
      },
      audio: true,
    })

    streamRef.current = stream

    if (videoRef.current) {
      videoRef.current.srcObject = stream
      await videoRef.current.play()
    }

    const recorder = new MediaRecorder(stream)
    recorderRef.current = recorder
    chunksRef.current = []

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    recorder.onstop = () => {
      const videoBlob = new Blob(chunksRef.current, {
        type: 'video/webm',
      })

      if (videoBlob.size > 0) {
        const url = URL.createObjectURL(videoBlob)
        setRecordedVideo(url)
        setStatus(
          'Recording stopped. Your evidence video is ready for the next upload step.'
        )
      }

      stopCameraTracks()
    }

    recorder.start(1000)
  }

  const createEmergencyCase = async (
    userId: string,
    capturedLocation: CapturedLocation | null
  ) => {
    const response = await fetch('/api/emergency/sos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        latitude: capturedLocation?.latitude ?? null,
        longitude: capturedLocation?.longitude ?? null,
        accuracy: capturedLocation?.accuracy ?? null,
        activatedAt: new Date().toISOString(),
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Could not create emergency case.')
    }

    return result
  }

  const activateSOS = async () => {
    try {
      setLoading(true)
      setError('')
      setRecordedVideo(null)
      setCaseId(null)

      setStatus('Checking your account...')

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error('Please sign in before activating SOS.')
      }

      setStatus('Capturing your location...')
      const capturedLocation = await captureLocation()

      setStatus('Creating your emergency case...')
      const result = await createEmergencyCase(user.id, capturedLocation)

      if (result?.emergencyCase?.id) {
        setCaseId(result.emergencyCase.id)
      }

      setSosActive(true)

      setStatus('Requesting camera and microphone permission...')
      await startRecording()

      setStatus(
        'SOS is active. Your emergency case has been created and evidence recording has started.'
      )
    } catch (err: any) {
      setError(
        err?.message ||
          'SOS could not start. Please call 999 or 112 immediately.'
      )

      setSosActive(false)
      stopCameraTracks()
    } finally {
      setLoading(false)
    }
  }

  const cancelSOS = () => {
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
    } else {
      stopCameraTracks()
    }

    setSosActive(false)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: 'clamp(22px,3vw,30px)',
            marginBottom: '4px',
            color: '#C8102E',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Siren size={28} color="#C8102E" />
          Emergency SOS
        </h1>

        <p style={{ color: '#6B7280', fontSize: '13px' }}>
          If you are in immediate danger, call 999 or 112 first.
        </p>
      </div>

      <div
        style={{
          background: sosActive
            ? 'linear-gradient(135deg, #7F0000, #C8102E)'
            : 'linear-gradient(135deg, #0A0A0A, #1a0000)',
          borderRadius: '20px',
          padding: '48px 32px',
          textAlign: 'center',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Siren
            size={34}
            color={sosActive ? '#ffcccc' : 'rgba(255,255,255,0.65)'}
          />

          <h2
            style={{
              color: 'white',
              fontWeight: 800,
              fontSize: '22px',
              margin: '14px 0 8px',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {sosActive
              ? 'SOS ACTIVE — Recording evidence'
              : 'Are you in immediate danger?'}
          </h2>

          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              maxWidth: '500px',
              margin: '0 auto 28px',
              lineHeight: 1.6,
            }}
          >
            {sosActive
              ? 'Your emergency case has been created. Your location and permitted camera or microphone evidence are being captured.'
              : 'Press SOS to create an emergency case, capture your location, and begin recording evidence.'}
          </p>

          {!sosActive ? (
            <button
              onClick={activateSOS}
              disabled={loading}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: '#C8102E',
                color: 'white',
                border: '4px solid rgba(255,255,255,0.25)',
                fontWeight: 900,
                fontSize: '20px',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 32px rgba(200,16,46,0.6)',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                opacity: loading ? 0.75 : 1,
              }}
            >
              {loading ? (
                <Loader2 size={32} className="spin" />
              ) : (
                <Siren size={34} />
              )}
              {loading ? 'STARTING' : 'SOS'}
            </button>
          ) : (
            <button
              onClick={cancelSOS}
              style={{
                background: 'rgba(255,255,255,0.14)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                padding: '10px 22px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
              }}
            >
              <XCircle size={16} />
              Stop Recording
            </button>
          )}

          {status && (
            <p
              style={{
                marginTop: '20px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {status}
            </p>
          )}

          {error && (
            <p
              style={{
                marginTop: '20px',
                color: '#FECACA',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              {error}
            </p>
          )}
        </div>
      </div>

      {caseId && (
        <div
          style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '20px',
            color: '#1E40AF',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          Emergency case created successfully.
        </div>
      )}

      {location && (
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '20px',
            color: '#166534',
            fontSize: '13px',
          }}
        >
          <strong>Location captured:</strong> {location.latitude.toFixed(6)},{' '}
          {location.longitude.toFixed(6)} — accuracy approximately{' '}
          {Math.round(location.accuracy)} metres.
        </div>
      )}

      {sosActive && (
        <div
          style={{
            background: '#111827',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              color: 'white',
              fontWeight: 700,
              fontSize: '13px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            <Camera size={17} />
            Live emergency recording
          </div>

          <video
            ref={videoRef}
            muted
            playsInline
            style={{
              width: '100%',
              borderRadius: '10px',
              maxHeight: '400px',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {recordedVideo && (
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '14px',
            padding: '18px',
            marginBottom: '24px',
          }}
        >
          <h3
            style={{
              color: '#006600',
              marginBottom: '10px',
              fontSize: '16px',
            }}
          >
            Evidence recording completed
          </h3>

          <video
            src={recordedVideo}
            controls
            style={{ width: '100%', borderRadius: '10px' }}
          />

          <p
            style={{
              color: '#166534',
              fontSize: '12px',
              marginTop: '10px',
              lineHeight: 1.5,
            }}
          >
            The recording is currently stored in this browser session. The next
            step will be uploading it to Supabase Storage and linking it to this
            emergency case.
          </p>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {EMERGENCY_CONTACTS.map((contact) => (
          <a
            key={contact.label}
            href={`tel:${contact.number}`}
            style={{
              background: 'white',
              borderRadius: '14px',
              padding: '20px',
              textDecoration: 'none',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: contact.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {contact.icon}
            </div>

            <div
              style={{
                fontWeight: 700,
                fontSize: '13px',
                color: '#0A0A0A',
              }}
            >
              {contact.label}
            </div>

            <div
              style={{
                fontWeight: 800,
                fontSize: '24px',
                color: contact.color,
              }}
            >
              <Phone size={16} /> {contact.number}
            </div>
          </a>
        ))}
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          <ShieldAlert size={18} color="#C8102E" />
          <h2 style={{ fontWeight: 700, fontSize: '18px' }}>
            What Happens When You Press SOS
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
            gap: '16px',
          }}
        >
          {SOS_ACTIONS.map((item) => (
            <div
              key={item.title}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '9px',
                  background: item.bg,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '13px',
                    marginBottom: '3px',
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    lineHeight: 1.4,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: '#F0FDF4',
          border: '1px solid rgba(0,102,0,0.2)',
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <CheckCircle2 size={24} color="#006600" />

        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3
            style={{
              fontWeight: 700,
              fontSize: '15px',
              color: '#006600',
              marginBottom: '6px',
            }}
          >
            Set Up Trusted Contacts
          </h3>

          <p
            style={{
              fontSize: '13px',
              color: '#374151',
              lineHeight: 1.6,
              marginBottom: '14px',
            }}
          >
            Add people who should receive an SOS alert once the SMS notification
            service is connected.
          </p>

          <Link
            href="/dashboard/profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: '#006600',
              color: 'white',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '13px',
            }}
          >
            <UserPlus size={15} />
            Add Trusted Contacts
          </Link>
        </div>
      </div>

      <style>{`
        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}