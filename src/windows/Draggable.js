import React, { Component } from "react";
import {getImgFromDirectory} from "./BlobView";

class Draggable extends Component {


    constructor(props) {
        super(props);
        const {blobSize, spacing} = this.props
        this.state = {
            isDragging: false,
            indexX: this.props.indexX,
            indexY: this.props.indexY,
            initialX: blobSize / 2,
            initialY: blobSize / 2,
            currentX: (blobSize + this.props.indexX * (blobSize + spacing)),
            currentY: (blobSize + this.props.indexY * (blobSize + spacing)),
        };
    }


    getSnappedCoordinates(currentX, currentY) {
        const {blobSize, spacing, screenWidth, screenHeight} = this.props;

        const spaceBetween = blobSize + spacing

        const minCoordsLeft = blobSize
        const minCoordsUp = blobSize

        const maxBlobsInRow = Math.floor(screenWidth / spaceBetween) - 1
        const maxBlobsInCol = Math.floor(screenHeight / spaceBetween) - 1

        const indexX = Math.floor((currentX - blobSize / 2) / spaceBetween)
        const snappedX = Math.min(blobSize + maxBlobsInRow * spaceBetween, Math.max(minCoordsLeft, blobSize + indexX * spaceBetween))

        const indexY = Math.floor((currentY - blobSize / 2) / spaceBetween)
        const snappedY = Math.min(blobSize + maxBlobsInCol * spaceBetween, Math.max(minCoordsUp, blobSize + indexY * spaceBetween))
        return {snappedX, snappedY};
    }

    handleMouseDown = (event) => {
        if (!this.props.isDraggable) return;
        event.preventDefault()
        const {currentX, currentY} = this.state;
        this.setState({
            isDragging: true,
            initialX: event.clientX - currentX,
            initialY: event.clientY - currentY,
        });

        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    };

    handleMouseMove = (event) => {
        const {isDragging, initialX, initialY} = this.state;

        if (isDragging) {
            const currentX = event.clientX - initialX;
            const currentY = event.clientY - initialY;
            const {snappedX, snappedY} = this.getSnappedCoordinates(currentX, currentY);
            this.setState({currentX: currentX, currentY: currentY, snappedX: snappedX, snappedY: snappedY});
        }
    };

    handleMouseUp = () => {
        const {currentX, currentY} = this.state;
        const {snappedX, snappedY} = this.getSnappedCoordinates(currentX, currentY);

        this.setState({isDragging: false, currentX: snappedX, currentY: snappedY});

        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    };


    render() {
        const {currentX, currentY, isDragging, snappedX, snappedY} = this.state;
        const {render} = this.props;
        return (
            <div className="blob-container">
                {isDragging && snappedX !== undefined && snappedY !== undefined && (
                    <PhantomBlob
                        x={snappedX}
                        y={snappedY}
                        directory={this.props.directory}
                    />
                )}
                {render({
                    x: currentX,
                    y: currentY,
                    onMouseDown: this.handleMouseDown,
                })}
            </div>
        );
    }
}

const PhantomBlob = ({ x, y, directory }) => {
    const phantomStyle = {
        left: `${x}px`,
        top: `${y}px`,
        opacity: 0.5
    };

    return <div className="blobView" style={phantomStyle}>
        <img src={"windows-xp/icons/" + getImgFromDirectory(directory)} alt="Folder"/>
        <div className="blobViewName">{directory.name}</div>
    </div>;
};


export default Draggable;