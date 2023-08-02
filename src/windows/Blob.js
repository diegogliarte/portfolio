import React from "react";
import Draggable from "./Draggable";
import "./Blob.css";

class Blob extends React.Component {
    render() {
        const { x, y, onMouseDown, blobSize } = this.props;
        const blobStyle = {
            left: `${x}px`,
            top: `${y}px`,
            width: `${blobSize}px`,
            height: `${blobSize}px`,
        };

        return <div className="blob" style={blobStyle} onMouseDown={onMouseDown}></div>;
    }
}

export default function BlobWithDraggable(props) {
    return <Draggable {...props} render={(dragProps) => <Blob {...dragProps} />} />;
}
