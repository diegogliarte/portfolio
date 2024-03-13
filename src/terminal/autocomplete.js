import DirectoryManager from "./DirectoryManager";
import Commands from "./Commands";

export const handleAutocomplete = (terminal) => {
    const { command, args } = Commands.parseStdin(terminal.state.stdin);
    let output = null;

    if (!Commands.isCommand(command)) {
        output = handleNonCommandAutocomplete(command, terminal);
    } else {
        output = handleCommandAutocomplete(command, args, terminal);
    }

    Commands.executeCommand(terminal, output);
};

const handleNonCommandAutocomplete = (command, terminal) => {
    const autocompleteElements = autocompleteFromList(command, Commands.getVisibleCommands());
    return processAutocompleteElements(autocompleteElements, command, terminal);
};

const handleCommandAutocomplete = (command, args, terminal) => {
    const autocompleteMethod = Commands.commands[command]?.autocomplete || Commands.commands.default.autocomplete;
    const autocompleteElements = autocompleteMethod(terminal, args);
    return processAutocompleteElements(autocompleteElements, command, terminal, true);
};


const processAutocompleteElements = (elements, command, terminal, isCommand = false) => {
    if (elements && elements.length === 1) {
        const fullCommand = isCommand ? `${command} ${elements[0]}` : elements[0];
        terminal.setState({ stdin: fullCommand, cursorPosition: fullCommand.length });
        return null;
    } else if (elements?.length > 1) {
        return [elements.join("  ")];
    }
    return null;
};

export const autocompleteFromList = (element, list) => {
    return list.filter(e => e.startsWith(element));
};

export function autocompleteBlob(args, includeFile = true, includeFolder = true) {
    const possibleDirectory = args.length > 0 ? args[0] : ""
    let directories = possibleDirectory.split("/")

    let currentDirectory = DirectoryManager.currentDirectory
    let path = ""
    for (let directory of directories) {
        const subDirectories = currentDirectory.subDirectories
            .filter(subDirectory => {
                return (subDirectory.isFolder() && includeFolder) || (subDirectory.isFile() && includeFile)
            })
            .map(subDirectory => {
                return subDirectory.name
            })

        let autocompleteElements = autocompleteFromList(directory, subDirectories)

        if (autocompleteElements && autocompleteElements.length === 1) {
            const element = autocompleteElements[0]
            path += element + (currentDirectory.getSubDirectory(element).isFolder() ? "/" : "")
            currentDirectory = currentDirectory.getSubDirectory(element)
        } else if (autocompleteElements.length >= 1) {
            return autocompleteElements.map(directory => {
                    let blob = currentDirectory.getSubDirectory(directory)
                    return `<span class=${blob.type}>${blob.name}</span>`
                })
        } else {
            return null
        }
    }

    return [path]
}

export function autocompleteFolders(terminal, args) {
    return autocompleteBlob(args, false, true)
}

export function autocompleteFiles(terminal, args) {
    return autocompleteBlob(args, true, false)
}

export function autocompleteFoldersAndFiles(terminal, args) {
    return autocompleteBlob(args, true, true)
}

export function autocompleteTheme(terminal, args) {
    return autocompleteFromList(args.length === 1 ? args[0] : "", terminal.themes)
}