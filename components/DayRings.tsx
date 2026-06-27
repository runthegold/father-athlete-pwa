'use client'

import { useMemo } from 'react'
import { week, todayIndex } from '@/lib/data'
import { dateKey } from '@/lib/storage'

const R = 11
const C = 2 * Math.PI * R  // 69.1

type Props = { log: string[] }

export default function DayRings({ log }: Props) {
  const todayIdx = todayIndex()

  const weekDates = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(today.getDate() - todayIdx + i)
      return dateKey(d)
    })
  }, [todayIdx])

  return (
    <div className="day-rings">
      {week.map((s, i) => {
        const done = log.includes(weekDates[i])
        const isToday = i === todayIdx
        const isFuture = i > todayIdx

        return (
          <div key={s.shortDay} className="day-ring-item">
            <svg
              viewBox="0 0 28 28"
              className="day-ring-svg"
              aria-label={`${s.day}${done ? ' — voltooid' : ''}`}
            >
              <circle
                cx="14" cy="14" r={R}
                fill="none"
                stroke={
                  done ? 'var(--lime)'
                  : isToday ? 'rgba(255,255,255,.22)'
                  : isFuture ? 'rgba(255,255,255,.06)'
                  : 'rgba(255,255,255,.10)'
                }
                strokeWidth="2.5"
                style={done ? { filter: 'drop-shadow(0 0 4px rgba(200,241,53,.4))' } : undefined}
              />
              {done && (
                <circle
                  cx="14" cy="14" r="4"
                  fill="var(--lime)"
                />
              )}
              {isToday && !done && (
                <circle cx="14" cy="14" r="3" fill="rgba(255,255,255,.5)" />
              )}
            </svg>
            <span
              className="day-ring-label"
              style={{
                color: isToday ? 'var(--t1)'
                  : done ? 'var(--lime)'
                  : 'var(--t3)',
              }}
            >
              {s.shortDay}
            </span>
          </div>
        )
      })}
    </div>
  )
}
