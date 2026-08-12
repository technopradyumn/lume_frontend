import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

import "./styles/design-tokens.css";
import "./styles/reset.css";
import "./styles/animations.css";
import "./styles/utilities.css";
import "./styles/layout.css";
import "./styles/components.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
