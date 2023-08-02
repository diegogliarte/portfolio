import React from "react";
import Draggable from "./Draggable";
import "./BlobView.css";
import AppContext from "../AppContext";

class BlobView extends React.Component {
    // handleMouseDown = () => {
    //     const {directory} = this.props;
    //     if (directory.type === "terminal") {
    //         AppContext.setMode("terminal")
    //     }
    // };

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
                onMouseDown={onMouseDown}
            >
                <img src={"windows-xp/icons/" +
                    (directory.type === "terminal" ? "cmd.png" : "explorer.png")}
                     alt="Folder image"/>
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
            render={(dragProps) => <BlobView {...dragProps} directory={directory} />}
        />
    );
}
