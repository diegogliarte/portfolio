import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';
import 'normalize.css';

import Terminal from './terminal/Terminal';
import DirectoryManager from "./terminal/DirectoryManager";
import Portfolio from "./simplePortfolio/Portfolio";

DirectoryManager.init();

function App() {
    const [mode, setMode] = useState("");

    return (
        <React.StrictMode>
            <div>

                {/* Render content based on the selected mode */}
                {mode === "simple" ? (
                    <Portfolio />
                ) : mode ==="terminal" ? (
                    <Terminal theme={"dark"}/>
                ) : (
                    <div className={"select-mode"}>
                        <button className={"select-button"} onClick={() => setMode("simple")}>Simple</button>
                        <button className={"select-button"} onClick={() => setMode("terminal")}>Terminal</button>
                    </div>
                )}
            </div>
        </React.StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);

reportWebVitals();
