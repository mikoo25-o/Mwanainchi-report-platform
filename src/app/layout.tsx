import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mwanainchi Report — Your Voice. Your Rights. Your Justice.',
  description: 'A secure platform for every Kenyan to report, protect, and seek justice with dignity and confidence.',
  keywords: 'Kenya, justice, report crime, legal aid, evidence, rights',
  openGraph: {
    title: 'Mwanainchi Report',
    description: 'Your Voice. Your Rights. Your Justice.',
    locale: 'en_KE',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
