import React, {useState, useEffect} from 'react';
import "./Line.css"

function Line(props) {
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setShowCursor((prevShowCursor) => !prevShowCursor);
        }, 500);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={"line " + props.theme} data-testid="line">
            {props.prompt !== null &&
                <span className="prompt">
                    <span className="user">diegogliarte@ubuntu</span>
                    <span>:</span>
                    <span className="tilde">{props.prompt}</span>
                    <span>$ </span>
                </span>
            }
            {props.stdout === '' ? (
                <span className="empty-span" visible="true">42</span>
            ) : (
                <span className="stdout" dangerouslySetInnerHTML={{__html: props.stdout}}/>
            )}
            {props.current &&
                <span className="cursor">{showCursor ? '█' : ''}</span>}
        </div>
    );
}

export default Line;