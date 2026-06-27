'use client'

import { useEffect } from 'react'
import type { Readiness } from '@/app/providers'

type Props = {
  sessionTime: number
  onSelect: (r: Readiness) => void
  onClose: () => void
}

const options = [
  {
    id: 'full' as Readiness,
    emoji: '⚡',
    title: 'Vol gas',
    desc: 'Goed geslapen, energie aanwezig.',
    modifier: (t: number) => `${t} min · volledig`,
    color: 'var(--lime)',
    bg: 'rgba(200,241,53,.08)',
    border: 'rgba(200,241,53,.2)',
  },
  {
    id: 'moderate' as Readiness,
    emoji: '🌊',
    title: 'Matig',
    desc: 'Gaat wel. Compacte versie.',
    modifier: (t: number) => `${Math.ceil(t * 0.65)} min · compact`,
    color: '#5ab0ff',
    bg: 'rgba(90,176,255,.08)',
    border: 'rgba(90,176,255,.2)',
  },
  {
    id: 'light' as Readiness,
    emoji: '🌿',
    title: 'Rustig',
    desc: 'Slechte nacht of erg druk.',
    modifier: () => '10 min · mobility',
    color: '#86efac',
    bg: 'rgba(134,239,172,.08)',
    border: 'rgba(134,239,172,.2)',
  },
]

export default function ReadinessCheck({ sessionTime, onSelect, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="readiness-backdrop" onClick={onClose}>
      <div className="readiness-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="readiness-handle" />
        <p className="readiness-eyebrow">Check-in</p>
        <h2 className="readiness-title">Hoe ga je dit aan?</h2>
        <p className="readiness-sub">Dit past de duur en intensiteit aan.</p>

        <div className="readiness-options">
          {options.map((opt) => (
            <button
              key={opt.id}
              className="readiness-option"
              style={{ '--opt-color': opt.color, '--opt-bg': opt.bg, '--opt-border': opt.border } as React.CSSProperties}
              onClick={() => onSelect(opt.id)}
            >
              <span className="ro-emoji">{opt.emoji}</span>
              <div className="ro-text">
                <strong className="ro-title">{opt.title}</strong>
                <span className="ro-desc">{opt.desc}</span>
              </div>
              <span className="ro-time">{opt.modifier(sessionTime)}</span>
            </button>
          ))}
        </div>

        <button className="readiness-skip" onClick={onClose}>
          Annuleren
        </button>
      </div>
    </div>
  )
}
