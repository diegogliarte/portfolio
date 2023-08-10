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
            textAreaContent: this.props.displayDirectory.content || "",
            isResizing: false,
            resizeStartX: 0,
            resizeStartY: 0,
            resizeStartWidth: 0,
            resizeStartHeight: 0,
        };

        this.screenRef = React.createRef();
        this.screenContentRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.handleResize();
    }

    componentWillUnmount() {
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

    handleScreenMouseDown = () => {
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
        this.setState({textAreaContent: content});
        this.props.displayDirectory.content = content
    };

    renderBlobs() {
        const {displayDirectory} = this.props;
        const {blobSize, spacing, screenWidth, screenHeight} = this.state;
        return displayDirectory.subDirectories.map((directory, index) => (
            <div key={index}>
                <BlobWithDraggable
                    indexX={Math.floor(index / 9)}
                    indexY={index % 9}
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

    handleResizeMouseDown = (event, direction) => {
        event.preventDefault();

        this.setState({
            isResizing: true,
            resizeStartX: event.clientX,
            resizeStartY: event.clientY,
            resizeStartWidth: this.state.screenWidth,
            resizeStartHeight: this.state.screenHeight,
            resizeDirection: direction,
        });

        document.addEventListener("mousemove", this.handleResizeMouseMove);
        document.addEventListener("mouseup", this.handleResizeMouseUp);
    };

    handleResizeMouseMove = (event) => {
        if (this.state.isResizing) {
            const {resizeStartX, resizeStartY, resizeStartWidth, resizeStartHeight, resizeDirection} = this.state;
            const deltaX = event.clientX - resizeStartX;
            const deltaY = event.clientY - resizeStartY;

            let newWidth = resizeStartWidth + (resizeDirection.includes("right") ? deltaX : (resizeDirection.includes("left") ? -deltaX : 0))
            let newHeight = resizeStartHeight + (resizeDirection.includes("bottom") ? deltaY : (resizeDirection.includes("top") ? -deltaY : 0))

            this.setState((prevState) => ({
                screenWidth: newWidth,
                screenHeight: newHeight,
                x: resizeDirection.includes("left") ? prevState.resizeStartX + deltaX : prevState.x,
                y: resizeDirection.includes("top") ? prevState.resizeStartY + deltaY : prevState.y,
            }));
        }
    };


    handleResizeMouseUp = () => {
        if (this.state.isResizing) {
            this.setState({
                isResizing: false,
                resizeStartX: 0,
                resizeStartY: 0,
                resizeStartWidth: 0,
                resizeStartHeight: 0,
                resizeDirection: "",
            });

            document.removeEventListener("mousemove", this.handleResizeMouseMove);
            document.removeEventListener("mouseup", this.handleResizeMouseUp);
        }
    };

    render() {
        const {isResizing, resizeDirection} = this.state;

        const screenStyle = {
            left: `${this.state.x}px`,
            top: `${this.state.y}px`,
            width: `${this.state.screenWidth}px`,
            height: `${this.state.screenHeight}px`,
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
                    <div className={"screen screen-folder"} ref={this.screenRef} style={screenStyle}
                         onMouseDown={this.handleScreenMouseDown}>
                        <div className="folder-topbar" onMouseDown={this.handleTopbarMouseDown}>
                            <div className="folder-directory-info">
                                <img src={"windows-xp/icons/" + getImgFromDirectory(this.props.displayDirectory)}
                                     alt={this.props.displayDirectory.name}/>
                                {this.props.displayDirectory.name}
                            </div>
                            <div className="folder-modifiers-container">
                                <img src="windows-xp/icons/minimize.png" className="modifier minimize-folder"
                                     alt="Minimize"
                                     onMouseDown={this.minimizeWindow}></img>
                                <img src="windows-xp/icons/maximize.png" className="modifier maximize-folder"
                                     alt="Maximize"
                                     onMouseDown={this.maximizeWindow}></img>
                                <img src="windows-xp/icons/close.png" className="modifier close-folder"
                                     alt="Close"
                                     onMouseDown={(event) => event.stopPropagation()} onClick={this.closeWindow}></img>
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
                                            this.props.displayDirectory.name.endsWith("pdf") ?
                                                <div className="pdf-viewer-container">
                                                    <embed className="pdf-viewer" src="files/CV.pdf"
                                                           type="application/pdf"/>
                                                </div> :
                                                "Not PDF"
                                        :
                                        "Error: Couldn't open file, unknown type."}
                            </div>
                        </div>
                        <div
                            className={`resize-handle top ${isResizing && resizeDirection === "top" ? "active" : ""}`}
                            onMouseDown={(event) => this.handleResizeMouseDown(event, "top")}
                        />
                        <div
                            className={`resize-handle bottom ${isResizing && resizeDirection === "bottom" ? "active" : ""}`}
                            onMouseDown={(event) => this.handleResizeMouseDown(event, "bottom")}
                        />
                        <div
                            className={`resize-handle left ${isResizing && resizeDirection === "left" ? "active" : ""}`}
                            onMouseDown={(event) => this.handleResizeMouseDown(event, "left")}
                        />
                        <div
                            className={`resize-handle right ${isResizing && resizeDirection === "right" ? "active" : ""}`}
                            onMouseDown={(event) => this.handleResizeMouseDown(event, "right")}
                        />
                        <div
                            className={`resize-handle top-left ${isResizing && resizeDirection === "top-left" ? "active" : ""}`}
                            onMouseDown={(event) => this.handleResizeMouseDown(event, "top-left")}
                        />
                        <div
                            className={`resize-handle top-right ${isResizing && resizeDirection === "top-right" ? "active" : ""}`}
                            onMouseDown={(event) => this.handleResizeMouseDown(event, "top-right")}
                        />
                        <div
                            className={`resize-handle bottom-left ${isResizing && resizeDirection === "bottom-left" ? "active" : ""}`}
                            onMouseDown={(event) => this.handleResizeMouseDown(event, "bottom-left")}
                        />
                        <div
                            className={`resize-handle bottom-right ${isResizing && resizeDirection === "bottom-right" ? "active" : ""}`}
                            onMouseDown={(event) => this.handleResizeMouseDown(event, "bottom-right")}
                        />
                    </div>
                }
            </div>
        );
    }
}

export default Screen;
