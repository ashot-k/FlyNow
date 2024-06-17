import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App className={"flex flex-col bg-flyNow-main text-slate-300 min-h-screen "}/>
    </React.StrictMode>
);
reportWebVitals();
