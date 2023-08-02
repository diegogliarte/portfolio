import React, { Component } from "react";
import "./Screen.css";
import BlobWithDraggable from "./BlobView";

class Screen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            blobSize: 50,
            spacing: 20,
        };

        // Create a ref to hold the screen element
        this.screenRef = React.createRef();
    }

    componentDidMount() {
        // Add an event listener to handle resize of the Screen component
        window.addEventListener("resize", this.handleResize);
        // Call handleResize initially to set correct blob position
        this.handleResize();
    }

    componentWillUnmount() {
        // Remove the event listener when the Screen component is unmounted
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize = () => {
        // Update the blob position when the Screen size changes
        const screenWidth = this.screenRef.current.clientWidth;
        const screenHeight = this.screenRef.current.clientHeight;

        // Update the state with new screen dimensions
        this.setState({ screenWidth, screenHeight });
    };

    renderBlobs() {
        const { displayDirectory } = this.props;
        const { blobSize, spacing } = this.state;

        // TODO Check why this.state.screenWidth and height are undefined
        const maxBlobsInRow = Math.floor(this.state.screenWidth / (blobSize + spacing)) - 1
        const maxBlobsInCol = Math.floor(this.state.screenHeight / (blobSize + spacing)) - 1

        return displayDirectory.subDirectories.map((directory, index) => (
            <div key={index}>
                <BlobWithDraggable
                    x={Math.floor(index / 9)}
                    y={index % 9}
                    spacing={spacing}
                    blobSize={blobSize}
                    screenWidth={this.state.screenWidth}
                    screenHeight={this.state.screenHeight}
                    directory={directory}
                />
            </div>
        ));
    }

    render() {
        return (
            <div
                id="desktopScreen"
                className="screen"
                ref={this.screenRef} // Assign the ref to the screen element
            >
                {this.renderBlobs()}
            </div>
        );
    }
}

export default Screen;
