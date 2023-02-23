
class Commands {

    static commands = {
        "help": Commands.triggerHelpCommand,
        "clear": Commands.triggerClearCommand,
    }


    static handleCommands(stdin, setStdin, stdout, setStdout) {
        let command = stdin.trim()
        if (Commands.isCommand(command)) {
            this.commands[command](setStdout)
        } else {
            Commands.handleCommandNotFound(stdin, stdout, setStdout)
        }
        setStdin("");
    }

    static handleCommandNotFound(stdin, stdout, setStdout) {
        const COMMAND_NOT_FOUND_MESSAGE = `${stdin}: command not found`

        setStdout([
            ...stdout,
            {id: stdout.length, stdout: stdin, hasPrompt: true},
            {id: stdout.length + 1, stdout: COMMAND_NOT_FOUND_MESSAGE, hasPrompt: false},
        ]);
    }

    static getCommands() {
        return this.commands
    }

    static isCommand(command) {
        return command in this.commands
    }

    static triggerHelpCommand(setStdout) {
        console.log("help")
    }

    static triggerClearCommand(setStdout) {
        setStdout([])

    }




}

export default Commands