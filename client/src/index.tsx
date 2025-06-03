import React from "react";
import ReactDOM from "react-dom/client";
import "./style/index.css";
import Navigation from "./components/navigation";
import {BrowserRouter, useRoutes} from "react-router-dom";
import routes from "./routes";

const AppRoutes = (): React.ReactElement | null => {
    return useRoutes(routes);
};

const App = (): React.ReactElement => {
    return (
        <BrowserRouter>
            <Navigation/>
            <AppRoutes/>
        </BrowserRouter>
    );
};


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
