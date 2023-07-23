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

    let openWebView = vscode.commands.registerCommand('copyfilesandcode.openWebview', function () {
        const panel = vscode.window.createWebviewPanel(
            'copyFilesAndCodeCommands',
            'Copy Files And Code Commands',
            vscode.ViewColumn.One,
            {enableScripts: true} // Enable JavaScript in the webview
        );

        panel.webview.html = getWebviewContent(context);

        // Listen to the webview's messages
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'copyfilesandcode.copyFiles':
                        vscode.commands.executeCommand('copyfilesandcode.copyFiles');
                        return;
                    case 'copyfilesandcode.generateCopyList':
                        vscode.commands.executeCommand('copyfilesandcode.generateCopyList');
                        return;
                    case 'copyfilesandcode.restoreFiles':
                        vscode.commands.executeCommand('copyfilesandcode.restoreFiles');
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });
    context.subscriptions.push(openWebView);
}

function getWebviewContent(context: vscode.ExtensionContext) {
    return `
        <html>
        <body>
            <h1>Commands</h1>
            <button onclick="copyFiles()">Copy Files & Code</button>
            <button onclick="generateCopyList()">Generate Copy List</button>
            <button onclick="restoreFiles()">Restore Files</button>

            <script>
                const vscode = acquireVsCodeApi();

                function copyFiles() {
                    vscode.postMessage({
                        command: 'copyfilesandcode.copyFiles'
                    });
                }

                function generateCopyList() {
                    vscode.postMessage({
                        command: 'copyfilesandcode.generateCopyList'
                    });
                }

                function restoreFiles() {
                    vscode.postMessage({
                        command: 'copyfilesandcode.restoreFiles'
                    });
                }
            </script>
        </body>
        </html>`;
}
