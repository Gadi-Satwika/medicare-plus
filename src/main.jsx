import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { MedicineProvider } from "./context/MedicineContext";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <MedicineProvider>
        <App />
      </MedicineProvider>
    </AuthProvider>
  </React.StrictMode>
);
