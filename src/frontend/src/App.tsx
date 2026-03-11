import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useCallerProfile } from "./hooks/useQueries";

import AppLayout from "./components/AppLayout";
import SetupNameModal from "./components/SetupNameModal";
import AdminPanelPage from "./pages/AdminPanelPage";
import DashboardPage from "./pages/DashboardPage";
import DocumentGeneratorPage from "./pages/DocumentGeneratorPage";
import DocumentPreviewPage from "./pages/DocumentPreviewPage";
// Pages
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RCNCalculatorPage from "./pages/RCNCalculatorPage";
import SavedDocumentsPage from "./pages/SavedDocumentsPage";

// Root layout component
function RootComponent() {
  return <Outlet />;
}

function ProtectedLayout() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useCallerProfile();
  const { isFetching } = useActor();

  if (!identity) {
    window.location.href = "/login";
    return null;
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading SBZ TradeDesk...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppLayout />
      {profile !== undefined && profile !== null && !profile.name && (
        <SetupNameModal />
      )}
    </>
  );
}

// Route definitions
const rootRoute = createRootRoute({ component: RootComponent });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: ProtectedLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: DashboardPage,
});

const generatorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/generate/$docType",
  component: DocumentGeneratorPage,
});

const previewRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/preview/$docId",
  component: DocumentPreviewPage,
});

const savedRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/documents",
  component: SavedDocumentsPage,
});

const calculatorRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/calculator",
  component: RCNCalculatorPage,
});

const adminRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/admin",
  component: AdminPanelPage,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    generatorRoute,
    previewRoute,
    savedRoute,
    calculatorRoute,
    adminRoute,
    profileRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  const path = window.location.pathname;
  if (!identity && path !== "/login") {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
