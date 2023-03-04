import React, { Component } from "react";
import Line from "./Line";
import "./Terminal.css";
import Commands from "./Commands";
import Directory from "./Directory";

class Terminal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            stdin: "",
            stdout: [
                {
                    id: 0,
                    stdout: "Type 'help' for a list of supported commands",
                    prompt: Directory.getPrompt(),
                },
            ],
            theme: "dark",
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.themes = ["dark", "light", "matrix", "rainbow"]
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);
    }

    componentDidUpdate() {
        window.scrollTo(0, document.body.offsetHeight);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
    }

    handleKeyPress(event) {
        let key = event.key;

        if (/^[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~ ]$/.test(key)) {
            this.setState((prevState) => ({ stdin: prevState.stdin + key }));
        } else if (key === "Backspace") {
            this.setState((prevState) => ({
                stdin: prevState.stdin.slice(0, -1),
            }));
        } else if (key === "Enter") {
            Commands.handleCommands(this);
        } else if (key === "ArrowUp") {
            this.setState({ stdin: Commands.getHistory(-1) });
        } else if (key === "ArrowDown") {
            this.setState({ stdin: Commands.getHistory(1) });
        } else if (key === "Tab") {
            Commands.handleAutocomplete(this);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    render() {
        return (
            <div className="terminal" id="terminal">
                {this.state.stdout.map((line) => (
                    <Line
                        key={line.id}
                        stdout={line.stdout}
                        prompt={line.prompt}
                        theme={this.state.theme}
                    />
                ))}
                <Line
                    stdout={this.state.stdin}
                    current={true}
                    prompt={Directory.getPrompt()}
                    theme={this.state.theme}
                />
            </div>
        );
    }
}

export default Terminal;
