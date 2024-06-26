import DirectoryManager from "./DirectoryManager";
import {autocompleteFolders, autocompleteFoldersAndFiles, autocompleteTheme} from "./autocomplete";

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
            "autocomplete": autocompleteFolders
        },
        "mkdir": {
            "trigger": Commands.triggerMakeDir
        },
        "touch": {
            "trigger": Commands.triggerTouch,
            "autocomplete": autocompleteFolders
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
            "autocomplete": autocompleteFoldersAndFiles
        },
        "cat": {
            "trigger": Commands.triggerCat,
            "autocomplete": autocompleteFoldersAndFiles
        },
        "secret": {
            "trigger": Commands.triggerSecret,
        },
        "theme": {
            "trigger": Commands.triggerTheme,
            "autocomplete": autocompleteTheme
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
            "hidden": true,
            "disabled": true
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

        let output;
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
        let split = stdin.trim().split(" ")
        let command = split[0].trim()
        let args = split.slice(1)
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
        return command in this.commands && !this.commands[command]["disabled"]
    }

    static triggerHelpCommand() {
        const COMMANDS_MESSAGE = Commands.getVisibleCommands()
        return ["GNU bash, version 0.42",
            "<a href='' onclick=\"event.preventDefault();\">Underlined text is clickable</a>",
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
        return ["Languages: Python, JavaScript, bash, Java, Kotlin, SQL, C/C++",
            "Python Tech: OpenCV, numpy, Flask, FastAPI, Django",
            "Website Tech: HTML, CSS, MongoDB, Express, React, Node",
            "General Tech: AWS, Unix, Docker, Git, GitHub, GitLab"
        ]
    }

    static triggerWhoAmICommand() {
        return [
            "Full-time student enrolled in a Double Degree in CS and Business, alongside being a part-time Software Developer.",
            "Some of my tech stack includes Python, JavaScript, Java, C++, HTML, CSS,  SQL, OpenCV, Unix, Git, and some others.",
            "Over the years I have done multiple personal projects relating to automation, web apps, web scrapping, computer vision, machine learning, implementation of various algorithms (sorts, backtracking...), usage of 3rd-party APIs (YouTube's, Twitter's...), CLI visualizations, GameDev...",
            "I try not to get stuck knowledge-wise, so I am always trying to find new techs to learn about and studying for certifications on the side to increase my technological scope."
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
        if (DirectoryManager.currentDirectory.subDirectories.length === 0) {
            return []
        }

        return [
            DirectoryManager.currentDirectory.subDirectories.map(subDirectory => {
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
            DirectoryManager.changeDir("/")
            return []
        }
        let directories = args[0].split("/").filter(element => element);
        let currentDirectory = DirectoryManager.currentDirectory
        for (let directory of directories) {
            if (!DirectoryManager.currentDirectory.getSubDirectory(directory)) {
                DirectoryManager.currentDirectory = currentDirectory
                return [
                    `cd: ${args[0]}: No such file or directory`
                ]

            }
            if (DirectoryManager.currentDirectory.getSubDirectory(directory).isFile()) {
                DirectoryManager.currentDirectory = currentDirectory
                return [
                    `cd: ${args[0]}: Not a directory`
                ]
            }
            DirectoryManager.changeDir(directory)
        }
        return []
    }

    static triggerMakeDir(terminal, args) {
        if (args.length === 0) {
            return [
                "mkdir: missing operand"
            ]
        }
        DirectoryManager.makeDir(args)
        return []
    }

    static triggerTouch(terminal, args) {
        if (args.length === 0) {
            return [
                "touch: missing file operand"
            ]
        }
        DirectoryManager.makeFile(args)
        return []
    }

    static triggerProjects() {
        return [
            "Most of my projects can be found on my <a target='_blank' href='https://github.com/diegogliarte'>" +
            "GitHub</a>. Some of the most interesting ones are:",
            "",
            "<a target='_blank' href='https://github.com/diegogliarte/portfolio'>Terminal Portfolio</a>",
            "The website you are browsing right now!",
            ">> React, JS, CSS, HTML, Unix <<",
            "",
            "<a target='_blank' href='https://github.com/diegogliarte/sudoku-recognizer'>Sudoku Recognizer</a>",
            "Interprets a video stream to detect a sudoku, build it, and solve it using backtracking",
            ">> Python, OpenCV, Machine Learning, Computer Vision <<",
            "",
            "<a target='_blank' href='https://github.com/diegogliarte/p5js-projects'>Various Mini Games</a>",
            "Made in the span of two weeks because I was bored an wanted to see if I would be able to code them " +
            "without any reference. Snake, Tic Tac Toe, Minesweeper, Flappy Birds... You name it!",
            ">> p5js, JS, CSS, HTML <<",
            "",
            "<a target='_blank' href='https://github.com/diegogliarte/terminal-sorting-visualizer'>Terminal Sorting Visualizer</a>",
            "Visualizer for the most common sorting algorithms such as Quicksort, Bubblesort, Selectionsort, among " +
            "some weird ones like Bongosort or Stalinsort (yeah, you heard right). Used ANSI escape codes to " +
            "optimize performance",
            ">> Python, ANSI escape codes <<",
        ]
    }

    static triggerWork() {
        return [
            "Sep 2023 - Present",
            "Software Developer, SEMIC",
            "",
            "Oct 2021 - March 2023",
            "Software Developer, Perspectiv",
            "",
            "Type 'cv' to download my full CV"
        ]
    }

    static triggerCV() {
        const googleDriveId = "1hfEkj-rFPxrGfJFBFPKlDBUXmHaFfOUIEkxwmiwVTkQ"
        const fileUrl = `https://docs.google.com/document/d/${googleDriveId}/export?format=pdf`

        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = "CV";
        downloadLink.click();
        return ["Downloading CV..."]
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
            "<a target='_blank'  href='https://learn.microsoft.com/en-us/users/diegogliarte/credentials/1a9e6bbcc1fd353d'>AI-102</a>",
            "<a target='_blank'  href='https://learn.microsoft.com/en-us/users/diegogliarte/credentials/f435a6bd0a47a093'>AI-900</a>",
            "<a target='_blank'  href='https://learn.microsoft.com/en-us/users/diegogliarte/credentials/25d7b65d5e62f715'>DP-900</a>",
            "<a target='_blank'  href='https://learn.microsoft.com/en-us/users/diegogliarte/credentials/22ed36927ffdec1e'>SC-900</a>",
            "<a target='_blank'  href='https://www.credly.com/badges/e4f7fdbb-8257-47f6-971c-54bcc8ae9a5c'>Google Data Analytics Certificate</a>",
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

        let output = DirectoryManager.remove(args)
        return output
    }

    static triggerCat(terminal, args) {
        if (args.length === 0) {
            return [
                "cat: missing operand"
            ]
        }

        let output = DirectoryManager.getContent(args)
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
            Commands.setTerminalTheme(terminal, args[0]);
            return []
        } else {
            return [
                "theme: invalid theme. Currently 'dark', 'light' and 'matrix' available"
            ]
        }
    }

    static setTerminalTheme(terminal, theme) {
        terminal.setState({theme: theme})
        document.body.classList.remove(terminal.state.theme)
        document.body.classList.add(theme)
    }

    static triggerWrongHelp() {
        return [
            "You almost got it!",
            {"message": "Type help for a list of supported commands", "prompt": DirectoryManager.qgetPrompt()}
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
                {id: terminal.state.stdout.length, stdout: terminal.state.stdin, prompt: DirectoryManager.getPrompt()},
                ...output.map((line, i) => {
                    return ({
                        id: terminal.state.stdout.length + i + 1,
                        stdout: line.message || line ,
                        prompt: line.prompt || null
                    });
                }),
            ]
        });
        DirectoryManager.updatePrompt()
    }


}

export default Commands
