import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Father Athlete OS',
  description: 'Dagelijkse 20-minuten atletenroutine voor vaders, ondernemers en drukbezette mensen.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Father Athlete' },
}

export const viewport: Viewport = {
  themeColor: '#08090a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
