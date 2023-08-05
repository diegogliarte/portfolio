import React, { Component } from "react";
import {getImgFromDirectory} from "./BlobView";

class Draggable extends Component {

    topMargin = 30

    constructor(props) {
        super(props);
        const {blobSize, spacing} = this.props
        this.state = {
            isDragging: false,
            initialX: blobSize / 2,
            initialY: blobSize / 2,
            currentX: (blobSize + this.props.x * (blobSize + spacing)),
            currentY: (this.topMargin + blobSize + this.props.y * (blobSize + spacing)),
        };
    }


    getSnappedCoordinates(currentX, currentY) {
        const {blobSize, spacing, screenWidth, screenHeight} = this.props;

        const spaceBetween = blobSize + spacing

        const minCoordsLeft = blobSize
        const minCoordsUp = this.topMargin + blobSize

        const maxBlobsInRow = Math.floor(screenWidth / spaceBetween) - 1
        const maxBlobsInCol = Math.floor(screenHeight / spaceBetween) - 1

        const coordsX = Math.floor((currentX - blobSize / 2) / spaceBetween)
        const snappedX = Math.min(blobSize + maxBlobsInRow * spaceBetween, Math.max(minCoordsLeft, blobSize + coordsX * spaceBetween))

        const coordsY = Math.floor((currentY - blobSize / 2) / spaceBetween)
        const snappedY = Math.min(blobSize + maxBlobsInCol * spaceBetween, Math.max(minCoordsUp, this.topMargin + blobSize + coordsY * spaceBetween))
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
            <>
                {isDragging && snappedX !== undefined && snappedY !== undefined && (
                    <PhantomBlob
                        x={snappedX}
                        y={snappedY}
                        blobSize={this.props.blobSize}
                        directory={this.props.directory}
                    />
                )}
                {render({
                    x: currentX,
                    y: currentY,
                    onMouseDown: this.handleMouseDown,
                })}
            </>
        );
    }
}

const PhantomBlob = ({ x, y, blobSize, directory }) => {
    const phantomStyle = {
        left: `${x}px`,
        top: `${y}px`,
        width: `${blobSize}px`,
        height: `${blobSize}px`,
        opacity: 0.5,
        position: "absolute",
    };

    return <div className="blobView" style={phantomStyle}>
        <img src={"windows-xp/icons/" + getImgFromDirectory(directory)}/>
    </div>;
};


export default Draggable;