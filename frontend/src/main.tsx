import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Apply saved theme and accent color before first render
const savedTheme  = localStorage.getItem("algoquizr_theme");
const savedAccent = localStorage.getItem("algoquizr_accent");

if (savedTheme === "light") {
  document.documentElement.style.setProperty("--bg",             "#f4f4f8");
  document.documentElement.style.setProperty("--bg-surface",     "#ffffff");
  document.documentElement.style.setProperty("--bg-elevated",    "#f0f0f5");
  document.documentElement.style.setProperty("--text-primary",   "#0d0f1a");
  document.documentElement.style.setProperty("--text-secondary", "#4a4d66");
  document.documentElement.style.setProperty("--text-muted",     "#9191a8");
  document.documentElement.style.setProperty("--border",         "rgba(0,0,0,0.09)");
}

if (savedAccent) {
  document.documentElement.style.setProperty("--violet",       savedAccent);
  document.documentElement.style.setProperty("--border-accent", savedAccent + "55");
  document.documentElement.style.setProperty("--violet-dim",    savedAccent + "18");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);