import { ApolloProvider } from "@apollo/client";
import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { client } from "./apollo";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./styles/custom.css";
import "./styles/tailwind.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
