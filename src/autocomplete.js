import Directory from "./Directory";
import Commands from "./Commands";

export function handleAutocomplete(terminal) {
    let {command, args} = Commands.parseStdin(terminal.state.stdin);
    let output

    if (!Commands.isCommand(command)) {
        output = getAutocomplete(command, Commands.getVisibleCommands());
        if (typeof (output) === "string") {
            terminal.setState({stdin: output, cursorPosition: output.length})
            output = null
        } else if (output !== null && typeof (output) === "object") {
            output = [output.join("  ")]
        }

    } else {
        const autocompleteMethod = Commands.commands[command]["autocomplete"] || Commands.commands["default"]["autocomplete"]
        output = autocompleteMethod(terminal, args)
        if (typeof (output) === "string") {
            terminal.setState({stdin: `${command} ${output}`, cursorPosition: `${command} ${output}`.length})
            output = null
        } else if (output !== null && typeof (output) === "object") {
            output = [output.join("  ")]
        }
    }
    Commands.executeCommand(terminal, output)
}

export function getAutocomplete(element, list) {
    let commandsAutocomplete = list.filter(e => {
        return element === e.slice(0, element.length)
    })


    if (commandsAutocomplete.length === 1) {
        return commandsAutocomplete[0]
    } else if (commandsAutocomplete.length > 0) {
        return commandsAutocomplete
    }
    return null;
}

export function autocompleteBlob(args, includeFile = true, includeFolder = true) {
    const possibleDirectory = args.length > 0 ? args[0] : ""
    let directories = possibleDirectory.split("/")

    let currentDirectory = Directory.currentDirectory
    let path = ""
    for (let directory of directories) {
        const subDirectories = currentDirectory.subDirectories
            .filter(subDirectory => {
                return (subDirectory.isFolder() && includeFolder) || (subDirectory.isFile() && includeFile)
            })
            .map(subDirectory => {
                return subDirectory.name
            })
        let autocomplete = getAutocomplete(directory, subDirectories)
        if (typeof (autocomplete) === "string") {
            path += autocomplete + (currentDirectory.getSubDirectory(autocomplete).isFolder() ? "/" : "")
            currentDirectory = currentDirectory.getSubDirectory(autocomplete)
        } else if (autocomplete !== null) {
            return [
                autocomplete.map(directory => {
                    let blob = currentDirectory.getSubDirectory(directory)
                    return `<span class=${blob.type}>${blob.name}</span>`
                }).join("  ")
            ]
        } else {
            return null
        }
    }

    return path
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
    return getAutocomplete(args.length === 1 ? args[0] : "", terminal.themes)
}