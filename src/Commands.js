class Commands {

    static commands = {
        "help": Commands.triggerHelpCommand,
        "clear": Commands.triggerClearCommand,
        "skills": Commands.triggerSkillsCommand,
        "whoami": Commands.triggerWhoAmICommand,
        "history": Commands.triggerHistory,
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
        let command = stdin.trim()
        if (command !== "") {
            this.history.push(command)
        }

        let output = []
        if (Commands.isCommand(command)) {
            output = this.commands[command](stdin, setStdin, stdout, setStdout)
        } else if (command !== "") {
            output = Commands.handleCommandNotFound(stdin, stdout, setStdout)
        } else {
            output = Commands.handleEmptyCommand(stdin, stdout, setStdout)
        }

        Commands.historyIndex = Commands.history.length
        Commands.executeCommand(stdin, setStdin, stdout, setStdout, output)
        setStdin("");
    }

    static handleCommandNotFound(stdin, stdout, setStdout) {
        return [
            `${stdin}: command not found`
        ]
    }

    static handleEmptyCommand(stdin, stdout, setStdout) {
        return []
    }

    static getCommands() {
        return this.commands
    }

    static isCommand(command) {
        return command in this.commands
    }

    static triggerHelpCommand(stdin, setStdin, stdout, setStdout) {
        const COMMANDS_MESSAGE = Object.keys(Commands.commands).join(" ")
        return ["GNU bash, version 0.42",
            "These shell commands are defined internally. Type 'help' to see this list.",
            COMMANDS_MESSAGE
        ]
    }

    static triggerClearCommand(stdin, setStdin, stdout, setStdout) {
        setStdout([])
        return null
    }

    static triggerSkillsCommand(stdin, setStdin, stdout, setStdout) {
        return ["Languages: Python, JavaScript, bash, Java, SQL, C/C++",
            "Python Tech: OpenCV, numpy, Flask, FastAPI",
            "Website Tech: HTML, CSS, VanillaJS, React",
            "General Tech: Unix, Git, GitHub, Docker, AWS"
        ]
    }

    static triggerWhoAmICommand(stdin, setStdin, stdout, setStdout) {
        return ["diegogliarte",
            "",
            "I am Diego González, a Sotware Developer located in Spain. Currently a CS and Business student with +1 " +
            "year of professional experience as a part-time software developer. My work experience is quite extensive " +
            "due to working on a small team and being involved in every step towards the final product. Always " +
            "learning new technologies and facing new challenges!"
        ]
    }

    static triggerHistory(stdin, setStdin, stdout, setStdout) {
        return [
            ...Commands.history.map((command,i) => {
                return `${i + 1} ${command}`
            })
        ]
    }

    static executeCommand(stdin, setStdin, stdout, setStdout, output) {
        if (output === null) {
            return
        }
        setStdout([
            ...stdout,
            {id: stdout.length, stdout: stdin, hasPrompt: true},
            ...output.map((line, i) => {
                return ({
                    id: stdout.length + i + 1,
                    stdout: line,
                    hasPrompt: false
                });
            }),
        ]);
    }


}

export default Commands