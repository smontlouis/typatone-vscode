import { ExtensionContext } from 'vscode'
import { getSoundKey, Theme } from './utils'
const _isWindows = process.platform === 'win32'
const player = require('play-sound')()
const cp = require('child_process')
const path = require('path')

let queue: string[] = []
let playing = false
let timeout: NodeJS.Timeout | null
let bpm = 240
let index = -1
let loop = false
let context: ExtensionContext
let theme: Theme = 'natural'

export const setContext = (ctx: ExtensionContext) => (context = ctx)
export const setTheme = (t: Theme) => (t = theme)

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

export const play = (sound: string, theme: Theme = 'natural') => {
  const _playerWindowsPath = path.join(
    __dirname,
    '..',
    'audio',
    theme,
    'play.exe'
  )

  const filePath = `${__dirname}/../audio/${theme}/${sound}.mp3`

  if (_isWindows) {
    cp.execFile(_playerWindowsPath, [filePath])
  } else {
    player.play(filePath, (err: any) => {
      if (err) {
        console.error(err)
      }
    })
  }
}

const ping = () => {
  if (!playing) {
    return
  }

  console.log('ping', Date.now())

  index += 1
  if (index >= queue.length && !loop) {
    stop()
    return
  }
  update()

  timeout = setTimeout(ping, bpmToMillis())
}

const update = () => {
  index = index % queue.length
  const key = queue[index]
  const sound = getSoundKey(key)
  const theme = context.globalState.get('typatone.theme', 'natural')

  play(sound, theme)
}

const bpmToMillis = (v?: number) => 60000 / (v || bpm)
