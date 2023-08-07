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
            y: this.props.y,
            textAreaContent: this.props.displayDirectory.content || "", // Initialize with the initial content

        };

        // Create a ref to hold the screen element
        this.screenRef = React.createRef();
        this.screenContentRef = React.createRef();
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

    componentDidUpdate(prevProps, prevState) {
        if (prevState.textAreaContent !== this.state.textAreaContent) {

            this.props.displayDirectory.content = this.state.textAreaContent;
        }
    }


    handleResize = () => {
        const screenWidth = this.screenRef.current.clientWidth;
        const screenHeight = this.screenContentRef.current.clientHeight;

        this.setState({screenWidth, screenHeight});
    };

    minimizeWindow = (event) => {
        event.stopPropagation()
    }

    maximizeWindow = (event) => {
        event.stopPropagation()

    }

    closeWindow = (event) => {
        event.stopPropagation()
        AppContext.removeWindow(this.props.id)
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

    handleTextareaInput = (event) => {
        const content = event.target.value;
        this.setState({ textAreaContent: content });
        this.props.displayDirectory.content = content
    };

    renderBlobs() {
        const {displayDirectory} = this.props;
        const {blobSize, spacing, screenWidth, screenHeight} = this.state;
        console.log(this.state.screenHeight)
        return displayDirectory.subDirectories.map((directory, index) => (
            <div key={index}>
                <BlobWithDraggable
                    x={Math.floor(index / 9)}
                    y={index % 9}
                    spacing={spacing}
                    blobSize={blobSize}
                    screenWidth={screenWidth}
                    screenHeight={screenHeight}
                    directory={directory}
                    isDraggable={this.props.isDesktop}
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
                    <div id={"desktop-screen"} className={"screen"} ref={this.screenRef}>
                        <div className="screen-content-container" ref={this.screenContentRef}>
                                {this.renderBlobs()}
                        </div>
                    </div>
                    :
                    <div className={"screen screen-folder"} ref={this.screenRef} style={screenStyle} onMouseDown={this.handleScreenMouseDown}>
                        <div className="folder-topbar" onMouseDown={this.handleTopbarMouseDown}>
                            <div className="folder-directory-info">
                                <img src={"windows-xp/icons/" + getImgFromDirectory(this.props.displayDirectory)}/>
                                {this.props.displayDirectory.name}
                            </div>
                            <div className="folder-modifiers-container">
                                <img src="windows-xp/icons/minimize.png" className="modifier minimize-folder" onMouseDown={this.minimizeWindow}></img>
                                <img src="windows-xp/icons/maximize.png" className="modifier maximize-folder" onMouseDown={this.maximizeWindow}></img>
                                <img src="windows-xp/icons/close.png" className="modifier close-folder" onMouseDown={(event) => event.stopPropagation()} onClick={this.closeWindow}></img>
                            </div>
                        </div>
                        <div className="screen-content-container">
                            <div className="screen-content" ref={this.screenContentRef}>
                                {this.props.displayDirectory.type === "folder" ?
                                    this.renderBlobs() :
                                    this.props.displayDirectory.type === "file" ?
                                        this.props.displayDirectory.name.endsWith("txt") ?
                                            <textarea
                                                name={"screen-textarea-" + this.props.id}
                                                id={"screen-textarea-" + this.props.id}
                                                onInput={this.handleTextareaInput}
                                                value={this.state.textAreaContent}
                                            >
                                            </textarea> :
                                            "not text"
                                         :
                                        "Error: Couldn't open file, unknown type."}
                            </div>
                        </div>
                    </div>

                }
            </div>


        );
    }
}

export default Screen;
