    import React, {Component} from "react";
    import "./Windows.css";
    import Taskbar from "./Taskbar";
    import Screen from "./Screen";
    import DirectoryManager from "../DirectoryManager";

    class Windows extends Component {

        render() {
            return (
                <div id="windows">
                    <Screen displayDirectory={DirectoryManager.currentDirectory.parent.getSubDirectory("windows-xp")}/>
                    <Taskbar />
                </div>
            );
        }
    }

    export default Windows;
