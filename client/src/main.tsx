import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Completely disable Vite HMR and WebSocket connections
if (import.meta.hot) {
  import.meta.hot.dispose(() => {});
  import.meta.hot.decline();
}

// Block ALL WebSocket connections to prevent Vite reconnections
const originalWebSocket = window.WebSocket;
let wsBlockCount = 0;

window.WebSocket = class extends originalWebSocket {
  constructor(url: string | URL, protocols?: string | string[]) {
    const urlString = typeof url === 'string' ? url : url.toString();
    
    // Block all Vite-related WebSocket connections
    if (urlString.includes('vite') || urlString.includes('/@vite') || 
        urlString.includes(':5173') || urlString.includes(':24678') ||
        urlString.includes('ws://localhost') && !urlString.includes('your-app-ws')) {
      
      wsBlockCount++;
      console.log(`Blocked Vite WebSocket #${wsBlockCount}: ${urlString}`);
      
      // Create a fake WebSocket that immediately fails
      const fakeWs = {
        readyState: 3, // CLOSED
        close: () => {},
        send: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
        onopen: null,
        onclose: null,
        onerror: null,
        onmessage: null
      };
      
      // Return fake WebSocket to prevent actual connection
      return fakeWs as any;
    }
    
    super(url, protocols);
  }
};

// Disable Vite client completely
if ('__vite__' in window) {
  (window as any).__vite__ = undefined;
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
  
  // Block ALL Vite console messages
  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  
  console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('[vite]') || message.includes('connecting') || 
        message.includes('connected') || message.includes('hmr') ||
        message.includes('WebSocket') || message.includes('ws://')) {
      return;
    }
    originalConsoleLog.apply(console, args);
  };
  
  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('[vite]') || message.includes('WebSocket') || message.includes('ws://')) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
  
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('[vite]') || message.includes('WebSocket') || message.includes('ws://')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
};

// Run immediately and on DOM changes
hideViteOverlays();
const observer = new MutationObserver(hideViteOverlays);
observer.observe(document.body, { childList: true, subtree: true });

createRoot(document.getElementById("root")!).render(<App />);
