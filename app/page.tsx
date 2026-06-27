'use client'

import { useEffect, useMemo, useState } from 'react'

type Exercise = {
  id: string
  name: string
  group: 'Push' | 'Pull' | 'Legs' | 'Core' | 'Mobility' | 'Conditioning'
  duration: string
  level: 'Base' | 'Strong' | 'Beast'
  cue: string
  scale: string
  graphic: string
}

type Session = {
  day: string
  title: string
  focus: string
  time: number
  intent: string
  blocks: { label: string; work: string; items: string[] }[]
}

const exercises: Exercise[] = [
  { id: 'deep-squat', name: 'Deep Squat Hold', group: 'Mobility', duration: '45 sec', level: 'Base', cue: 'Hielen zwaar, borst open, adem rustig door je neus.', scale: 'Hou een deurpost vast of plaats hakken op een boek.', graphic: '◜' },
  { id: 'worlds-greatest', name: 'World’s Greatest Stretch', group: 'Mobility', duration: '60 sec/zijde', level: 'Base', cue: 'Lange uitvalspas, elleboog naar grond, daarna roteren naar plafond.', scale: 'Laat achterste knie zakken en verkort de beweging.', graphic: '⟲' },
  { id: 'push-up', name: 'Push-up', group: 'Push', duration: '40 sec', level: 'Base', cue: 'Ribben laag, handen onder schouders, borst raakt bijna de vloer.', scale: 'Handen op bank/tafel of knieën op vloer.', graphic: '▰' },
  { id: 'pike', name: 'Pike Push-up', group: 'Push', duration: '30 sec', level: 'Strong', cue: 'Heupen hoog, hoofd richting vloer, duw jezelf schuin terug.', scale: 'Maak de hoek kleiner of doe shoulder taps.', graphic: '△' },
  { id: 'pull-up', name: 'Pull-up / Row', group: 'Pull', duration: '40 sec', level: 'Strong', cue: 'Start vanuit schouderbladen, trek borst naar stang/ringen.', scale: 'Gebruik resistance band of doe towel rows in deurpost.', graphic: '↟' },
  { id: 'air-squat', name: 'Air Squat', group: 'Legs', duration: '40 sec', level: 'Base', cue: 'Knieën volgen tenen, romp lang, gecontroleerd omlaag.', scale: 'Box squat naar stoel.', graphic: '⌄' },
  { id: 'reverse-lunge', name: 'Reverse Lunge', group: 'Legs', duration: '40 sec', level: 'Base', cue: 'Stap achteruit, voorste voet blijft volledig geaard.', scale: 'Split squat zonder stap.', graphic: '↙' },
  { id: 'bulgarian', name: 'Bulgarian Split Squat', group: 'Legs', duration: '8/zijde', level: 'Beast', cue: 'Langzaam zakken, voorste hak zwaar, heup recht vooruit.', scale: 'Normale split squat of lagere verhoging.', graphic: '▱' },
  { id: 'hollow', name: 'Hollow Hold', group: 'Core', duration: '30 sec', level: 'Strong', cue: 'Onderrug in vloer, ribben laag, armen lang.', scale: 'Knieën gebogen of dead bug.', graphic: '◡' },
  { id: 'plank', name: 'Hardstyle Plank', group: 'Core', duration: '30 sec', level: 'Base', cue: 'Span billen, quads en buik alsof je een stoot opvangt.', scale: 'Korte sets van 10 seconden.', graphic: '▬' },
  { id: 'burpee', name: 'Burpee', group: 'Conditioning', duration: '10 reps EMOM', level: 'Beast', cue: 'Vloeiend, niet slordig. Stap terug als springen te duur wordt.', scale: 'No-push-up burpee of squat thrust.', graphic: '✦' },
  { id: 'bear', name: 'Bear Crawl', group: 'Conditioning', duration: '30 sec', level: 'Strong', cue: 'Knieën laag, rug stil, tegengesteld hand/voet bewegen.', scale: 'Bear hover hold.', graphic: '⌁' },
]

const week: Session[] = [
  { day: 'Maandag', title: 'Push + Engine', focus: 'Borst, schouders, core, korte conditieprikkel', time: 20, intent: 'Start de week met controle en kracht.', blocks: [
    { label: 'Mobility', work: '3 min flow', items: ['Deep Squat Hold', 'World’s Greatest Stretch', 'Shoulder CARs'] },
    { label: 'Strength', work: '2 rondes · 40/20', items: ['Push-up', 'Pike Push-up', 'Air Squat', 'Hardstyle Plank'] },
    { label: 'Finisher', work: 'EMOM 5', items: ['8-10 Burpees per minuut'] },
  ] },
  { day: 'Dinsdag', title: 'Pull + Posture', focus: 'Rug, grip, schouderbladen, houding', time: 18, intent: 'Compenseer zitten, dragen en werken achter laptop.', blocks: [
    { label: 'Mobility', work: '4 min', items: ['Thoracic rotations', 'Hang / doorway stretch'] },
    { label: 'Strength', work: '3 rondes', items: ['Pull-up / Row', 'Reverse Lunge', 'Hollow Hold'] },
    { label: 'Reset', work: '2 min', items: ['Nasal breathing walk'] },
  ] },
  { day: 'Woensdag', title: 'Legs + Capacity', focus: 'Benen, heupen, trail-ready basis', time: 22, intent: 'Sterke benen zonder gym of machines.', blocks: [
    { label: 'Prime', work: '3 min', items: ['Deep Squat Hold', 'Hip flexor stretch'] },
    { label: 'Strength', work: '4 sets', items: ['Bulgarian Split Squat', 'Air Squat', 'Wall Sit'] },
    { label: 'Finisher', work: '6 min', items: ['Bear Crawl', 'Mountain Climbers'] },
  ] },
  { day: 'Donderdag', title: 'Conditioning', focus: 'Hartslag, zweet, mentale scherpte', time: 16, intent: 'Kort genoeg om altijd te doen, scherp genoeg om te tellen.', blocks: [
    { label: 'Warm-up', work: '3 min', items: ['Squat to stand', 'Arm swings', 'Easy jumps'] },
    { label: 'Main', work: '10 min AMRAP', items: ['5 Burpees', '10 Push-ups', '15 Air Squats'] },
    { label: 'Downshift', work: '3 min', items: ['Box breathing'] },
  ] },
  { day: 'Vrijdag', title: 'Full Body Minimum', focus: 'Alles raken, niets slopen', time: 20, intent: 'De sessie voor drukke dagen.', blocks: [
    { label: 'Flow', work: '5 min', items: ['World’s Greatest Stretch', 'Deep Squat Hold'] },
    { label: 'Circuit', work: '12 min', items: ['Push-up', 'Pull-up / Row', 'Reverse Lunge', 'Hollow Hold'] },
    { label: 'Finish', work: '3 min', items: ['Fast feet / jump rope'] },
  ] },
  { day: 'Zaterdag', title: 'Outdoor Athlete', focus: 'Zone 2, wandelen, run, hike, spelen', time: 45, intent: 'Neem kinderen/hond mee. Dit is je lange levensduurblok.', blocks: [
    { label: 'Choice', work: '45-90 min', items: ['Trailrun', 'Stevige wandeling', 'Fietsen', 'Hike met kinderwagen'] },
  ] },
  { day: 'Zondag', title: 'Recovery Ritual', focus: 'Mobiliteit, adem, reset', time: 12, intent: 'Herstellen zonder de streak te breken.', blocks: [
    { label: 'Mobility', work: '10 min', items: ['Hips', 'T-spine', 'Calves', 'Shoulders'] },
    { label: 'Breath', work: '2 min', items: ['Nasal breathing'] },
  ] },
]

const groups = ['All', 'Push', 'Pull', 'Legs', 'Core', 'Mobility', 'Conditioning'] as const

function todayIndex() {
  const js = new Date().getDay()
  return js === 0 ? 6 : js - 1
}

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

function getStreak(log: string[]) {
  let streak = 0
  const cursor = new Date()
  for (;;) {
    if (log.includes(dateKey(cursor))) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(todayIndex())
  const [activeGroup, setActiveGroup] = useState<(typeof groups)[number]>('All')
  const [log, setLog] = useState<string[]>([])
  const [seconds, setSeconds] = useState(20 * 60)
  const [running, setRunning] = useState(false)
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('father-athlete-log')
    if (saved) setLog(JSON.parse(saved))
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [running])

  useEffect(() => { if (seconds === 0) setRunning(false) }, [seconds])

  const session = week[selectedDay]
  const streak = useMemo(() => getStreak(log), [log])
  const completedToday = log.includes(dateKey())
  const filteredExercises = activeGroup === 'All' ? exercises : exercises.filter((ex) => ex.group === activeGroup)
  const progress = 1 - seconds / (20 * 60)
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  function completeToday() {
    const key = dateKey()
    const next = log.includes(key) ? log : [...log, key]
    setLog(next)
    localStorage.setItem('father-athlete-log', JSON.stringify(next))
  }

  function resetDemo() {
    setSeconds(20 * 60)
    setRunning(false)
  }

  return (
    <main className="app-shell">
      <section className="hero panel">
        <div className="hero-copy">
          <p className="eyebrow">Father Athlete OS</p>
          <h1>Blijf 365 dagen per jaar fysiek capabel.</h1>
          <p className="lead">Een dagelijkse onderhoudsroutine voor vaders, ondernemers en atleten die geen tijd meer hebben voor perfecte omstandigheden.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => setRunning(true)}>Start vandaag</button>
            <button className="ghost" onClick={completeToday}>{completedToday ? 'Vandaag voltooid' : 'Markeer voltooid'}</button>
          </div>
        </div>
        <div className="streak-orb" aria-label="streak">
          <span>{streak}</span>
          <small>dagen streak</small>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat panel"><small>Vandaag</small><strong>{session.time} min</strong><span>{session.title}</span></div>
        <div className="stat panel"><small>Doel</small><strong>20</strong><span>minuten minimum</span></div>
        <div className="stat panel"><small>Status</small><strong>{completedToday ? 'Done' : 'Open'}</strong><span>{completedToday ? 'Streak veilig' : 'Nog afronden'}</span></div>
      </section>

      <section className="panel workout-card">
        <div className="section-head">
          <div>
            <p className="eyebrow">Workout van de dag</p>
            <h2>{session.day} · {session.title}</h2>
            <p>{session.intent}</p>
          </div>
          <div className="timer" style={{ background: `conic-gradient(var(--lime) ${progress * 360}deg, rgba(255,255,255,.08) 0deg)` }}>
            <div><strong>{mm}:{ss}</strong><small>timer</small></div>
          </div>
        </div>
        <div className="timer-actions">
          <button className="primary" onClick={() => setRunning((v) => !v)}>{running ? 'Pauze' : 'Start timer'}</button>
          <button className="ghost" onClick={resetDemo}>Reset</button>
          <button className="ghost" onClick={completeToday}>Voltooi</button>
        </div>
        <div className="blocks">
          {session.blocks.map((block) => (
            <article className="block" key={block.label}>
              <span>{block.label}</span>
              <strong>{block.work}</strong>
              <ul>{block.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <section className="week-strip" aria-label="Week schema">
        {week.map((item, index) => (
          <button key={item.day} className={selectedDay === index ? 'day active' : 'day'} onClick={() => setSelectedDay(index)}>
            <small>{item.day.slice(0, 2)}</small><span>{item.title}</span>
          </button>
        ))}
      </section>

      <section className="panel library">
        <div className="section-head slim"><div><p className="eyebrow">Oefenbibliotheek</p><h2>Bewegingen die overal werken</h2></div></div>
        <div className="filters">{groups.map((group) => <button key={group} onClick={() => setActiveGroup(group)} className={activeGroup === group ? 'filter active' : 'filter'}>{group}</button>)}</div>
        <div className="exercise-grid">
          {filteredExercises.map((ex) => (
            <button className="exercise" key={ex.id} onClick={() => setActiveExercise(ex)}>
              <div className="motion"><span>{ex.graphic}</span></div>
              <div><small>{ex.group} · {ex.level}</small><strong>{ex.name}</strong><p>{ex.cue}</p></div>
              <em>{ex.duration}</em>
            </button>
          ))}
        </div>
      </section>

      <section className="panel mission">
        <p className="eyebrow">Regel van het systeem</p>
        <h2>Niet perfect trainen. Nooit verdwijnen.</h2>
        <p>Op zware dagen telt 12 minuten mobility. Op goede dagen mag je uitbreiden. De streak beloont aanwezigheid, niet ego.</p>
      </section>

      {activeExercise && (
        <div className="modal-backdrop" onClick={() => setActiveExercise(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setActiveExercise(null)}>×</button>
            <div className="motion large"><span>{activeExercise.graphic}</span></div>
            <p className="eyebrow">{activeExercise.group} · {activeExercise.level}</p>
            <h2>{activeExercise.name}</h2>
            <p><strong>Uitvoering:</strong> {activeExercise.cue}</p>
            <p><strong>Schaaloptie:</strong> {activeExercise.scale}</p>
            <p><strong>Werkduur:</strong> {activeExercise.duration}</p>
          </div>
        </div>
      )}
    </main>
  )
}
