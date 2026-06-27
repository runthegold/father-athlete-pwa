'use client'

import { useEffect, useRef } from 'react'
import type { Session } from '@/lib/data'

const R = 120
const C = 2 * Math.PI * R  // 753.98

type Props = {
  session: Session
  complete: boolean
}

export default function TodayRing({ session, complete }: Props) {
  const fillRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    el.style.transition = 'none'
    el.style.strokeDashoffset = String(C)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.16,1,.3,1)'
        el.style.strokeDashoffset = complete ? '0' : String(C)
      })
    })
  }, [complete])

  return (
    <div className="tr-wrap">
      <svg
        className="tr-svg"
        viewBox="0 0 280 280"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="limeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(200,241,53,.65)" />
            <stop offset="100%" stopColor="#c8f135" />
          </linearGradient>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle
          cx="140" cy="140" r={R}
          fill="none"
          stroke="rgba(255,255,255,.05)"
          strokeWidth="5"
        />

        {/* Fill */}
        <circle
          ref={fillRef}
          cx="140" cy="140" r={R}
          fill="none"
          stroke={complete ? 'url(#limeGrad)' : 'url(#limeGrad)'}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: '140px 140px',
            filter: complete ? 'drop-shadow(0 0 10px rgba(200,241,53,.5))' : 'none',
          }}
        />
      </svg>

      <div className="tr-inner">
        {complete ? (
          <>
            <div className="tr-done-check">✓</div>
            <p className="tr-done-label">Voltooid</p>
          </>
        ) : (
          <>
            <p className="tr-eyebrow">{session.focus}</p>
            <h2 className="tr-title">{session.title}</h2>
            <div className="tr-time-row">
              <span className="tr-duration">{session.time}</span>
              <span className="tr-unit">min</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
