'use client'

import { useEffect, useState } from 'react'
import DayRings from './DayRings'

type Props = {
  streak: number
  log: string[]
  onDone: () => void
}

function useCountUp(target: number, delay = 400, duration = 1000) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = setTimeout(() => {
      const start = Date.now()
      const raf = () => {
        const elapsed = Date.now() - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(eased * target))
        if (progress < 1) requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }, delay)
    return () => clearTimeout(timer)
  }, [target, delay, duration])
  return count
}

function getPhaseMessage(streak: number): string {
  if (streak <= 1)  return 'Dag één. Het begint hier.'
  if (streak < 7)   return `Dag ${streak}. Bouw het fundament.`
  if (streak < 14)  return 'Week 1 voltooid. De gewoonte vormt zich.'
  if (streak < 21)  return 'Week 2. Het begint automatisch te voelen.'
  if (streak < 30)  return 'Week 3. Je baseline verschuift.'
  if (streak < 60)  return `${streak} dagen. Je bent een atleet.`
  return `${streak} dagen. Dat is commitment.`
}

export default function CompletionScreen({ streak, log, onDone }: Props) {
  const displayStreak = useCountUp(streak, 600)
  const [ringVisible, setRingVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setRingVisible(true), 100)
    const t2 = setTimeout(() => setContentVisible(true), 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const R = 110
  const C = 2 * Math.PI * R

  return (
    <div className="completion-overlay">
      {/* Ambient glow */}
      <div className="completion-glow" />

      {/* Closing ring animation */}
      <div className="completion-ring-wrap">
        <svg viewBox="0 0 260 260" className="completion-ring-svg">
          <defs>
            <linearGradient id="compGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(200,241,53,.5)" />
              <stop offset="100%" stopColor="#c8f135" />
            </linearGradient>
          </defs>
          <circle cx="130" cy="130" r={R}
            fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="5" />
          <circle
            cx="130" cy="130" r={R}
            fill="none" stroke="url(#compGrad)" strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={ringVisible ? 0 : C}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '130px 130px',
              transition: 'stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)',
              filter: 'drop-shadow(0 0 12px rgba(200,241,53,.55))',
            }}
          />
        </svg>

        <div
          className="completion-ring-inner"
          style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity .5s ease' }}
        >
          <span className="comp-streak-num">{displayStreak}</span>
          <span className="comp-streak-lbl">{streak === 1 ? 'dag' : 'dagen'}</span>
        </div>
      </div>

      {/* Text */}
      <div
        className="completion-content"
        style={{
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? 'none' : 'translateY(16px)',
          transition: 'opacity .5s ease, transform .5s cubic-bezier(.16,1,.3,1)',
        }}
      >
        <h2 className="comp-title">Goed gedaan.</h2>
        <p className="comp-phase">{getPhaseMessage(streak)}</p>

        <div className="comp-rings-wrap">
          <DayRings log={log} />
        </div>

        <button className="btn-primary comp-done-btn" onClick={onDone}>
          Terug naar home
        </button>
      </div>
    </div>
  )
}
