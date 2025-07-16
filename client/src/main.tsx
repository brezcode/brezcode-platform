import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Hide Vite development overlays
const hideViteOverlays = () => {
  const overlays = document.querySelectorAll([
    '[id*="vite-plugin"]',
    '[class*="vite-overlay"]', 
    '[data-vite-dev-id]',
    'div[style*="position: fixed"][style*="z-index"]'
  ].join(','));
  
  overlays.forEach(overlay => {
    if (overlay instanceof HTMLElement) {
      overlay.style.display = 'none';
      overlay.style.visibility = 'hidden';
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }
  });
};

// Run immediately and on DOM changes
hideViteOverlays();
const observer = new MutationObserver(hideViteOverlays);
observer.observe(document.body, { childList: true, subtree: true });

createRoot(document.getElementById("root")!).render(<App />);
