import React, {useState, useEffect} from 'react';
import "./Line.css"
import {logDOM} from "@testing-library/react";

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

            {/* Renders prompt (diegogliarte@ubuntu:~$ )*/}
            {props.prompt !== null &&
                <span className="prompt">
                    <span className="user">diegogliarte@ubuntu</span>
                    <span>:</span>
                    <span className="tilde">{props.prompt}</span>
                    <span>$ </span>
                </span>
            }

            {/* Renders empty message */}
            {props.stdout === '' && !props.current ? (
                <span className="empty-span" visible="true">42</span>

            ) : props.isTouchDevice ? (
                <textarea
                    rows='1'
                    className="stdout textarea-touch"
                    autoFocus
                />
            ) : props.current ? (
                <span className="stdout">
                    {props.stdout.split("").map((character, idx) => (
                        idx === props.cursorPosition && showCursor ? <span key={idx} className="cursor">█</span> : <span key={idx}>{character}</span>
                    ))}

                    {props.stdout.length === props.cursorPosition && showCursor ? <span className="cursor">█</span> : ""}
                </span>
            ) : (
                <span className="stdout" dangerouslySetInnerHTML={{__html: props.stdout}}/>
            )}
        </div>
    );
}

export default Line;