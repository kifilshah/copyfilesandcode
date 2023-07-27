import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { generateCopyList } from './generateCopyList';

export const copyFiles = async () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const copyListPath = path.join(rootPath, 'copylist.txt');
    const copiedFilesPath = path.join(rootPath, 'copiedfiles.json');

    if (!fs.existsSync(copyListPath)) {
        generateCopyList();
    }

    const copyList = fs.readFileSync(copyListPath, 'utf-8').split('\n').filter(Boolean);
    let copiedFiles: any[] = [];

    const readDirectory = (dirPath: string) => {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            if (filePath === copiedFilesPath) {
                continue;  // Skip the copiedfiles.json file
            }
            if (fs.lstatSync(filePath).isDirectory()) {
                readDirectory(filePath);
            } else {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const relativePath = path.relative(rootPath, filePath);
                copiedFiles.push({filePath: relativePath, content: fileContent});
            }
        }
    };

    for (const item of copyList) {
        const itemPath = path.join(rootPath, item);
        if (itemPath === copiedFilesPath) {
            continue;  // Skip the copiedfiles.json file
        }
        if (fs.existsSync(itemPath)) {
            if (fs.lstatSync(itemPath).isDirectory()) {
                readDirectory(itemPath);
            } else {
                const fileContent = fs.readFileSync(itemPath, 'utf-8');
                const relativePath = path.relative(rootPath, itemPath);
                copiedFiles.push({filePath: relativePath, content: fileContent});
            }
        }
    }

    fs.writeFileSync(copiedFilesPath, JSON.stringify(copiedFiles, null, 2));

    vscode.window.showInformationMessage('Files copied to copiedfiles.json');
};
