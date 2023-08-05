import React, { Component } from "react";
import "./Taskbar.css";

class Taskbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: this.getCurrentTime()
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({ currentTime: this.getCurrentTime() });
        }, 1000); // Update time every 1 second
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getCurrentTime() {
        const date = new Date();
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    render() {
        return (
            <div id="taskbar">
                <div className="start-menu">
                    <img src="/windows-xp/icons/windows-xp.png" alt="Start windows-xp"/>
                    <div className="start-menu-name">start</div>
                </div>
                <div className="taskbar-folders">Folders</div>
                <div className="current-time">{this.state.currentTime}</div>
            </div>
        );
    }
}

export default Taskbar;
