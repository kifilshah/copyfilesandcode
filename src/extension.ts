import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { readDirectory } from './readDirectory';
import { generateCopyList } from './generateCopyList';
import { restoreFiles } from './restoreFiles';  
import { copyFiles } from './copyFiles';

interface CopiedFile {
  filePath: string;
  content: string; 
}

let copyListContent = '';
let copiedFilesContent: CopiedFile[] = [];

export function activate(context: vscode.ExtensionContext) {

  const rootPath = vscode.workspace.workspaceFolders![0].uri.fsPath;
  const copyListPath = path.join(rootPath, 'copylist.txt');
  const copiedFilesPath = path.join(rootPath, 'copiedfiles.json');

  copyListContent = fs.readFileSync(copyListPath, 'utf-8');
  copiedFilesContent = JSON.parse(fs.readFileSync(copiedFilesPath, 'utf8')) as CopiedFile[];

  let disposable = vscode.commands.registerCommand('copyfilesandcode.copyFiles', copyFiles);
  let generateDisposable = vscode.commands.registerCommand('copyfilesandcode.generateCopyList', generateCopyList);
  let restoreDisposable = vscode.commands.registerCommand('copyfilesandcode.restoreFiles', restoreFiles);
  context.subscriptions.push(disposable, generateDisposable, restoreDisposable);

  let openWebView = vscode.commands.registerCommand('copyfilesandcode.openWebview', function () {
    const panel = vscode.window.createWebviewPanel(
      'copyFilesAndCodeCommands',  
      'Copy Files And Code Commands',
      vscode.ViewColumn.One,
      {enableScripts: true} 
    );

    panel.webview.html = `
      <html>
        <body>
        
          <button onclick="copyFiles()">Copy Files & Code</button>
          <button onclick="generateCopyList()">Generate Copy List</button>
          <button onclick="restoreFiles()">Restore Files</button>
        
          <h1>Edit Copy List</h1>
          <textarea id="copyList">${copyListContent}</textarea>
          <button onclick="saveCopyList()">Save Copy List</button>
        
          <h1>Edit Copied Files</h1>
          <textarea id="copiedFiles">${JSON.stringify(copiedFilesContent, null, 2)}</textarea>
          <button onclick="saveCopiedFiles()">Save Copied Files</button>

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
            
            function saveCopyList() {
              vscode.postMessage({
                command: 'saveCopyList',
                content: document.getElementById('copyList').value
              });
            }
            
            function saveCopiedFiles() {
              vscode.postMessage({
                command: 'saveCopiedFiles',
                content: document.getElementById('copiedFiles').value 
              });
            }
          </script>
        
        </body>
      </html>
    `;

    panel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case 'saveCopyList':
          copyListContent = message.content;
          fs.writeFileSync(copyListPath, copyListContent);
          return;
      
        case 'saveCopiedFiles':
          copiedFilesContent = JSON.parse(message.content) as CopiedFile[];
          fs.writeFileSync(copiedFilesPath, JSON.stringify(copiedFilesContent));
          return;
      } 
    });
  });

  context.subscriptions.push(openWebView);  
}

export function deactivate() {}

function getWebviewContent(context: vscode.ExtensionContext) {
  return `
    <html>
      <body>
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
    </html>
  `;
}