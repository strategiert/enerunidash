import { createRoot } from "react-dom/client";
import App from "./App";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ConvexClientProvider>
    <App />
  </ConvexClientProvider>
);
