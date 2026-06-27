import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Father Athlete',
  description: 'A daily athlete maintenance PWA for busy fathers.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Father Athlete' },
}

export const viewport: Viewport = {
  themeColor: '#090A0B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="nl"><body>{children}</body></html>
}
