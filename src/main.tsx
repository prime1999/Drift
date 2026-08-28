import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_HiW10EmnF",

  client_id: "1vhrvge8nu9m7f60js6jb0h78m",

  redirect_uri: "https://dchemdncpgpkjkambibcjcekpmlcdkkj.chromiumapp.org/",

  response_type: "code",

  scope: "email openid profile",

  userStore: new WebStorageStateStore({
    store: window.localStorage,
  }),
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
