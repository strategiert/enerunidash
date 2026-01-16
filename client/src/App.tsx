import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CalendarPage from "./pages/Calendar";
import CampaignsPage from "./pages/Campaigns";
import ClusterDetailPage from "./pages/ClusterDetail";
import ContentPage from "./pages/Content";
import PillarDetailPage from "./pages/PillarDetail";
import Dashboard from "./pages/Dashboard";
import KeywordsPage from "./pages/Keywords";
import SettingsPage from "./pages/Settings";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/calendar"} component={CalendarPage} />
      <Route path={"/keywords"} component={KeywordsPage} />
      <Route path={"/cluster/:cluster"} component={ClusterDetailPage} />
      <Route path={"/content"} component={ContentPage} />
      <Route path={"/pillar/:pillarId"} component={PillarDetailPage} />
      <Route path={"/campaigns"} component={CampaignsPage} />
      <Route path={"/settings"} component={SettingsPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
