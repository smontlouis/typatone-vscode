// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import { handleKey } from './handleKey'
import play from './play'
import { Theme, themes } from './utils'
import * as Rhythm from './rhythm'

let isActive: boolean

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "typatone" is now active!')

  // is the extension activated? yes by default.
  isActive = context.globalState.get('typatone.isActive', true)

  let disposable: vscode.Disposable

  // Enable typatone
  disposable = vscode.commands.registerCommand(`typatone.enable`, async () => {
    context.globalState.update('typatone.isActive', true)
    isActive = true
  })
  context.subscriptions.push(disposable)

  // Disable typatone
  disposable = vscode.commands.registerCommand(`typatone.disable`, async () => {
    context.globalState.update('typatone.isActive', false)
    isActive = false
  })
  context.subscriptions.push(disposable)

  // Handle keypress
  disposable = vscode.workspace.onDidChangeTextDocument(
    (event: vscode.TextDocumentChangeEvent) => {
      if (!isActive) return
      const key = event.contentChanges[0].text
      handleKey(key, context)
    }
  )
  context.subscriptions.push(disposable)

  // Choose a theme
  disposable = vscode.commands.registerCommand(
    `typatone.changeTheme`,
    async () => {
      const selectedTheme = await vscode.window.showQuickPick(
        themes.map((label) => ({ label })),
        {
          onDidSelectItem: (item: vscode.QuickPickItem) => {
            play('0', item.label as Theme)
          },
        }
      )

      context.globalState.update('typatone.theme', selectedTheme?.label)
    }
  )
  context.subscriptions.push(disposable)

  Rhythm.setContext(context)
}

// this method is called when your extension is deactivated
export function deactivate() {}
