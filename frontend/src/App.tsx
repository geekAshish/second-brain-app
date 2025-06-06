import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./module/context/AuthContext";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
