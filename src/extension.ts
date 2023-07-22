import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const generateCopyList = () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace is open');
            return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const copyListPath = path.join(rootPath, 'copylist.txt');
        const copiedFilesPath = path.join(rootPath, 'copiedfiles.txt');

        let copyList = '';

        fs.readdirSync(rootPath).forEach(file => {
            const filePath = path.join(rootPath, file);
            if (filePath !== copyListPath && filePath !== copiedFilesPath) {  // Exclude the copylist.txt and copiedfiles.txt files
                copyList += file + '\n';
            }
        });

        fs.writeFileSync(copyListPath, copyList);

        vscode.window.showInformationMessage('copylist.txt generated');
    };

    let disposable = vscode.commands.registerCommand('copyfilesandcode.copyFiles', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace is open');
            return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const copyListPath = path.join(rootPath, 'copylist.txt');
        const copiedFilesPath = path.join(rootPath, 'copiedfiles.txt');

        if (!fs.existsSync(copyListPath)) {
            generateCopyList();
        }

        const copyList = fs.readFileSync(copyListPath, 'utf-8').split('\n').filter(Boolean);
        let copiedContent = '';

        const readDirectory = (dirPath: string) => {
            const files = fs.readdirSync(dirPath);
            for (const file of files) {
                const filePath = path.join(dirPath, file);
                if (filePath === copiedFilesPath) {
                    continue;  // Skip the copiedfiles.txt file
                }
                if (fs.lstatSync(filePath).isDirectory()) {
                    readDirectory(filePath);
                } else {
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const relativePath = path.relative(rootPath, filePath);
                    copiedContent += `File: ${relativePath}\nContent:\n${fileContent}\n\n`;
                }
            }
        };

        for (const item of copyList) {
            const itemPath = path.join(rootPath, item);
            if (itemPath === copiedFilesPath) {
                continue;  // Skip the copiedfiles.txt file
            }
            if (fs.existsSync(itemPath)) {
                if (fs.lstatSync(itemPath).isDirectory()) {
                    readDirectory(itemPath);
                } else {
                    const fileContent = fs.readFileSync(itemPath, 'utf-8');
                    const relativePath = path.relative(rootPath, itemPath);
                    copiedContent += `File: ${relativePath}\nContent:\n${fileContent}\n\n`;
                }
            }
        }

        fs.writeFileSync(copiedFilesPath, copiedContent);

        vscode.window.showInformationMessage('Files copied to copiedfiles.txt');
    });

    let generateDisposable = vscode.commands.registerCommand('copyfilesandcode.generateCopyList', generateCopyList);

    context.subscriptions.push(disposable, generateDisposable);
}
