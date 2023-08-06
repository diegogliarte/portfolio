import React, {Component} from "react";
import "./Taskbar.css";
import {getImgFromDirectory} from "./BlobView";
import AppContext from "../AppContext";

class Taskbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTime: this.getCurrentTime(),
            maxTaskbarScreenSize: 200,
            marginTaskbarScreen: 2

        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({currentTime: this.getCurrentTime()});
        }, 1000); // Update time every 1 second
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getCurrentTime() {
        const date = new Date();
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true});
    }

    getScreenToTop(screen) {
        AppContext.updateZIndexOnWindows(screen["id"])
    }

    renderTaskbarFolders() {
        const { maxTaskbarScreenSize, marginTaskbarScreen } = this.state;
        const taskbarElement = document.getElementById("taskbar-folders");
        const taskbarWidth = taskbarElement ? taskbarElement.offsetWidth : 0; // Get the actual taskbar width

        const maxFoldersToShowFullWidth = Math.floor((taskbarWidth) / (AppContext.activeScreens.length));
        const folderWidth = Math.min(maxTaskbarScreenSize, maxFoldersToShowFullWidth - marginTaskbarScreen)

        return AppContext.activeScreens.map((screen, index) => (
            <div className={"taskbar-folder"}
                 style={{ width: folderWidth + "px", marginRight: marginTaskbarScreen + "px" }}
                 key={index}
                 onClick={() => this.getScreenToTop(screen)}
            >
                <img src={"windows-xp/icons/" + getImgFromDirectory(screen["directory"])} alt="Taskbar folder icon" />
                <div>{screen["directory"].name}</div>
            </div>
        ));
    }

    render() {
        return (
            <div id="taskbar">
                <div className="start-menu">
                    <img src="/windows-xp/icons/windows-xp.png" alt="Start windows-xp"/>
                    <div className="start-menu-name">start</div>
                </div>
                <div id="taskbar-folders" className="taskbar-folders-container">{this.renderTaskbarFolders()}</div>
                <div className="current-time">{this.state.currentTime}</div>
            </div>
        );
    }
}

export default Taskbar;
