import * as vscode from 'vscode';
import { readDirectory } from './readDirectory';
import { generateCopyList } from './generateCopyList';
import { restoreFiles } from './restoreFiles';
import { copyFiles } from './copyFiles';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('copyfilesandcode.copyFiles', copyFiles);

    let generateDisposable = vscode.commands.registerCommand('copyfilesandcode.generateCopyList', generateCopyList);

    let restoreDisposable = vscode.commands.registerCommand('copyfilesandcode.restoreFiles', restoreFiles);

    context.subscriptions.push(disposable, generateDisposable, restoreDisposable);
}
