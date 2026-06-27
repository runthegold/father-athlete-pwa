'use client'

import { Exercise } from '@/lib/data'

type Props = {
  exercise: Exercise
  onClose: () => void
}

export default function ExerciseModal({ exercise, onClose }: Props) {
  const [from, to] = exercise.gradient
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div
          className="modal-graphic"
          style={{ background: `linear-gradient(135deg, ${from}44, ${to}88)` }}
        >
          <span className={`ex-symbol anim-${exercise.animation}`} style={{ color: from }}>
            {exercise.symbol}
          </span>
        </div>
        <p className="eyebrow mt-md" style={{ color: from }}>
          {exercise.group} · {exercise.level}
        </p>
        <h2 className="modal-title">{exercise.name}</h2>
        <div className="modal-meta">
          <span className="meta-chip">{exercise.durationLabel}</span>
          <span className="meta-chip">{exercise.level}</span>
        </div>
        <div className="modal-section">
          <p className="modal-label">Uitvoering</p>
          <p>{exercise.cue}</p>
        </div>
        <div className="modal-section">
          <p className="modal-label">Schaaloptie</p>
          <p>{exercise.scale}</p>
        </div>
      </div>
    </div>
  )
}
