import Directory from "./Directory";
import {logDOM} from "@testing-library/react";
import blob from "./Blob";

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
        }
    }

    static handleAutocomplete(stdin, setStdin, stdout, setStdout) {
        let {command, args} = this.parseStdin(stdin);
        let output

        if (!Commands.isCommand(command)) {
            output = this.getAutocomplete(command, Object.keys(Commands.commands));
            if (typeof (output) === "string") {
                setStdin(output)
                output = null
            } else if (typeof (output) === "object") {
                output = [output.join("  ")]
            }

        } else {
            output = Commands.commands[command]["autocomplete"](args)
            if (typeof (output) === "string") {
                setStdin(`${command} ${output}`)
                output = null
            }
        }

        Commands.executeCommand(stdin, setStdin, stdout, setStdout, output)
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

    static autocompleteBlob(args, setStdin, includeFile = true, includeFolder = true) {
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
            let autocomplete = Commands.getAutocomplete(directory, subDirectories, setStdin)
            if (typeof (autocomplete) === "string") {
                path += autocomplete + (currentDirectory.getSubDirectory(autocomplete).isFolder() ? "/" : "")
                currentDirectory = currentDirectory.getSubDirectory(autocomplete)
            } else if (autocomplete !== null) {
                return [
                    autocomplete.map(asdasd => {
                    let blob = currentDirectory.getSubDirectory(asdasd)
                    return `<span class=${blob.type}>${blob.name}</span>`
                }).join("  ")
                ]
            } else {
                return null
            }
        }

        return path

    }

    static autocompleteFolders(args, setStdin) {
        return Commands.autocompleteBlob(args, setStdin, false, true)
    }

    static autocompleteFiles(args, setStdin) {
        return Commands.autocompleteBlob(args, setStdin, true, false)
    }

    static combos = {
        "17,67": Commands.triggerCancel
    }

    static isCombo(rawStdin) {

    }

    static handleCombos(rawStdin, stdin, setStdin, stdout, setStdout) {

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

    static handleCommands(stdin, setStdin, stdout, setStdout) {
        let {command, args} = this.parseStdin(stdin);

        if (stdin !== "") {
            this.history.push(stdin)
        }

        let output = []
        if (Commands.isCommand(command)) {
            output = this.commands[command]["trigger"](stdin, setStdin, stdout, setStdout, args)
        } else if (command !== "") {
            output = Commands.handleCommandNotFound(stdin, stdout, setStdout, args)
        } else {
            output = Commands.handleEmptyCommand(stdin, stdout, setStdout, args)
        }

        setStdin("")
        Commands.executeCommand(stdin, setStdin, stdout, setStdout, output)
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

    static handleCombos(stdin, setStdin, stdout, setStdout) {
        let output = this.triggerCancel(stdin, setStdin, stdout, setStdout)
        Commands.executeCommand(stdin, setStdin, stdout, setStdout, output)
    }

    static handleCommandNotFound(stdin, stdout, setStdout, args) {
        return [
            `${stdin}: command not found`
        ]
    }

    static handleEmptyCommand(stdin, stdout, setStdout, args) {
        return []
    }

    static getCommands() {
        return this.commands
    }

    static isCommand(command) {
        return command in this.commands
    }

    static triggerHelpCommand(stdin, setStdin, stdout, setStdout, args) {
        const COMMANDS_MESSAGE = Object.keys(Commands.commands).join(" ")
        return ["GNU bash, version 0.42",
            "These shell commands are defined internally. Type 'help' to see this list.",
            COMMANDS_MESSAGE
        ]
    }

    static triggerClearCommand(stdin, setStdin, stdout, setStdout, args) {
        setStdout([])
        return null
    }

    static triggerSkillsCommand(stdin, setStdin, stdout, setStdout, args) {
        return ["Languages: Python, JavaScript, bash, Java, SQL, C/C++",
            "Python Tech: OpenCV, numpy, Flask, FastAPI",
            "Website Tech: HTML, CSS, VanillaJS, React",
            "General Tech: Unix, Git, GitHub, Docker, AWS"
        ]
    }

    static triggerWhoAmICommand(stdin, setStdin, stdout, setStdout, args) {
        return ["diegogliarte",
            "",
            "I am Diego González, a Sotware Developer located in Spain. Currently a CS and Business student with +1 " +
            "year of professional experience as a part-time software developer. My work experience is quite extensive " +
            "due to working on a small team and being involved in every step towards the final product. Always " +
            "learning new technologies and facing new challenges!"
        ]
    }

    static triggerHistory(stdin, setStdin, stdout, setStdout, args) {
        return [
            ...Commands.history.map((command, i) => {
                return `${i + 1} ${command}`
            })
        ]
    }

    static triggerList(stdin, setStdin, stdout, setStdout, args) {
        if (Directory.currentDirectory.subDirectories.length === 0) {
            return []
        }

        return [
            Directory.currentDirectory.subDirectories.map(subDirectory => {
                return `<span class=${subDirectory.type}>${subDirectory.name}</span>`
            }).join("  ")
        ]
    }

    static triggerChangeDir(stdin, setStdin, stdout, setStdout, args) {
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

    static triggerMakeDir(stdin, setStdin, stdout, setStdout, args) {
        if (args.length === 0) {
            return [
                "mkdir: missing operand"
            ]
        }
        Directory.makeDir(args)
        return []
    }

    static triggerTouch(stdin, setStdin, stdout, setStdout, args) {
        if (args.length === 0) {
            return [
                "touch: missing file operand"
            ]
        }
        Directory.makeFile(args)
        return []
    }

    static triggerProjects(stdin, setStdin, stdout, setStdout, args) {
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

    static triggerWork(stdin, setStdin, stdout, setStdout, args) {
        return [
            "Oct 2021 - Present",
            "Software Developer, Perspectiv",
            "",
            "Type 'cv' to download my full CV"
        ]
    }

    static triggerCV(stdin, setStdin, stdout, setStdout, args) {
        const fileUrl = "/files/CV.pdf";
        const downloadLink = document.createElement("a");
        downloadLink.href = fileUrl;
        downloadLink.download = "CV";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        return []
    }

    static triggerContact(stdin, setStdin, stdout, setStdout, args) {
        return [
            "<a href='mailto:diegogliarte@gmail.com'>diegogliarte@gmail.com</a>",
            "<a target='_blank' href='https://www.linkedin.com/in/diegogliarte/'>LinkedIn</a>",
            "<a target='_blank' href='https://github.com/diegogliarte/'>GitHub</a>",
        ]
    }

    static triggerCancel(stdin, setStdin, stdout, setStdout, args) {
        return []
    }

    static triggerCerts(stdin, setStdin, stdout, setStdout, args) {
        return [
            "<a target='_blank'  href='https://www.credly.com/badges/e78a28b3-9aa4-4018-9fd2-f3c9599ca27f'>AI-900</a>",
            "<a target='_blank'  href='https://www.credly.com/badges/3c082d94-c47c-4bdd-b641-d3a44e4ab2eb'>DP-900</a>",
            "<a target='_blank'  href='https://www.credly.com/badges/755adedc-9f05-4eec-bf36-77fc551d96c1'>SC-900</a>",
            "<a target='_blank'  href='https://www.credly.com/badges/189727aa-984e-4f13-8534-a95fbc47dd8a'>Google IT Automation Professional Certificate</a>",
            "<a target='_blank'  href='https://www.credly.com/badges/b0b63300-1d92-4222-a7a0-94d4ab509f52'>Google IT Support Professional Certificate</a>"
        ]
    }

    static triggerRemove(stdin, setStdin, stdout, setStdout, args) {
        if (args.length === 0) {
            return [
                "rm: missing operand"
            ]
        }

        let output = Directory.remove(args)
        return output
    }

    static triggerCat(stdin, setStdin, stdout, setStdout, args) {
        if (args.length === 0) {
            return [
                "cat: missing operand"
            ]
        }

        let output = Directory.getContent(args)
        return output
    }


    static executeCommand(stdin, setStdin, stdout, setStdout, output) {
        Commands.historyIndex = Commands.history.length

        if (output === null) {
            return
        }

        setStdout([
            ...stdout,
            {id: stdout.length, stdout: stdin, prompt: Directory.getPrompt()},
            ...output.map((line, i) => {
                return ({
                    id: stdout.length + i + 1,
                    stdout: line,
                    prompt: null
                });
            }),
        ]);
        Directory.updatePrompt()
    }


}

export default Commands