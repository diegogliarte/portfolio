    import React, {Component} from "react";
    import "./Windows.css";
    import Taskbar from "./Taskbar";
    import Screen from "./Screen";

    class Windows extends Component {

        render() {
            return (
                <div id="windows">
                    <Screen />
                    <Taskbar />
                </div>
            );
        }
    }

    export default Windows;
