import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
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
                <Terminal theme={"dark"}/>
            </div>
        </React.StrictMode>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App />);

reportWebVitals();
