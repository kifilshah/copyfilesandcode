import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export const generateCopyList = () => {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open');
        return;
    }

    const rootPath = workspaceFolders[0].uri.fsPath;
    const copyListPath = path.join(rootPath, 'copylist.txt');
    const copiedFilesPath = path.join(rootPath, 'copiedfiles.txt');

    if (fs.existsSync(copyListPath) && fs.readFileSync(copyListPath, 'utf-8').trim() !== '') {
        const copyList = fs.readFileSync(copyListPath, 'utf-8').split('\n').filter(Boolean);
        let newCopyList = '';

        for (const item of copyList) {
            const itemPath = path.join(rootPath, item);
            if (fs.existsSync(itemPath) && fs.lstatSync(itemPath).isDirectory()) {
                fs.readdirSync(itemPath).forEach(file => {
                    const filePath = path.join(item, file);
                    newCopyList += filePath + '\n';
                });
            } else {
                newCopyList += item + '\n';
            }
        }

        fs.writeFileSync(copyListPath, newCopyList);
    } else {
        let copyList = '';

        fs.readdirSync(rootPath).forEach(file => {
            const filePath = path.join(rootPath, file);
            if (filePath !== copyListPath && filePath !== copiedFilesPath) {  // Exclude the copylist.txt and copiedfiles.txt files
                copyList += file + '\n';
            }
        });

        fs.writeFileSync(copyListPath, copyList);
    }

    vscode.window.showInformationMessage('copylist.txt generated');
};
