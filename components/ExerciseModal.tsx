'use client'

import { Exercise } from '@/lib/data'

type Props = { exercise: Exercise; onClose: () => void }

export default function ExerciseModal({ exercise, onClose }: Props) {
  const [from, to] = exercise.gradient
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Sluiten">✕</button>

        <div
          className="modal-graphic"
          style={{ background: `linear-gradient(135deg, ${from}40, ${to}80)` }}
        >
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            background: `radial-gradient(circle at 38% 32%, ${from}35, transparent 68%)`,
          }} />
          <span
            className={`ex-symbol anim-${exercise.animation}`}
            style={{ color: from, fontSize: 88 }}
          >
            {exercise.symbol}
          </span>
        </div>

        <p className="eyebrow mt-md" style={{ color: from }}>
          {exercise.group} · {exercise.level}
        </p>
        <h2 className="modal-title">{exercise.name}</h2>

        <div className="modal-meta">
          <span className="meta-chip">⏱ {exercise.durationLabel}</span>
          <span className="meta-chip" style={
            exercise.level === 'Beast' ? { background: 'rgba(212,252,90,.12)', borderColor: 'rgba(212,252,90,.3)', color: 'var(--lime)' } :
            exercise.level === 'Strong' ? { background: 'rgba(10,132,255,.12)', borderColor: 'rgba(10,132,255,.3)', color: '#4da6ff' } :
            {}
          }>
            {exercise.level}
          </span>
        </div>

        <div className="modal-section">
          <p className="modal-label">Uitvoering</p>
          <p style={{ fontSize: 16, lineHeight: 1.55, color: 'var(--text-secondary)' }}>{exercise.cue}</p>
        </div>
        <div className="modal-section" style={{ marginBottom: 8 }}>
          <p className="modal-label">Schaaloptie</p>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{exercise.scale}</p>
        </div>
      </div>
    </div>
  )
}
