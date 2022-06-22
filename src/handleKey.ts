import { ExtensionContext } from 'vscode'
import play from './play'
import * as Rhythm from './rhythm'
import { getSoundKey } from './utils'

let isSync = true

export const handleKey = async (
  key: string,
  context: ExtensionContext
): Promise<void> => {
  if (isSync) {
    Rhythm.addToQueue(key)
    Rhythm.start()
  } else {
    const sound = getSoundKey(key)
    const theme = context.globalState.get('typatone.theme', 'natural')
    play(sound, theme)
  }
}
