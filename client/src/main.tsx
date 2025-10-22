import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/sessionTimeout"; // Initialize session timeout manager

createRoot(document.getElementById("root")!).render(<App />);
