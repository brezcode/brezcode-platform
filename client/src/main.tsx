import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Disable Vite HMR to stop constant reconnections
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // Do nothing - disable HMR cleanup
  });
  
  // Override WebSocket connection attempts
  const originalWebSocket = window.WebSocket;
  window.WebSocket = class extends originalWebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      // Block Vite HMR WebSocket connections
      if (typeof url === 'string' && url.includes('/@vite/client')) {
        console.log('Blocking Vite HMR connection to reduce updates');
        super('ws://localhost:99999'); // Non-existent port to fail immediately
        return;
      }
      super(url, protocols);
    }
  };
}

// Hide Vite development overlays and connection messages
const hideViteOverlays = () => {
  const overlays = document.querySelectorAll([
    '[id*="vite-plugin"]',
    '[class*="vite-overlay"]', 
    '[data-vite-dev-id]',
    'div[style*="position: fixed"][style*="z-index"]',
    '.vite-error-overlay'
  ].join(','));
  
  overlays.forEach(overlay => {
    if (overlay instanceof HTMLElement) {
      overlay.style.display = 'none';
      overlay.style.visibility = 'hidden';
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }
  });
  
  // Hide console messages about Vite connections
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('[vite]') || message.includes('connecting...') || message.includes('connected.')) {
      return; // Block Vite connection messages
    }
    originalConsoleLog.apply(console, args);
  };
};

// Run immediately and on DOM changes
hideViteOverlays();
const observer = new MutationObserver(hideViteOverlays);
observer.observe(document.body, { childList: true, subtree: true });

createRoot(document.getElementById("root")!).render(<App />);
