import Directory from "./Directory";

class Commands {

    static commands = {
        "help": {
            "trigger": Commands.triggerHelpCommand
        },
        "clear": {
            "trigger": Commands.triggerClearCommand
        },
        "skills": {
            "trigger": Commands.triggerSkillsCommand
        },
        "whoami": {
            "trigger": Commands.triggerWhoAmICommand
        },
        "history": {
            "trigger": Commands.triggerHistory
        },
        "ls": {
            "trigger": Commands.triggerList
        },
        "cd": {
            "trigger": Commands.triggerChangeDir,
            "autocomplete": Commands.autocompleteFolders
        },
        "mkdir": {
            "trigger": Commands.triggerMakeDir
        },
        "touch": {
            "trigger": Commands.triggerTouch,
            "autocomplete": Commands.autocompleteFolders
        },
        "projects": {
            "trigger": Commands.triggerProjects
        },
        "work": {
            "trigger": Commands.triggerWork
        },
        "cv": {
            "trigger": Commands.triggerCV
        },
        "contact": {
            "trigger": Commands.triggerContact
        },
        "certs": {
            "trigger": Commands.triggerCerts
        },
        "rm": {
            "trigger": Commands.triggerRemove,
            "autocomplete": Commands.autocompleteBlob
        },
        "cat": {
            "trigger": Commands.triggerCat,
            "autocomplete": Commands.autocompleteBlob
        },
        "secret": {
            "trigger": Commands.triggerSecret,
        },
        "theme": {
            "trigger": Commands.triggerTheme,
            "autocomplete": Commands.autocompleteTheme
        },
        "'help'": {
            "trigger": Commands.triggerWrongHelp,
            "hidden": true
        },
        '"help"': {
            "trigger": Commands.triggerWrongHelp,
            "hidden": true
        },




        "default": {
            "autocomplete": () => {
                return null
            },
        }
    }

    static getVisibleCommands() {
        let visibleCommands = []
        for (let command of Object.keys(Commands.commands)) {
            if (!Commands.commands[command]["hidden"]) {
                visibleCommands.push(command)
            }
        }
        return visibleCommands.sort()
    }

    static handleAutocomplete(terminal) {
        let {command, args} = this.parseStdin(terminal.state.stdin);
        let output

        if (!Commands.isCommand(command)) {

            output = this.getAutocomplete(command, Commands.getVisibleCommands());
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

    static getAutocomplete(element, list) {
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

    static autocompleteBlob(args, includeFile = true, includeFolder = true) {
        const possibleDirectory = args.length > 0 ? args[0] : ""

        let directories = possibleDirectory.split("/")

        let currentDirectory = Directory.currentDirectory
        let path = ""
        for (let directory of directories) {
            const subDirectories = currentDirectory.subDirectories
                .filter(subDirectory => {
                    return subDirectory.isFolder() && includeFolder || subDirectory.isFile() && includeFile
                })
                .map(subDirectory => {
                    return subDirectory.name
                })
            let autocomplete = Commands.getAutocomplete(directory, subDirectories)
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

    static autocompleteFolders(terminal, args) {
        return Commands.autocompleteBlob(args, false, true)
    }

    static autocompleteFiles(terminal, args) {
        return Commands.autocompleteBlob(args, true, false)
    }

    static autocompleteTheme(terminal, args) {
        return Commands.getAutocomplete(args.length === 1 ? args[0] : "", terminal.themes)
    }


    static history = []
    static historyIndex = 0

    static getHistory(i) {
        Commands.historyIndex = Math.min(Math.max(Commands.historyIndex + i, 0), Commands.history.length)
        if (Commands.historyIndex === Commands.history.length) {
            return ""
        }
        return Commands.history[Commands.historyIndex]
    }

    static handleCommands(terminal) {
        let {command, args} = this.parseStdin(terminal.state.stdin);

        if (terminal.state.stdin !== "") {
            this.history.push(terminal.state.stdin)
        }

        let output = []
        if (Commands.isCommand(command)) {
            output = this.commands[command]["trigger"](terminal, args)
        } else if (command !== "") {
            output = Commands.handleCommandNotFound(terminal, args)
        } else {
            output = Commands.handleEmptyCommand()
        }

        terminal.setState({stdin: "", cursorPosition: 0});
        Commands.executeCommand(terminal, output);
    }


    static parseStdin(stdin) {
        let splitted = stdin.trim().split(" ")
        let command = splitted[0].trim()
        let args = splitted.slice(1)
            .map(arg => {
                return arg.trim()
            })
            .filter(arg => {
                return arg !== ""
            })
        return {command, args};
    }

    static handleCommandNotFound(terminal) {
        return [
            `${terminal.state.stdin}: command not found`
        ]
    }

    static handleEmptyCommand() {
        return []
    }

    static getCommands() {
        return this.commands
    }

    static isCommand(command) {
        return command in this.commands
    }

    static triggerHelpCommand() {
        const COMMANDS_MESSAGE = Commands.getVisibleCommands()
        return ["GNU bash, version 0.42",
            "These shell commands are defined internally. Type 'help' to see this list.",
            "",
            ...COMMANDS_MESSAGE
        ]
    }

    static triggerClearCommand(terminal) {
        terminal.setState({stdout: []})
        return null
    }

    static triggerSkillsCommand() {
        return ["Languages: Python, JavaScript, bash, Java, SQL, C/C++",
            "Python Tech: OpenCV, numpy, Flask, FastAPI",
            "Website Tech: HTML, CSS, VanillaJS, React",
            "General Tech: Unix, Git, GitHub, Docker, AWS"
        ]
    }

    static triggerWhoAmICommand() {
        const banner = "" +
            "     _ _                        _ _            _       \n" +
            "    | (_)                      | (_)          | |      \n" +
            "  __| |_  ___  __ _  ___   __ _| |_  __ _ _ __| |_ ___ \n" +
            " / _` | |/ _ \\/ _` |/ _ \\ / _` | | |/ _` | '__| __/ _ \\\n" +
            "| (_| | |  __/ (_| | (_) | (_| | | | (_| | |  | ||  __/\n" +
            " \\__,_|_|\\___|\\__, |\\___/ \\__, |_|_|\\__,_|_|   \\__\\___|\n" +
            "               __/ |       __/ |                       \n" +
            "              |___/       |___/                        " +
            ""
        return [
            "",
            "",
            ...banner.split("\n"),
            "",
            "",
            "I am Diego González, a Sotware Developer located in Spain. Currently a CS and Business student with +1 " +
            "year of professional experience as a part-time software developer. My work experience is quite extensive " +
            "due to working on a small team and being involved in every step towards the final product. Always " +
            "learning new technologies and facing new challenges!"
        ]
    }

    static triggerHistory() {
        return [
            ...Commands.history.map((command, i) => {
                return `${i + 1} ${command}`
            })
        ]
    }

    static triggerList() {
        if (Directory.currentDirectory.subDirectories.length === 0) {
            return []
        }

        return [
            Directory.currentDirectory.subDirectories.map(subDirectory => {
                return `<span class=${subDirectory.type}>${subDirectory.name}</span>`
            }).join("  ")
        ]
    }

    static triggerChangeDir(terminal, args) {
        if (args.length > 1) {
            return [
                "cd: too many arguments"
            ]
        }
        if (args.length === 0) {
            Directory.changeDir("/")
            return []
        }
        let directories = args[0].split("/").filter(element => element);
        let currentDirectory = Directory.currentDirectory
        for (let directory of directories) {
            if (!Directory.currentDirectory.getSubDirectory(directory)) {
                Directory.currentDirectory = currentDirectory
                return [
                    `cd: ${args[0]}: No such file or directory`
                ]

            }
            if (Directory.currentDirectory.getSubDirectory(directory).isFile()) {
                Directory.currentDirectory = currentDirectory
                return [
                    `cd: ${args[0]}: Not a directory`
                ]
            }
            Directory.changeDir(directory)
        }
        return []
    }

    static triggerMakeDir(terminal, args) {
        if (args.length === 0) {
            return [
                "mkdir: missing operand"
            ]
        }
        Directory.makeDir(args)
        return []
    }

    static triggerTouch(terminal, args) {
        if (args.length === 0) {
            return [
                "touch: missing file operand"
            ]
        }
        Directory.makeFile(args)
        return []
    }

    static triggerProjects() {
        return [
            "Most of my projects can be found on my <a target='_blank' href='https://github.com/diegogliarte'>" +
            "GitHub</a>. Some of the most interesting ones are:",
            "",
            "<a target='_blank' href='https://github.com/diegogliarte/portfolio'>Terminal Portfolio</a>",
            "The website you are browsing right now!",
            "Tech >> React, JS, CSS, HTML, Unix",
            "",
            "<a target='_blank' href='https://github.com/diegogliarte/p5js-projects'>Sudoku Recognizer</a>",
            "Interprets a video stream to detect a sudoku, build it, and solve it using backtracking",
            "Tech >> Python, OpenCV, Machine Learning, Computer Vision",
            "",
            "<a target='_blank' href='https://github.com/diegogliarte/p5js-projects'>Various Mini Games</a>",
            "Made in the span of two weeks because I was bored an wanted to see if I would be able to code them " +
            "without any reference. Snake, Tic Tac Toe, Minesweeper, Flappy Birds... You name it!",
            "Tech >> p5js, JS, CSS, HTML",
            "",
            "<a target='_blank' href='https://github.com/diegogliarte/terminal-sorting-visualizer'>Terminal Sorting Visualizer</a>",
            "Visualizer for the most common sorting algorithms such as Quicksort, Bubblesort, Selectionsort, among " +
            "some weird ones like Bongosort or Stalinsort (yeah, you heard right). Used ANSI escape codes to " +
            "optimize performance",
            "Tech >> Python, ANSI escape codes",
        ]
    }

    static triggerWork() {
        return [
            "Oct 2021 - Present",
            "Software Developer, Perspectiv",
            "",
            "Type 'cv' to download my full CV"
        ]
    }

    static triggerCV() {
        const fileUrl = "/files/CV.pdf";
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = "CV";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        return []
    }

    static triggerContact() {
        return [
            "<a href='mailto:diegogliarte@gmail.com'>diegogliarte@gmail.com</a>",
            "<a target='_blank' href='https://www.linkedin.com/in/diegogliarte/'>LinkedIn</a>",
            "<a target='_blank' href='https://github.com/diegogliarte/'>GitHub</a>",
        ]
    }

    static triggerCerts() {
        return [
            "<a target='_blank'  href='https://www.credly.com/badges/e78a28b3-9aa4-4018-9fd2-f3c9599ca27f'>AI-900</a>",
            "<a target='_blank'  href='https://www.credly.com/badges/3c082d94-c47c-4bdd-b641-d3a44e4ab2eb'>DP-900</a>",
            "<a target='_blank'  href='https://www.credly.com/badges/755adedc-9f05-4eec-bf36-77fc551d96c1'>SC-900</a>",
            "<a target='_blank'  href='https://www.credly.com/badges/189727aa-984e-4f13-8534-a95fbc47dd8a'>Google IT Automation Professional Certificate</a>",
            "<a target='_blank'  href='https://www.credly.com/badges/b0b63300-1d92-4222-a7a0-94d4ab509f52'>Google IT Support Professional Certificate</a>"
        ]
    }

    static triggerRemove(terminal, args) {
        if (args.length === 0) {
            return [
                "rm: missing operand"
            ]
        }

        let output = Directory.remove(args)
        return output
    }

    static triggerCat(terminal, args) {
        if (args.length === 0) {
            return [
                "cat: missing operand"
            ]
        }

        let output = Directory.getContent(args)
        return output
    }

    static triggerSecret(terminal, args) {
        if (args.length === 0) {
            return [
                "secret: missing password to access the deep secrets of this terminal"
            ]
        } else if (args.length > 1) {
            return [
                "secret: try only with one password"
            ]
        } else if (args[0] === "42") {
            return [
                "It seems like you've decoded the secrets of this terminal",
                "Go further beyond and push the boundaries of your limits",
                "",
                "But be careful, some things should better remain unknown... ",
                "<a target='_blank'  href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>The Meaning of Life</a>",
            ]
        } else {
            return [
                "secret: invalid password"
            ]
        }
    }

    static triggerTheme(terminal, args) {
        if (args.length === 0) {
            return [
                "theme: missing theme operand. Currently 'dark', 'light' and 'matrix' available"
            ]
        } else if (args.length > 1) {
            return [
                "theme: too many arguments"
            ]
        } else if (terminal.themes.includes(args[0])) {
            terminal.setState({theme: args[0]})
            document.body.classList.remove(terminal.state.theme)
            document.body.classList.add(args[0])
            return []
        } else {
            return [
                "theme: invalid theme. Currently 'dark', 'light' and 'matrix' available"
            ]
        }
    }

    static triggerWrongHelp() {
        return [
            "You almost got it!",
            {"message": "Type help for a list of supported commands", "prompt": Directory.getPrompt()}
        ]
    }


    static executeCommand(terminal, output) {
        Commands.historyIndex = Commands.history.length

        if (output === null) {
            return
        }

        terminal.setState({
            stdout: [
                ...terminal.state.stdout,
                {id: terminal.state.stdout.length, stdout: terminal.state.stdin, prompt: Directory.getPrompt()},
                ...output.map((line, i) => {
                    return ({
                        id: terminal.state.stdout.length + i + 1,
                        stdout: line.message || line ,
                        prompt: line.prompt || null
                    });
                }),
            ]
        });
        Directory.updatePrompt()
    }


}

export default Commands