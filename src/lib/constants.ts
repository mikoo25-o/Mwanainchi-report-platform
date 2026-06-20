// Brand colors
export const COLORS = {
  red: '#C8102E',
  green: '#006600',
  black: '#0A0A0A',
  white: '#FFFFFF',
  redDark: '#A00D24',
  greenDark: '#004D00',
  gray: '#F5F5F5',
  grayMid: '#E8E8E8',
  textMuted: '#6B7280',
} as const

// Navigation items for sidebar
export const NAV_ITEMS = [
  { href: '/dashboard', icon: 'Home', label: 'Dashboard' },
  { href: '/dashboard/report', icon: 'Plus', label: 'Report an Incident' },
  { href: '/dashboard/cases', icon: 'Folder', label: 'My Cases' },
  { href: '/dashboard/messages', icon: 'MessageSquare', label: 'Messages' },
  { href: '/dashboard/legal-support', icon: 'Scale', label: 'Legal Support' },
  { href: '/dashboard/evidence-vault', icon: 'Shield', label: 'Evidence Vault' },
  { href: '/dashboard/emergency', icon: 'AlertCircle', label: 'Emergency SOS' },
  { href: '/dashboard/rights', icon: 'BookOpen', label: 'Rights & Resources' },
  { href: '/dashboard/profile', icon: 'User', label: 'Profile' },
  { href: '/dashboard/settings', icon: 'Settings', label: 'Settings' },
] as const

// Incident categories
export const INCIDENT_CATEGORIES = [
  'Theft / Robbery',
  'Assault / Physical Harm',
  'Sexual Violence',
  'Domestic Violence',
  'Corruption / Bribery',
  'Land Disputes',
  'Fraud / Cybercrime',
  'Police Misconduct',
  'Human Trafficking',
  'Other',
] as const

// Case statuses
export const CASE_STATUSES = [
  'Report Submitted',
  'Evidence Uploaded',
  'Under Review',
  'Investigation',
  'Referred',
  'In Court',
  'Resolved',
] as const

export type CaseStatus = typeof CASE_STATUSES[number]
