// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as Keyboard from './keyboard'
import * as Rhythm from './rhythm'
import * as Sound from './sound'

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "typatone" is now active!')

  let disposable: vscode.Disposable

  // Enable typatone
  disposable = vscode.commands.registerCommand(`typatone.enable`, async () => {
    context.globalState.update('typatone.isActive', true)
    vscode.window.showInformationMessage('Typatone enabled')
  })
  context.subscriptions.push(disposable)

  // Disable typatone
  disposable = vscode.commands.registerCommand(`typatone.disable`, async () => {
    context.globalState.update('typatone.isActive', false)
    vscode.commands.executeCommand('typatone.stop')
    vscode.window.showInformationMessage('Typatone disabled')
  })
  context.subscriptions.push(disposable)

  // Stop all sounds
  disposable = vscode.commands.registerCommand(`typatone.stop`, async () => {
    Rhythm.stop()
    Sound.stop()
  })
  context.subscriptions.push(disposable)

  // Handle keypress
  disposable = vscode.workspace.onDidChangeTextDocument(
    (event: vscode.TextDocumentChangeEvent) => {
      if (!context.globalState.get('typatone.isActive', true)) return
      const key = event.contentChanges[0].text
      Keyboard.onPress(key)
    }
  )
  context.subscriptions.push(disposable)

  // Choose a theme
  disposable = vscode.commands.registerCommand(
    `typatone.changeTheme`,
    async () => {
      const selectedTheme = await vscode.window.showQuickPick(
        Sound.themes.map((label) => ({
          label,
          picked: Sound.getTheme() === label,
        })),
        {
          onDidSelectItem: (item: vscode.QuickPickItem) => {
            Sound.stop()
            Sound.play('0', item.label as Sound.Theme)
          },
          placeHolder: 'Select a theme',
        }
      )

      Sound.stop()
      console.log('selectedTheme', selectedTheme)
      if (selectedTheme) {
        Sound.setTheme(selectedTheme?.label as Sound.Theme)
      }
    }
  )
  context.subscriptions.push(disposable)

  // Settings
  disposable = vscode.commands.registerCommand(
    `typatone.settings`,
    async () => {
      const options = await vscode.window.showQuickPick(
        [
          {
            label: 'Tempo mode',
            detail: 'The melody is played on a tempo',
            picked: Rhythm.isSync(),
          },

          {
            label: 'Loop',
            description: 'max: 3',
            detail: 'Loop the sequence in tempo mode',
            picked: Rhythm.isLooping(),
          },
        ],
        {
          placeHolder: 'Typatone options',
          canPickMany: true,
        }
      )

      if (options) {
        Rhythm.setSync(Boolean(options.find((o) => o.label === 'Tempo mode')))
        Rhythm.setLoop(Boolean(options.find((o) => o.label === 'Loop')))

        Rhythm.stop()
        Sound.stop()
      }
    }
  )
  context.subscriptions.push(disposable)

  Rhythm.init(context)
  Sound.init(context)
}

// this method is called when your extension is deactivated
export function deactivate() {}
