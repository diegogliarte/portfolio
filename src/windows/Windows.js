import React, {Component, useState} from "react";
import "./Windows.css";
import Taskbar from "./Taskbar";
import Screen from "./Screen";
import DirectoryManager from "../DirectoryManager";
import AppContext from "../AppContext";

function Windows() {
    const [activeScreens, updateActiveScreens] = useState([]);
    AppContext.saveWindows(activeScreens, updateActiveScreens)


    function renderOpenedScreens() {
        return activeScreens.map((window, index) => (
            <Screen
                id={window["id"]}
                key={window["id"]}
                displayDirectory={window["directory"]}
                isDesktop={false}
                x={window["x"]}
                y={window["y"]}
                zIndex={window["zIndex"]}
            />
        ));
    }

    return (
        <div id="windows">
            <Screen displayDirectory={DirectoryManager.currentDirectory.parent.getSubDirectory("windows-xp")}
                    isDesktop={true}/>
            {renderOpenedScreens()}
            <Taskbar/>
        </div>
    );
}

export default Windows;
