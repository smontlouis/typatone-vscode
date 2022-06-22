import symbolPattern from './patterns/all'
import letterPattern from './patterns/freqTable'

export const themes = [
  'natural',
  'beeps',
  'boards',
  'flutter',
  'spooky',
] as const

export type Theme = typeof themes[number]

export const getSoundKey = (v: string) => {
  const charIndex = symbolPattern.findIndex((item) => item === v)
  const letter = letterPattern[charIndex]

  if (['.', '{}', '[]', '()', '""'].includes(v)) {
    return 'punctuation'
  }
  // Sync symbol to letter sound
  if (letter) {
    return letter || 'i'
  }

  if (/\s/i.test(v)) {
    return 'space'
  }

  if (v.length === 0) {
    return 'backspace'
  }

  return v
}
