'use client'

import { getHeatmapData } from '@/lib/storage'

type Props = { log: string[] }

const DAY_LABELS = ['Ma', '', 'Wo', '', 'Vr', '', '']

export default function Heatmap({ log }: Props) {
  const data = getHeatmapData(log, 91)

  const firstDow      = data[0]?.dayOfWeek ?? 0
  const mondayAligned = firstDow === 0 ? 6 : firstDow - 1
  const padded        = [...Array(mondayAligned).fill(null), ...data]

  const weeks: (typeof data[0] | null)[][] = []
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7))
  }

  // Month labels: find first week per month
  const monthLabels: string[] = weeks.map((week) => {
    const first = week.find((c) => c !== null)
    if (!first) return ''
    const d = new Date(first.date)
    const prevWeekFirst = weeks[weeks.indexOf(week) - 1]?.find((c) => c !== null)
    if (!prevWeekFirst) return d.toLocaleDateString('nl-NL', { month: 'short' })
    const pd = new Date(prevWeekFirst.date)
    return d.getMonth() !== pd.getMonth()
      ? d.toLocaleDateString('nl-NL', { month: 'short' })
      : ''
  })

  return (
    <div className="heatmap-outer">
      <div className="heatmap-wrap">
        {/* Day labels column */}
        <div className="heatmap-days-col">
          {/* spacer for month row */}
          <span style={{ height: 16, display: 'block' }} />
          {DAY_LABELS.map((d, i) => <span key={i}>{d}</span>)}
        </div>

        {/* Weeks grid */}
        <div>
          {/* Month labels row */}
          <div style={{ display: 'flex', gap: 3, marginBottom: 4 }}>
            {weeks.map((_, wi) => (
              <div key={wi} style={{ width: 12, flexShrink: 0, fontSize: 9, color: 'var(--text-tertiary)', fontWeight: 600, overflow: 'visible', whiteSpace: 'nowrap' }}>
                {monthLabels[wi]}
              </div>
            ))}
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
      </div>
    </div>
  )
}
