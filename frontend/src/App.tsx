import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "./components/ErrorBoundary";
import WeatherPage from "./pages/WeatherPage";

const queryClient = new QueryClient();

export default function App() {
  return (
    <main className="min-h-svh bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-6">
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <WeatherPage />
        </QueryClientProvider>
      </ErrorBoundary>
    </main>
  );
}
