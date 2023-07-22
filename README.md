# Copy Files and Code VS Code Extension

This extension allows you to copy the contents of files and their structure in your project to a text file. It's useful when you want to share the structure of your project and the contents of some files without sharing the entire project.

## Features

- **Copy Files & Code**: This command reads a `copylist.txt` file in your workspace root, and copies the contents of the files and directories listed in it to a `copiedfiles.txt` file.

- **Generate Copy List**: This command generates a `copylist.txt` file in your workspace root, listing all files and directories in the workspace.

## Usage

1. Open your project in VS Code.

2. Run the `Generate Copy List` command from the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) to generate the `copylist.txt` file.

3. Modify the `copylist.txt` file to include only the files and directories you want to copy.

4. Run the `Copy Files & Code` command from the command palette to copy the contents of the files and directories listed in `copylist.txt` to `copiedfiles.txt`.

## Installation

You can install this extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/vscode).

## Contributing

If you have suggestions for how this extension could be improved, or want to report a bug, open an issue on the GitHub repository.

## License

This extension is licensed under the MIT License.
