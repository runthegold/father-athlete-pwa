'use client'

const LOG_KEY = 'fa-log'
const LEVEL_KEY = 'fa-level'

export function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10)
}

export function loadLog(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveLog(log: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOG_KEY, JSON.stringify(log))
}

export function markComplete(log: string[]): string[] {
  const key = dateKey()
  if (log.includes(key)) return log
  const next = [...log, key]
  saveLog(next)
  return next
}

export function getStreak(log: string[]): number {
  let streak = 0
  const cursor = new Date()
  // eslint-disable-next-line no-constant-condition
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

export function getLongestStreak(log: string[]): number {
  if (!log.length) return 0
  const sorted = [...log].sort()
  let max = 1, cur = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = (curr.getTime() - prev.getTime()) / 86400000
    if (diff === 1) { cur++; max = Math.max(max, cur) }
    else if (diff > 1) cur = 1
  }
  return max
}

export function getThisWeekCount(log: string[]): number {
  const now = new Date()
  const day = now.getDay() === 0 ? 6 : now.getDay() - 1
  let count = 0
  for (let i = 0; i <= day; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    if (log.includes(dateKey(d))) count++
  }
  return count
}

export function getThisMonthCount(log: string[]): number {
  const prefix = new Date().toISOString().slice(0, 7)
  return log.filter((d) => d.startsWith(prefix)).length
}

// Returns last N days as { date: string, done: boolean }[]
export function getHeatmapData(log: string[], days = 91) {
  const result: { date: string; done: boolean; dayOfWeek: number }[] = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = dateKey(d)
    result.push({ date: key, done: log.includes(key), dayOfWeek: d.getDay() })
  }
  return result
}
