import React, { Component } from "react";

class Draggable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDragging: false,
            initialX: 0,
            initialY: 0,
            currentX: (this.props.blobSize + this.props.x * (this.props.blobSize + this.props.spacing)),
            currentY: (this.props.blobSize + this.props.y * (this.props.blobSize + this.props.spacing)),
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    handleResize = () => {
        this.setState({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
        });
    };

    handleMouseDown = (event) => {
        event.preventDefault();
        const { currentX, currentY } = this.state;

        this.setState({
            isDragging: true,
            initialX: event.clientX - currentX,
            initialY: event.clientY - currentY,
        });

        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    };

    handleMouseMove = (event) => {
        const { isDragging, initialX, initialY } = this.state;

        if (isDragging) {
            const currentX = event.clientX - initialX;
            const currentY = event.clientY - initialY;
            this.setState({ currentX, currentY });
        }
    };

    handleMouseUp = () => {
        const { currentX, currentY, screenWidth, screenHeight } = this.state;
        const { blobSize, spacing } = this.props;

        const spaceBetween = blobSize + spacing

        const minCoordsLeft = blobSize
        const minCoordsUp = blobSize
        const maxCoordsRight = (Math.floor(screenWidth / spaceBetween) - 1) * spaceBetween
        const maxCoordsDown = (Math.floor(screenHeight / spaceBetween) - 1) * spaceBetween

        const coordsX =  Math.floor(currentX / spaceBetween)
        const snappedX = Math.min(maxCoordsRight, Math.max(minCoordsLeft, blobSize + coordsX * spaceBetween))

        const coordsY = Math.floor(currentY / spaceBetween)
        const snappedY = Math.min(maxCoordsDown, Math.max(minCoordsUp, blobSize + coordsY * spaceBetween))

        this.setState({ isDragging: false, currentX: snappedX, currentY: snappedY });

        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    };

    render() {
        const { currentX, currentY } = this.state;
        const { render } = this.props;

        return render({ x: currentX, y: currentY, onMouseDown: this.handleMouseDown });
    }
}

export default Draggable;
