import React, {useState, useEffect} from 'react';
import "./Line.css"

function Line(props) {
    console.log(props.stdout)
    return (
        <div className="line">
            {props.hasPrompt &&
                <span className="prompt">
                    <span className="user">diegogliarte@ubuntu</span>
                    <span>:</span>
                    <span className="tilde">~</span>
                    <span>$ </span>
                </span>
            }
            <span className="stdout">{props.stdout}</span>
        </div>
    );
}

export default Line;