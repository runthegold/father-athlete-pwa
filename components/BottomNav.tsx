'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  {
    href: '/',
    label: 'Vandaag',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    href: '/week',
    label: 'Week',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: '/library',
    label: 'Library',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    href: '/stats',
    label: 'Stats',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
        return (
          <Link key={tab.href} href={tab.href} className={`nav-tab${active ? ' active' : ''}`}>
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
