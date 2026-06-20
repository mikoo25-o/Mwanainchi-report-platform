'use client'
import React, { useState } from 'react'
import BrandLogo from '@/components/ui/BrandLogo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, AlertCircle, Folder, MessageCircle, Scale,
  Shield, AlertTriangle, BookOpen, User, Settings, Phone, Menu, X, User as UserIcon,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', exact: true, icon: LayoutDashboard },
  { href: '/dashboard/report', label: 'Report an Incident', icon: AlertCircle },
  { href: '/dashboard/cases', label: 'My Cases', icon: Folder },
  { href: '/dashboard/messages', label: 'Messages', badge: true, icon: MessageCircle },
  { href: '/dashboard/legal-support', label: 'Legal Support', icon: Scale },
  { href: '/dashboard/evidence-vault', label: 'Evidence Vault', icon: Shield },
  { href: '/dashboard/emergency', label: 'Emergency SOS', icon: AlertTriangle },
  { href: '/dashboard/rights', label: 'Rights & Resources', icon: BookOpen },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  messageCount?: number
  userName?: string
  userLocation?: string
}

export default function Sidebar({ messageCount = 0, userName, userLocation = 'Kenya' }: SidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  const Content = () => (
    <aside style={{
      width: '240px', minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex', flexDirection: 'column',
      position: 'relative', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: '14px 14px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <BrandLogo variant="dark" size="sm" showTagline={true} />
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {NAV.map(item => {
          const active = isActive(item.href, item.exact)
          const IconComponent = item.icon
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px',
                textDecoration: 'none', marginBottom: '2px',
                background: active ? '#C8102E' : 'transparent',
                color: active ? 'white' : 'rgba(255,255,255,0.6)',
                fontSize: '13px', fontWeight: active ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ flexShrink: 0, display: 'flex' }}>
                <IconComponent size={18} strokeWidth={active ? 2 : 1.8} />
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && messageCount > 0 && (
                <span style={{
                  background: active ? 'white' : '#C8102E', color: active ? '#C8102E' : 'white',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                }}>{messageCount}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Help section */}
      <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
          padding: '12px', marginBottom: '10px',
        }}>
          <div style={{ color: '#4ade80', fontSize: '12px', fontWeight: 700, marginBottom: '2px' }}>Need Help?</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', marginBottom: '8px' }}>We are here for you 24/7</div>
          <button style={{
            background: '#006600', color: 'white', border: 'none', borderRadius: '6px',
            padding: '8px 12px', fontSize: '11px', fontWeight: 600,
            cursor: 'pointer', width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <Phone size={13} strokeWidth={2.5} />
            Contact Support
          </button>
        </div>

        {/* User info */}
        {userName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 4px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg,#C8102E,#8B0000)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden',
            }}>
              <UserIcon size={18} stroke="white" strokeWidth={2} />
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{userName}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{userLocation}</div>
            </div>
          </div>
        )}

        {/* Bottom decorative image — gavel + scales */}
        <div style={{
          marginTop: '8px', borderRadius: '8px', overflow: 'hidden',
          height: '90px', position: 'relative',
        }}>
          <img src="/sidebar-bottom.png" alt="Justice"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 60%)',
          }} />
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex" style={{ flexShrink: 0 }}>
        <Content />
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden" onClick={() => setMobileOpen(true)} style={{
        position: 'fixed', top: '14px', left: '14px', zIndex: 60,
        background: '#0A0A0A', color: 'white', border: 'none',
        borderRadius: '8px', padding: '8px 10px', cursor: 'pointer',
      }}>
        <Menu size={20} strokeWidth={2} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden" style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.55)',
        }} onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className="md:hidden" style={{
        position: 'fixed', top: 0, left: 0, zIndex: 55, height: '100vh',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}>
        <Content />
      </div>
    </>
  )
}