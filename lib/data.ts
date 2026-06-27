export type Level = 'Base' | 'Strong' | 'Beast'
export type Group = 'Push' | 'Pull' | 'Legs' | 'Core' | 'Mobility' | 'Conditioning'

export type Exercise = {
  id: string
  name: string
  group: Group
  durationSeconds: number
  durationLabel: string
  level: Level
  cue: string
  scale: string
  symbol: string
  gradient: [string, string]
  animation: 'float' | 'spin' | 'pulse' | 'rock' | 'bounce' | 'shimmer'
}

export type WorkoutBlock = {
  label: string
  work: string
  items: string[]
}

export type Session = {
  day: string
  shortDay: string
  title: string
  focus: string
  time: number
  intent: string
  blocks: WorkoutBlock[]
}

export type WorkoutStep =
  | { type: 'block-intro'; label: string; work: string; blockIndex: number }
  | { type: 'exercise'; exercise: Exercise; durationSeconds: number }
  | { type: 'freestyle'; name: string; durationSeconds: number; group: Group }
  | { type: 'rest'; durationSeconds: number; nextName: string }

export const GROUP_COLORS: Record<Group, [string, string]> = {
  Mobility: ['#86efac', '#14532d'],
  Push:     ['#fdba74', '#7c2d12'],
  Pull:     ['#93c5fd', '#1e3a5f'],
  Legs:     ['#c4b5fd', '#3b0764'],
  Core:     ['#fca5a5', '#7f1d1d'],
  Conditioning: ['#d8ff68', '#2d3a04'],
}

export const exercises: Exercise[] = [
  {
    id: 'deep-squat',
    name: 'Deep Squat Hold',
    group: 'Mobility',
    durationSeconds: 45,
    durationLabel: '45 sec',
    level: 'Base',
    cue: 'Hielen zwaar, borst open, adem rustig door je neus.',
    scale: 'Hou een deurpost vast of plaats hakken op een boek.',
    symbol: '⌇',
    gradient: ['#86efac', '#14532d'],
    animation: 'float',
  },
  {
    id: 'worlds-greatest',
    name: "World's Greatest Stretch",
    group: 'Mobility',
    durationSeconds: 60,
    durationLabel: '60 sec/zijde',
    level: 'Base',
    cue: 'Lange uitvalspas, elleboog naar grond, daarna roteren naar plafond.',
    scale: 'Laat achterste knie zakken en verkort de beweging.',
    symbol: '⟲',
    gradient: ['#6ee7b7', '#064e3b'],
    animation: 'spin',
  },
  {
    id: 'push-up',
    name: 'Push-up',
    group: 'Push',
    durationSeconds: 40,
    durationLabel: '40 sec',
    level: 'Base',
    cue: 'Ribben laag, handen onder schouders, borst raakt bijna de vloer.',
    scale: 'Handen op bank/tafel of knieën op vloer.',
    symbol: '↑',
    gradient: ['#fdba74', '#7c2d12'],
    animation: 'bounce',
  },
  {
    id: 'pike',
    name: 'Pike Push-up',
    group: 'Push',
    durationSeconds: 30,
    durationLabel: '30 sec',
    level: 'Strong',
    cue: 'Heupen hoog, hoofd richting vloer, duw jezelf schuin terug.',
    scale: 'Maak de hoek kleiner of doe shoulder taps.',
    symbol: '△',
    gradient: ['#fb923c', '#7c2d12'],
    animation: 'rock',
  },
  {
    id: 'pull-up',
    name: 'Pull-up / Row',
    group: 'Pull',
    durationSeconds: 40,
    durationLabel: '40 sec',
    level: 'Strong',
    cue: 'Start vanuit schouderbladen, trek borst naar stang/ringen.',
    scale: 'Gebruik resistance band of doe towel rows in deurpost.',
    symbol: '↕',
    gradient: ['#93c5fd', '#1e3a5f'],
    animation: 'float',
  },
  {
    id: 'air-squat',
    name: 'Air Squat',
    group: 'Legs',
    durationSeconds: 40,
    durationLabel: '40 sec',
    level: 'Base',
    cue: 'Knieën volgen tenen, romp lang, gecontroleerd omlaag.',
    scale: 'Box squat naar stoel.',
    symbol: '⌄',
    gradient: ['#c4b5fd', '#3b0764'],
    animation: 'bounce',
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    group: 'Legs',
    durationSeconds: 40,
    durationLabel: '40 sec',
    level: 'Base',
    cue: 'Stap achteruit, voorste voet blijft volledig geaard.',
    scale: 'Split squat zonder stap.',
    symbol: '↙',
    gradient: ['#a78bfa', '#4c1d95'],
    animation: 'rock',
  },
  {
    id: 'bulgarian',
    name: 'Bulgarian Split Squat',
    group: 'Legs',
    durationSeconds: 40,
    durationLabel: '8/zijde',
    level: 'Beast',
    cue: 'Langzaam zakken, voorste hak zwaar, heup recht vooruit.',
    scale: 'Normale split squat of lagere verhoging.',
    symbol: '◇',
    gradient: ['#818cf8', '#312e81'],
    animation: 'pulse',
  },
  {
    id: 'hollow',
    name: 'Hollow Hold',
    group: 'Core',
    durationSeconds: 30,
    durationLabel: '30 sec',
    level: 'Strong',
    cue: 'Onderrug in vloer, ribben laag, armen lang.',
    scale: 'Knieën gebogen of dead bug.',
    symbol: '◡',
    gradient: ['#fca5a5', '#7f1d1d'],
    animation: 'shimmer',
  },
  {
    id: 'plank',
    name: 'Hardstyle Plank',
    group: 'Core',
    durationSeconds: 30,
    durationLabel: '30 sec',
    level: 'Base',
    cue: 'Span billen, quads en buik alsof je een stoot opvangt.',
    scale: 'Korte sets van 10 seconden.',
    symbol: '▬',
    gradient: ['#f87171', '#991b1b'],
    animation: 'pulse',
  },
  {
    id: 'burpee',
    name: 'Burpee',
    group: 'Conditioning',
    durationSeconds: 60,
    durationLabel: '10 reps EMOM',
    level: 'Beast',
    cue: 'Vloeiend, niet slordig. Stap terug als springen te duur wordt.',
    scale: 'No-push-up burpee of squat thrust.',
    symbol: '✦',
    gradient: ['#d8ff68', '#2d3a04'],
    animation: 'bounce',
  },
  {
    id: 'bear',
    name: 'Bear Crawl',
    group: 'Conditioning',
    durationSeconds: 30,
    durationLabel: '30 sec',
    level: 'Strong',
    cue: 'Knieën laag, rug stil, tegengesteld hand/voet bewegen.',
    scale: 'Bear hover hold.',
    symbol: '⁂',
    gradient: ['#bef264', '#365314'],
    animation: 'float',
  },
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    group: 'Legs',
    durationSeconds: 45,
    durationLabel: '45 sec',
    level: 'Base',
    cue: 'Rug plat, knieën 90°, handen van benen af.',
    scale: 'Minder diep of korter.',
    symbol: '⊓',
    gradient: ['#c4b5fd', '#3b0764'],
    animation: 'shimmer',
  },
  {
    id: 'shoulder-cars',
    name: 'Shoulder CARs',
    group: 'Mobility',
    durationSeconds: 45,
    durationLabel: '45 sec/arm',
    level: 'Base',
    cue: 'Langzame, maximale cirkelbeweging met de arm. Geen compensatie.',
    scale: 'Kleiner bereik of met ondersteuning.',
    symbol: '○',
    gradient: ['#86efac', '#14532d'],
    animation: 'spin',
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    group: 'Mobility',
    durationSeconds: 120,
    durationLabel: '2 min',
    level: 'Base',
    cue: '4 sec in — 4 sec vast — 4 sec uit — 4 sec vast. Herhaal.',
    scale: 'Begin met 3 sec per fase.',
    symbol: '□',
    gradient: ['#6ee7b7', '#064e3b'],
    animation: 'pulse',
  },
]

// Lookup map for matching session item strings to exercises
const exerciseLookup = new Map<string, Exercise>()
exercises.forEach((ex) => {
  exerciseLookup.set(ex.id, ex)
  exerciseLookup.set(ex.name.toLowerCase(), ex)
})

// Common aliases used in session blocks
const aliases: Record<string, string> = {
  'deep squat hold': 'deep-squat',
  "world's greatest stretch": 'worlds-greatest',
  'shoulder cars': 'shoulder-cars',
  'push-up': 'push-up',
  'pike push-up': 'pike',
  'pull-up / row': 'pull-up',
  'air squat': 'air-squat',
  'hardstyle plank': 'plank',
  'hollow hold': 'hollow',
  'reverse lunge': 'reverse-lunge',
  'bulgarian split squat': 'bulgarian',
  'bear crawl': 'bear',
  'burpee': 'burpee',
  'wall sit': 'wall-sit',
  'box breathing': 'box-breathing',
}

export function resolveExercise(name: string): Exercise | undefined {
  const key = name.toLowerCase().trim()
  const id = aliases[key]
  if (id) return exerciseLookup.get(id)
  return exerciseLookup.get(key)
}

export const week: Session[] = [
  {
    day: 'Maandag', shortDay: 'Ma',
    title: 'Push + Engine',
    focus: 'Borst, schouders, core, conditieprikkel',
    time: 20, intent: 'Start de week met controle en kracht.',
    blocks: [
      { label: 'Mobility', work: '3 min flow', items: ['Deep Squat Hold', "World's Greatest Stretch", 'Shoulder CARs'] },
      { label: 'Strength', work: '2 rondes · 40/20', items: ['Push-up', 'Pike Push-up', 'Air Squat', 'Hardstyle Plank'] },
      { label: 'Finisher', work: 'EMOM 5', items: ['Burpee'] },
    ],
  },
  {
    day: 'Dinsdag', shortDay: 'Di',
    title: 'Pull + Posture',
    focus: 'Rug, grip, schouderbladen, houding',
    time: 18, intent: 'Compenseer zitten, dragen en werken achter laptop.',
    blocks: [
      { label: 'Mobility', work: '4 min', items: ['Shoulder CARs', "World's Greatest Stretch"] },
      { label: 'Strength', work: '3 rondes', items: ['Pull-up / Row', 'Reverse Lunge', 'Hollow Hold'] },
      { label: 'Reset', work: '2 min', items: ['Box Breathing'] },
    ],
  },
  {
    day: 'Woensdag', shortDay: 'Wo',
    title: 'Legs + Capacity',
    focus: 'Benen, heupen, trail-ready basis',
    time: 22, intent: 'Sterke benen zonder gym of machines.',
    blocks: [
      { label: 'Prime', work: '3 min', items: ['Deep Squat Hold', "World's Greatest Stretch"] },
      { label: 'Strength', work: '4 sets', items: ['Bulgarian Split Squat', 'Air Squat', 'Wall Sit'] },
      { label: 'Finisher', work: '6 min', items: ['Bear Crawl', 'Burpee'] },
    ],
  },
  {
    day: 'Donderdag', shortDay: 'Do',
    title: 'Conditioning',
    focus: 'Hartslag, zweet, mentale scherpte',
    time: 16, intent: 'Kort genoeg om altijd te doen, scherp genoeg om te tellen.',
    blocks: [
      { label: 'Warm-up', work: '3 min', items: ['Air Squat', "World's Greatest Stretch"] },
      { label: 'Main', work: '10 min AMRAP', items: ['Burpee', 'Push-up', 'Air Squat'] },
      { label: 'Downshift', work: '3 min', items: ['Box Breathing'] },
    ],
  },
  {
    day: 'Vrijdag', shortDay: 'Vr',
    title: 'Full Body Minimum',
    focus: 'Alles raken, niets slopen',
    time: 20, intent: 'De sessie voor drukke dagen.',
    blocks: [
      { label: 'Flow', work: '5 min', items: ["World's Greatest Stretch", 'Deep Squat Hold'] },
      { label: 'Circuit', work: '12 min', items: ['Push-up', 'Pull-up / Row', 'Reverse Lunge', 'Hollow Hold'] },
      { label: 'Finish', work: '3 min', items: ['Bear Crawl'] },
    ],
  },
  {
    day: 'Zaterdag', shortDay: 'Za',
    title: 'Outdoor Athlete',
    focus: 'Zone 2 · wandelen · run · hike · spelen',
    time: 45, intent: 'Neem kinderen/hond mee. Dit is je lange levensduurblok.',
    blocks: [
      { label: 'Choice', work: '45-90 min', items: ['Trailrun', 'Stevige wandeling', 'Fietsen', 'Hike'] },
    ],
  },
  {
    day: 'Zondag', shortDay: 'Zo',
    title: 'Recovery Ritual',
    focus: 'Mobiliteit, adem, reset',
    time: 12, intent: 'Herstellen zonder de streak te breken.',
    blocks: [
      { label: 'Mobility', work: '10 min', items: ['Deep Squat Hold', "World's Greatest Stretch", 'Shoulder CARs'] },
      { label: 'Breath', work: '2 min', items: ['Box Breathing'] },
    ],
  },
]

export function buildWorkoutSteps(session: Session): WorkoutStep[] {
  const steps: WorkoutStep[] = []
  session.blocks.forEach((block, blockIndex) => {
    steps.push({ type: 'block-intro', label: block.label, work: block.work, blockIndex })
    block.items.forEach((itemName, i) => {
      const ex = resolveExercise(itemName)
      if (ex) {
        steps.push({ type: 'exercise', exercise: ex, durationSeconds: ex.durationSeconds })
      } else {
        const group: Group = block.label === 'Finisher' || block.label === 'Main' ? 'Conditioning' :
          block.label === 'Mobility' || block.label === 'Flow' ? 'Mobility' : 'Conditioning'
        steps.push({ type: 'freestyle', name: itemName, durationSeconds: 45, group })
      }
      const isLast = i === block.items.length - 1
      const nextItem = block.items[i + 1]
      if (!isLast) {
        const nextEx = resolveExercise(nextItem)
        steps.push({
          type: 'rest',
          durationSeconds: 15,
          nextName: nextEx?.name ?? nextItem,
        })
      }
    })
    if (blockIndex < session.blocks.length - 1) {
      const nextBlock = session.blocks[blockIndex + 1]
      steps.push({
        type: 'rest',
        durationSeconds: 30,
        nextName: nextBlock.label,
      })
    }
  })
  return steps
}

export function todayIndex() {
  const js = new Date().getDay()
  return js === 0 ? 6 : js - 1
}

export function getLevel(totalWorkouts: number): Level {
  if (totalWorkouts >= 42) return 'Beast'
  if (totalWorkouts >= 14) return 'Strong'
  return 'Base'
}

export const LEVEL_LABELS: Record<Level, string> = {
  Base: 'Base',
  Strong: 'Strong',
  Beast: 'Beast',
}

export const LEVEL_THRESHOLDS: Record<Level, number> = {
  Base: 0,
  Strong: 14,
  Beast: 42,
}
