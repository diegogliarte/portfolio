import { useEffect, useState } from "react";
import Line from "./Line";
import "./Terminal.css";
import Commands from "./Commands";
import Directory from "./Directory";

function Terminal() {
    const [rawStdin, setRawStdin] = useState([])
    const [stdin, setStdin] = useState("")
    const [stdout, setStdout] = useState([]);

    function handleKeyPress(event) {
        let key = event.key;
        let keyCode = [event.keyCode]
        setRawStdin([
            ...rawStdin,
            keyCode
        ])
        const currentRawStdin = [...rawStdin, keyCode]


        if (/^[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~ ]$/.test(key)) {
            setStdin(prevStdin => prevStdin + key)

        } else if (key === "Backspace") {
            setStdin(prevStdin => prevStdin.slice(0, -1))

        } else if (key === "Enter") {
            Commands.handleCommands(stdin, setStdin, stdout, setStdout)

        } else if (key === "ArrowUp") {
            setStdin(Commands.getHistory(-1))
        } else if (key === "ArrowDown") {
            setStdin(Commands.getHistory(1))
        } else if (key === "Tab") {
            Commands.handleAutocomplete(stdin, setStdin, stdout, setStdout)
            document.getElementById("terminal").focus()
            event.preventDefault()
            event.stopPropagation()
        }
    }


    function clearStdin() {
        setStdin("")
        setRawStdin("")
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);

        };
    }, [rawStdin, stdin, stdout]);

    return (
        <div className="terminal" id="terminal">
            {stdout.map((line) => (
                <Line key={line.id} stdout={line.stdout} prompt={line.prompt} />
            ))}
            <Line stdout={stdin} current={true} prompt={Directory.getPrompt()}/>
        </div>
    );
}

export default Terminal;
