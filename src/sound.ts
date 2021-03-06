import { ExtensionContext } from 'vscode'
import symbolPattern from './patterns/all'
import letterPattern from './patterns/freqTable'

const player = require('play-sound')()

let theme: Theme = 'natural'
let playQueue: any[] = []
let context: ExtensionContext

export const init = (ctx: ExtensionContext) => {
  context = ctx
  setTheme(context.globalState.get('typatone.theme', 'natural'))
}
export const setTheme = (t: Theme) => {
  theme = t
  context.globalState.update('typatone.theme', t)
}

export const getTheme = () => theme

export const themes = [
  'natural',
  'beeps',
  'boards',
  'flutter',
  'spooky',
] as const

export type Theme = typeof themes[number]

export const play = (sound: string, t: Theme = theme) => {
  const filePath = `${__dirname}/../audio/${t}/${sound}.mp3`

  playQueue.push(
    player.play(filePath, (err: any) => {
      if (err && !err.killed) {
        console.error(err)
      }
    })
  )
}

export const stop = () => {
  playQueue.forEach((p) => p.kill())
  playQueue = []
}

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
