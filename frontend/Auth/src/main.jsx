import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);