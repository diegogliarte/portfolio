import React, {Component} from "react";
import "./Screen.css";
import BlobWithDraggable, {getImgFromDirectory} from "./BlobView";
import AppContext from "../AppContext";

class Screen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blobSize: 50,
            spacing: 30,
            x: this.props.x,
            y: this.props.y
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
        this.setState({screenWidth, screenHeight});
    };

    minimizeWindow = (event) => {

    }

    maximizeWindow = (event) => {

    }

    closeWindow = (event) => {
        AppContext.removeWindow(this.props.id)
        event.stopPropagation()
    }

    handleScreenMouseDown = (event) => {
        AppContext.updateZIndexOnWindows(this.props.id)
        this.forceUpdate()
    }

    handleTopbarMouseDown = (event) => {
        event.preventDefault()

        this.setState({
            xDifference: event.clientX - this.state.x,
            yDifference: event.clientY - this.state.y,
        });

        document.addEventListener("mousemove", this.handleTopbarMouseMove);
        document.addEventListener("mouseup", this.handleTopbarMouseUp);
    };

    handleTopbarMouseMove = (event) => {
        const currentX = event.clientX - this.state.xDifference;
        const currentY = event.clientY - this.state.yDifference;

        this.setState({x: currentX, y: currentY});
    };

    handleTopbarMouseUp = () => {
        document.removeEventListener("mousemove", this.handleTopbarMouseMove);
        document.removeEventListener("mouseup", this.handleTopbarMouseUp);
    };

    renderBlobs() {
        const {displayDirectory} = this.props;
        const {blobSize, spacing} = this.state;

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
        const screenStyle = {
            left: `${this.state.x}px`,
            top: `${this.state.y}px`,
            zIndex: `${this.props.zIndex}`,
        };

        return (
            <div>
                {this.props.isDesktop ?
                    <div id={"desktopScreen"} className={"screen"} ref={this.screenRef}>
                        {this.renderBlobs()}
                    </div>
                    :
                    <div className={"screen screenFolder"} ref={this.screenRef} style={screenStyle} onMouseDown={this.handleScreenMouseDown}>
                        <div className="folder-topbar" onMouseDown={this.handleTopbarMouseDown}>
                            <div className="folder-directory-info">
                                <img src={"windows-xp/icons/" + getImgFromDirectory(this.props.displayDirectory)}/>
                                {this.props.displayDirectory.name}
                            </div>
                            <div className="folder-modifiers-container">
                                <div className="modifier minimize-folder" onMouseDown={this.minimizeWindow}>-</div>
                                <div className="modifier maximize-folder" onMouseDown={this.maximizeWindow}>+</div>
                                <div className="modifier close-folder" onMouseDown={this.closeWindow}>X</div>
                            </div>
                        </div>
                        {this.renderBlobs()}
                    </div>

                }
            </div>


        );
    }
}

export default Screen;
