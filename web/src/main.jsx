import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthProvider from "./contexts/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="235450875863-m8ob4gutbrvkltpej4upuogj3lgdinpv.apps.googleusercontent.com">
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  </GoogleOAuthProvider>,
);
