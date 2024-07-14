import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { devMode } from "./utils/Utils";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
if (devMode()) {
    root.render(
        <React.StrictMode>
            <App
                className={
                    "flex min-h-screen flex-col scroll-smooth bg-flyNow-main bg-opacity-50 bg-home-page-background bg-cover bg-fixed bg-no-repeat font-inter text-white"
                }
            />
        </React.StrictMode>,
    );
} else
    root.render(
        <App
            className={
                "flex min-h-screen flex-col scroll-smooth bg-flyNow-main bg-opacity-50 bg-home-page-background bg-cover bg-fixed bg-no-repeat font-inter text-white"
            }
        />,
    );

reportWebVitals();
