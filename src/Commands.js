import Directory from "./Directory";

class Commands {

    static commands = {
        "help": Commands.triggerHelpCommand,
        "clear": Commands.triggerClearCommand,
        "skills": Commands.triggerSkillsCommand,
        "whoami": Commands.triggerWhoAmICommand,
        "history": Commands.triggerHistory,
        "ls": Commands.triggerList,
        "cd": Commands.triggerChangeDir,
        "mkdir": Commands.triggerMakeDir
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
        let splitted = stdin.split(" ")
        let command = splitted[0]
        let args = splitted.slice(1)

        if (stdin !== "") {
            this.history.push(stdin)
        }

        let output = []
        if (Commands.isCommand(command)) {
            output = this.commands[command](stdin, setStdin, stdout, setStdout, args)
        } else if (command !== "") {
            output = Commands.handleCommandNotFound(stdin, stdout, setStdout, args)
        } else {
            output = Commands.handleEmptyCommand(stdin, stdout, setStdout, args)
        }

        Commands.historyIndex = Commands.history.length
        Commands.executeCommand(stdin, setStdin, stdout, setStdout, output)
        setStdin("");
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
            ...Commands.history.map((command,i) => {
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
            return [

            ]
        }
        if (!Directory.currentDirectory.getSubDirectory(args[0])) {
            return [
                `cd: ${args[0]}: No such file or directory`
            ]
        }
        Directory.changeDir(args[0])
        return [
        ]
    }

    static triggerMakeDir(stdin, setStdin, stdout, setStdout, args) {
        if (args.length === 0) {
            return [
                "mkdir: missing operand"
            ]
        }
        Directory.makeDir(args)
        return [

        ]
    }

    static executeCommand(stdin, setStdin, stdout, setStdout, output) {
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