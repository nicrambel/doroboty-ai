import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { startAnalytics } from "./features/analytics/posthog";
import { App } from "./features/prototype/app";
import "./app/globals.css";

startAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
