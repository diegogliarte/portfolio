import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'normalize.css'

import Terminal from './Terminal';
import reportWebVitals from './reportWebVitals';
import Directory from "./Directory";
import Blob from "./Blob";

const root = ReactDOM.createRoot(document.getElementById('root'));

Directory.makeDir(["life"])
Directory.changeDir("life")
let meaning = new Blob("meaning.txt", Directory.currentDirectory, "file")
meaning.content = 42
Directory.currentDirectory.addBlob(meaning)
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
