'use client'

import { getHeatmapData } from '@/lib/storage'

type Props = { log: string[] }

const DAYS = ['', 'Ma', '', 'Wo', '', 'Vr', '']

export default function Heatmap({ log }: Props) {
  const data = getHeatmapData(log, 91)

  // Pad front so first cell aligns to correct day-of-week
  const firstDow = data[0]?.dayOfWeek ?? 0
  const mondayAligned = firstDow === 0 ? 6 : firstDow - 1
  const padded = [...Array(mondayAligned).fill(null), ...data]

  const weeks: (typeof data[0] | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7))
  }

  return (
    <div className="heatmap-wrap">
      <div className="heatmap-days">
        {DAYS.map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-col">
            {week.map((cell, di) => (
              <div
                key={di}
                className={`heatmap-cell${cell?.done ? ' done' : ''}${cell === null ? ' empty' : ''}`}
                title={cell?.date ?? ''}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
