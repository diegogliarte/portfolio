import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import './index.css';
import 'normalize.css';

import Terminal from './terminal/Terminal';
import DirectoryManager from "./DirectoryManager";
import Windows from "./windows/Windows";
import AppContext from "./AppContext";

DirectoryManager.init();

function App() {
    const [mode, setMode] = useState("windows-xp");
    AppContext.saveMode(setMode)

    // Use useEffect to set the mode-specific class on the `html` element
    useEffect(() => {
        document.documentElement.classList.remove("windows-bg", "terminal-bg");
        document.documentElement.classList.add(mode === "windows-xp" ? "windows-bg" : "terminal-bg");
    }, [mode]);

    return (
        <React.StrictMode>
            <div >
                {/* Render content based on the selected mode */}
                {mode === "windows-xp" ? (
                    <Windows key={"windows"}/>
                ) : mode ==="terminal" ? (
                    <Terminal key={"terminal"}/>
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
