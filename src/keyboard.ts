import { ExtensionContext } from 'vscode'
import * as Rhythm from './rhythm'
import * as Sound from './sound'

export const onPress = async (key: string): Promise<void> => {
  if (Rhythm.isSync()) {
    Rhythm.addToQueue(key)
    Rhythm.start()
  } else {
    const sound = Sound.getSoundKey(key)
    Sound.play(sound)
  }
}
