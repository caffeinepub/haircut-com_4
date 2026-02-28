import ReactDOM from "react-dom/client";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "../index.css";

const queryClient = new QueryClient();

// Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[SW] Registered:', registration.scope);
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New content available');
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log('[SW] Registration failed:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
