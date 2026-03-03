import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import React, { useEffect, useState } from "react";
import { Layout } from "./components/layout/Layout";
import { AppProvider } from "./contexts/AppContext";
import About from "./pages/About";
import { AdminPanel } from "./pages/AdminPanel";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import { BookingFlow } from "./pages/BookingFlow";
import Career from "./pages/Career";
import Contact from "./pages/Contact";
import { CustomerBookings } from "./pages/CustomerBookings";
import { CustomerProfile } from "./pages/CustomerProfile";
import { CustomerWallet } from "./pages/CustomerWallet";
import FAQ from "./pages/FAQ";
import { Home } from "./pages/Home";
import Mission from "./pages/Mission";
import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSuccess";
import Privacy from "./pages/Privacy";
import { RegistrationPending } from "./pages/RegistrationPending";
import { SalonDetail } from "./pages/SalonDetail";
import { SalonOwnerDashboard } from "./pages/SalonOwnerDashboard";
import { SalonOwnerRegistration } from "./pages/SalonOwnerRegistration";
import { SearchResults } from "./pages/SearchResults";
import { SocialFeed } from "./pages/SocialFeed";
import Terms from "./pages/Terms";
import Vision from "./pages/Vision";

// PWA Install Prompt
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 3 seconds delay
      setTimeout(() => setShowBanner(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "#1a1a1a",
        border: "1px solid #D4AF37",
        borderRadius: "16px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        maxWidth: "340px",
        width: "calc(100vw - 32px)",
      }}
    >
      <img
        src="/assets/generated/haircut-pwa-icon-192.dim_192x192.png"
        alt="Haircut.com"
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "10px",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>
          Install Haircut.com
        </div>
        <div style={{ color: "#aaa", fontSize: "12px" }}>
          Add to home screen for quick access
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          flexShrink: 0,
        }}
      >
        <button
          onClick={handleInstall}
          style={{
            background: "#D4AF37",
            color: "#1a1a1a",
            border: "none",
            borderRadius: "20px",
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
          type="button"
        >
          Install
        </button>
        <button
          type="button"
          onClick={() => setShowBanner(false)}
          style={{
            background: "transparent",
            color: "#888",
            border: "none",
            fontSize: "11px",
            cursor: "pointer",
            padding: "2px 0",
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <AppProvider>
      <Layout />
    </AppProvider>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: SearchResults,
});
const salonDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/salon/$salonId",
  component: SalonDetail,
});
const bookingFlowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/booking/$salonId",
  component: BookingFlow,
});
const customerBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bookings",
  component: CustomerBookings,
});
const customerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: CustomerProfile,
});
const ownerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner/dashboard",
  component: SalonOwnerDashboard,
});
const ownerRegistrationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner/register",
  component: SalonOwnerRegistration,
});
const registrationPendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner/pending",
  component: RegistrationPending,
});
const adminPanelRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPanel,
});
const socialFeedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/feed",
  component: SocialFeed,
});
const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: CustomerWallet,
});
const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: Blog,
});
const blogDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$postId",
  component: BlogDetail,
});
const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FAQ,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: Contact,
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: Terms,
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy",
  component: Privacy,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});
const careerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/career",
  component: Career,
});
const visionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/vision",
  component: Vision,
});
const missionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mission",
  component: Mission,
});
const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccess,
});
const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailure,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  searchRoute,
  salonDetailRoute,
  bookingFlowRoute,
  customerBookingsRoute,
  customerProfileRoute,
  ownerDashboardRoute,
  ownerRegistrationRoute,
  registrationPendingRoute,
  adminPanelRoute,
  socialFeedRoute,
  walletRoute,
  blogRoute,
  blogDetailRoute,
  faqRoute,
  contactRoute,
  termsRoute,
  privacyRoute,
  aboutRoute,
  careerRoute,
  visionRoute,
  missionRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
        <PWAInstallBanner />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
