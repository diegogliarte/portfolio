import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';
import 'normalize.css';

import Terminal from './terminal/Terminal';
import DirectoryManager from "./terminal/DirectoryManager";
import Windows from "./windows/Windows";

DirectoryManager.init();

function App() {
    const [mode, setMode] = useState("windows");

    return (
        <React.StrictMode>
            <div>
                {/* Render content based on the selected mode */}
                {mode === "windows" ? (
                    <Windows/>
                ) : mode ==="terminal" ? (
                    <Terminal theme={"dark"}/>
                ) : (
                    <div></div>
                )}
            </div>
        </React.StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);

reportWebVitals();
