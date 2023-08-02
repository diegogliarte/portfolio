import React, {Component} from "react";
import "./Screen.css";
import BlobWithDraggable from "./Blob";

class Screen extends Component {

    constructor() {
        super()

        this.state = {
            blobSize: 50,
            spacing: 10,
        }

    }

    render() {
        return (
            <div id="screen">
                <BlobWithDraggable key="1" x={0} y={0} spacing={this.state.spacing} blobSize={this.state.blobSize} />
                <BlobWithDraggable key="2" x={1} y={1} spacing={this.state.spacing} blobSize={this.state.blobSize} />
            </div>
    )}
}

export default Screen;
