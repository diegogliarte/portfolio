import React, {useState, useEffect, useRef} from 'react';
import "./Line.css"

function Line(props) {
    const [showCursor, setShowCursor] = useState(true);
    const textareaRef = useRef(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setShowCursor(prevShowCursor => !prevShowCursor);
        }, 500);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // Add a CSS class to the textarea to animate it when the component mounts
        if (textareaRef.current) {
            alert("added animated")
            textareaRef.current.classList.add('animated-textarea');

        }
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
                <span className="empty-span">42</span>

            ) : props.isTouchDevice ? (
                <textarea
                    ref={textareaRef}
                    rows='1'
                    id="textarea-touch"
                    className={"stdout textarea-touch animated-textarea " + props.theme}
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