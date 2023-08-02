import DirectoryManager from "../DirectoryManager";
import Commands from "./Commands";

export function handleAutocomplete(terminal) {
    let {command, args} = Commands.parseStdin(terminal.state.stdin);
    let autocompleteElements
    let output
    if (!Commands.isCommand(command)) {
        autocompleteElements = autocompleteFromList(command, Commands.getVisibleCommands());
        if (autocompleteElements && autocompleteElements.length === 1) {
            let element = autocompleteElements[0]
            terminal.setState({stdin: element, cursorPosition: element.length})
            output = null
        } else if (autocompleteElements) {
            output = [autocompleteElements.join("  ")]
        }

    } else {
        const autocompleteMethod = Commands.commands[command]["autocomplete"] || Commands.commands["default"]["autocomplete"]
        autocompleteElements = autocompleteMethod(terminal, args)

        if (autocompleteElements && autocompleteElements.length === 1) {
            let element = autocompleteElements[0]
            terminal.setState({stdin: `${command} ${element}`, cursorPosition: `${command} ${element}`.length})
            output = null
        } else if (autocompleteElements) {
            output = [autocompleteElements.join("  ")]
        } else {
            return
        }
    }
    Commands.executeCommand(terminal, output)
}

export function autocompleteFromList(element, list) {
    let commandsAutocomplete = list.filter(e => {
        return element === e.slice(0, element.length)
    })

    return commandsAutocomplete || null;
}

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
        } else if (autocompleteElements) {
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