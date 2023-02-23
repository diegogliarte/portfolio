import { useEffect, useState } from "react";
import Line from "./Line";
import "./Terminal.css";
import Commands from "./Commands";
import Directory from "./Directory";

function Terminal() {
    const [stdin, setStdin] = useState("")
    const [stdout, setStdout] = useState([]);



    function handleKeyPress(event) {
        let key = event.key;
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
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [stdin, stdout]);

    return (
        <div className="terminal">
            {stdout.map((line) => (
                <Line key={line.id} stdout={line.stdout} prompt={line.prompt} />
            ))}
            <Line stdout={stdin} current={true} prompt={Directory.getPrompt()}/>
        </div>
    );
}

export default Terminal;
