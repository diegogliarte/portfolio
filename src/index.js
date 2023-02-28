import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'normalize.css'

import Terminal from './Terminal';
import reportWebVitals from './reportWebVitals';
import Directory from "./Directory";

const root = ReactDOM.createRoot(document.getElementById('root'));

Directory.makeDir(["life"])
Directory.changeDir("life")
Directory.makeDir(["inner"])
Directory.makeFile(["meaning.txt"])
Directory.changeDir("..")

root.render(
  <React.StrictMode>
    <Terminal />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
