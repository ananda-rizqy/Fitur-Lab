import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./app.css";
import { ThemeProvider } from "./components/themes/themes-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <GoogleOAuthProvider clientId="503041106911-inus2artgq0t0v54dc3jfacsn0d197gp.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
