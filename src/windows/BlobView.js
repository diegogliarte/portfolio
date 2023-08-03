import React from "react";
import Draggable from "./Draggable";
import "./BlobView.css";
import AppContext from "../AppContext";

class BlobView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            drag: false
        }
    }

    handleMouseUp = () => {
        if (this.state.drag) return;

        const {directory} = this.props;
        if (directory.type === "terminal") {
            AppContext.setMode("terminal")
        } else if (directory.type === "folder") {
            AppContext.addWindow(directory)
        }
    };

    render() {
        const {x, y, onMouseDown, blobSize, directory} = this.props;
        const blobStyle = {
            left: `${x}px`,
            top: `${y}px`,
            width: `${blobSize}px`,
            height: `${blobSize}px`,
        };

        return (
            <div
                className="blobView"
                style={blobStyle}
                onMouseDown={(event) => {
                    this.setState({ drag: false });
                    onMouseDown(event);
                }}
                onMouseMove={() => this.setState({ drag: true })}
                onMouseUp={this.handleMouseUp}
            >
                <img src={"windows-xp/icons/" +
                    (directory.type === "terminal" ? "cmd.png" : "explorer.png")}
                     alt="Folder"/>
                <div className="blobViewName">{directory.name}</div>
            </div>
        );
    }
}

export default function BlobWithDraggable(props) {
    const { directory, blobSize, spacing, screenWidth, screenHeight } = props;
    return (
        <Draggable
            {...props}
            blobSize={blobSize}
            spacing={spacing}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
            directory={directory}
            render={(dragProps) => <BlobView {...dragProps} directory={directory} />}
        />
    );
}
