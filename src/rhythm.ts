import { ExtensionContext } from 'vscode'
import * as Sound from './sound'

let queue: string[] = []

let playing = false
let sync = true
let timeout: NodeJS.Timeout | null
let index = -1
let loop: boolean
let loopIndex = 0
let maxLoopTimes = 2

let context: ExtensionContext

const bpms = {
  natural: 240,
  beeps: 400,
  boards: 40,
  flutter: 80,
  spooky: 100,
}

export const init = (ctx: ExtensionContext) => {
  context = ctx
  setLoop(context.globalState.get('typatone.loop', false))
  setSync(context.globalState.get('typatone.sync', true))
}

export const setLoop = (l: boolean) => {
  loop = l
  context.globalState.update('typatone.loop', l)
}
export const isLooping = () => loop

export const setSync = (s: boolean) => {
  sync = s
  context.globalState.update('typatone.sync', s)
}
export const isSync = () => sync

export const addToQueue = (key: string) => queue.push(key)

export const start = () => {
  if (playing) {
    return
  }

  playing = true
  timeout = setTimeout(ping, bpmToMillis())
}

export const stop = () => {
  if (!playing) return

  timeout && clearTimeout(timeout)
  timeout = null
  playing = false
  index = -1
  queue = []
}

const ping = () => {
  if (!playing) {
    return
  }

  index += 1
  if (index >= queue.length && (!loop || loopIndex >= maxLoopTimes)) {
    loopIndex = 0
    stop()
    return
  }

  if (index >= queue.length) {
    loopIndex += 1
  }

  update()

  timeout = setTimeout(ping, bpmToMillis())
}

const update = () => {
  index = index % queue.length
  const key = queue[index]
  const sound = Sound.getSoundKey(key)

  Sound.play(sound)
}

const bpmToMillis = (v?: number) => 60000 / (v || bpms[Sound.getTheme()])
