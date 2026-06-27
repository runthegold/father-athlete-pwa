'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { buildWorkoutSteps, Session, WorkoutStep, GROUP_COLORS } from '@/lib/data'

type Props = {
  session: Session
  onComplete: () => void
  onClose: () => void
}

const REST_COLOR: [string, string] = ['#60a5fa', '#1e3a5f']

function useAudio() {
  const ctx = useRef<AudioContext | null>(null)

  const beep = useCallback((freq: number, dur: number, vol = 0.18) => {
    if (typeof window === 'undefined') return
    if (!ctx.current) ctx.current = new AudioContext()
    const o = ctx.current.createOscillator()
    const g = ctx.current.createGain()
    o.connect(g)
    g.connect(ctx.current.destination)
    o.frequency.value = freq
    g.gain.setValueAtTime(vol, ctx.current.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.current.currentTime + dur)
    o.start(ctx.current.currentTime)
    o.stop(ctx.current.currentTime + dur)
  }, [])

  const tick = useCallback(() => beep(880, 0.08), [beep])
  const start = useCallback(() => beep(660, 0.18), [beep])
  const done = useCallback(() => {
    beep(523, 0.12)
    setTimeout(() => beep(659, 0.12), 140)
    setTimeout(() => beep(784, 0.22), 280)
  }, [beep])

  return { tick, start, done }
}

function Ring({ progress, color }: { progress: number; color: string }) {
  const r = 72
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.max(0, Math.min(1, progress)))
  return (
    <svg className="ring-svg" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={r} className="ring-track" />
      <circle
        cx="80" cy="80" r={r}
        className="ring-fill"
        style={{
          stroke: color,
          strokeDasharray: c,
          strokeDashoffset: offset,
          filter: `drop-shadow(0 0 8px ${color}80)`,
        }}
      />
    </svg>
  )
}

export default function WorkoutMode({ session, onComplete, onClose }: Props) {
  const steps = buildWorkoutSteps(session)
  const [stepIndex, setStepIndex] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState<number>(0)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const audio = useAudio()

  const step = steps[stepIndex]

  const getDuration = (s: WorkoutStep): number => {
    if (s.type === 'block-intro') return 4
    if (s.type === 'exercise') return s.durationSeconds
    if (s.type === 'freestyle') return s.durationSeconds
    if (s.type === 'rest') return s.durationSeconds
    return 0
  }

  useEffect(() => {
    setSecondsLeft(getDuration(step))
    if (step.type !== 'block-intro') audio.start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id)
          advance()
          return 0
        }
        if (s <= 4) audio.tick()
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, stepIndex])

  function advance() {
    if (stepIndex >= steps.length - 1) {
      setFinished(true)
      audio.done()
      onComplete()
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  function skip() {
    advance()
  }

  if (finished) {
    return (
      <div className="workout-overlay">
        <div className="workout-finish">
          <div className="finish-orb">🔥</div>
          <h2>Workout voltooid</h2>
          <p>Je hebt <strong>{session.title}</strong> afgerond.<br />Streak veilig gesteld.</p>
          <button className="btn-primary" onClick={onClose}>Terug naar home</button>
        </div>
      </div>
    )
  }

  const totalSteps = steps.length
  const progressPercent = stepIndex / totalSteps

  if (step.type === 'block-intro') {
    return (
      <div className="workout-overlay">
        <button className="wo-close" onClick={onClose}>✕</button>
        <div className="wo-progress-bar">
          <div className="wo-progress-fill" style={{ width: `${progressPercent * 100}%` }} />
        </div>
        <div className="wo-block-intro">
          <p className="eyebrow">{`Block ${step.blockIndex + 1} van ${session.blocks.length}`}</p>
          <h2>{step.label}</h2>
          <p className="wo-work-label">{step.work}</p>
          <button className="btn-primary mt-lg" onClick={() => { setRunning(true); advance() }}>
            Start block
          </button>
        </div>
      </div>
    )
  }

  const isRest = step.type === 'rest'
  const duration = getDuration(step)
  const ringProgress = duration > 0 ? secondsLeft / duration : 0

  const gradientColor = isRest
    ? REST_COLOR[0]
    : step.type === 'exercise'
    ? step.exercise.gradient[0]
    : GROUP_COLORS[step.group][0]

  const gradientBg = isRest
    ? `linear-gradient(135deg, ${REST_COLOR[0]}22, ${REST_COLOR[1]}44)`
    : step.type === 'exercise'
    ? `linear-gradient(135deg, ${step.exercise.gradient[0]}22, ${step.exercise.gradient[1]}44)`
    : `linear-gradient(135deg, ${GROUP_COLORS[step.group][0]}22, ${GROUP_COLORS[step.group][1]}44)`

  const symbol = isRest
    ? '◌'
    : step.type === 'exercise'
    ? step.exercise.symbol
    : '◎'

  const title = isRest
    ? 'Rust'
    : step.type === 'exercise'
    ? step.exercise.name
    : step.name

  const sub = isRest
    ? `Volgende: ${step.nextName}`
    : step.type === 'exercise'
    ? `${step.exercise.group} · ${step.exercise.level}`
    : step.group

  const cue = step.type === 'exercise' ? step.exercise.cue : null
  const scale = step.type === 'exercise' ? step.exercise.scale : null

  return (
    <div className="workout-overlay">
      <button className="wo-close" onClick={onClose}>✕</button>
      <div className="wo-progress-bar">
        <div className="wo-progress-fill" style={{ width: `${progressPercent * 100}%` }} />
      </div>

      <div className="wo-body">
        <div className="wo-graphic" style={{ background: gradientBg }}>
          <span className="wo-symbol" style={{ color: gradientColor }}>{symbol}</span>
        </div>

        <p className="wo-sub eyebrow">{sub}</p>
        <h2 className="wo-title">{title}</h2>

        {cue && <p className="wo-cue">{cue}</p>}

        <div className="wo-timer-wrap">
          <Ring progress={ringProgress} color={gradientColor} />
          <div className="wo-timer-inner">
            <strong>{secondsLeft}</strong>
            <small>sec</small>
          </div>
        </div>

        {scale && <p className="wo-scale"><span>Schaaloptie:</span> {scale}</p>}

        <div className="wo-actions">
          {!running ? (
            <button className="btn-primary" onClick={() => setRunning(true)}>
              {stepIndex === 0 ? 'Start workout' : 'Hervat'}
            </button>
          ) : (
            <button className="btn-ghost" onClick={() => setRunning(false)}>Pauze</button>
          )}
          <button className="btn-ghost" onClick={skip}>Sla over →</button>
        </div>
      </div>
    </div>
  )
}
