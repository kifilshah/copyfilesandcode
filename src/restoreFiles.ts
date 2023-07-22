import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export const restoreFiles = () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const copiedFilesPath = path.join(rootPath, 'copiedfiles.txt');

    if (!fs.existsSync(copiedFilesPath)) {
        vscode.window.showErrorMessage('No copied files to restore');
        return;
    }

    const copiedContent = fs.readFileSync(copiedFilesPath, 'utf-8');
    const copiedFiles = copiedContent.split('\n\n').filter(Boolean);

    for (const copiedFile of copiedFiles) {
        const [header, ...contentLines] = copiedFile.split('\n');
        const relativePath = header.replace('File: ', '');
        const fileContent = contentLines.join('\n');
        const filePath = path.join(rootPath, relativePath);

        // Check if the path is a directory
        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isDirectory()) {
            continue;  // Skip directories
        }

        fs.writeFileSync(filePath, fileContent);
    }

    vscode.window.showInformationMessage('Files restored from copiedfiles.txt');
};

