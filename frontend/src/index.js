import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { installSeoHeadCleanup } from "@/seoHeadCleanup";

// Must run before React renders: it records which SEO tags came with the HTML file.
installSeoHeadCleanup();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
