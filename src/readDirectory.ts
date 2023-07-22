import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const readdirAsync = promisify(fs.readdir);
const readFileAsync = promisify(fs.readFile);

export const readDirectory = async (
    dirPath: string,
    rootPath: string,
    visitedDirs: Set<string>,
    processFile: (relativePath: string, fileContent: string) => void
) => {
    if (visitedDirs.has(dirPath)) {
        return;
    }
    visitedDirs.add(dirPath);

    try {
        const files = await readdirAsync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = await fs.promises.lstat(filePath);

            // Handle symbolic links
            if (stat.isSymbolicLink()) {
                continue;
            }

            if (stat.isDirectory()) {
                await readDirectory(filePath, rootPath, visitedDirs, processFile);
            } else {
                const fileContent = await readFileAsync(filePath, 'utf-8');
                const relativePath = path.relative(rootPath, filePath);
                processFile(relativePath, fileContent);
            }
        }
    } catch (error) {
        console.error(error);
    }
};
