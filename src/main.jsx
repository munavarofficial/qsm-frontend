import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Register service worker
registerSW({
  immediate: true,
  onRegistered(registration) {
    console.log("Service Worker registered:", registration);
  },
  onRegisterError(error) {
    console.error("SW registration error:", error);
  },
  onNeedRefresh() {
    console.log("New content available. Refresh the page to update.");
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
