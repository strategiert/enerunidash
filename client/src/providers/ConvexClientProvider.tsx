import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Die URL wird aus der Umgebungsvariable geladen
const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  console.warn("VITE_CONVEX_URL is not set. Convex will not be available.");
}

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

interface ConvexClientProviderProps {
  children: ReactNode;
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  if (!convex) {
    // Wenn keine Convex-URL konfiguriert ist, rendern wir die Kinder ohne Provider
    // Dies ermöglicht die App während der Entwicklung ohne Convex zu testen
    return <>{children}</>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
