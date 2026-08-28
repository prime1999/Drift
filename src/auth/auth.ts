const COGNITO_DOMAIN =
  "https://eu-north-1hiw10emnf.auth.eu-north-1.amazoncognito.com";

const CLIENT_ID = "1vhrvge8nu9m7f60js6jb0h78m";

type AuthSession = {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  expires_at: number;
};

function base64UrlEncode(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateRandomString(length = 64) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

  const randomValues = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(randomValues)
    .map((value) => characters[value % characters.length])
    .join("");
}

async function createCodeChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier);

  const digest = await crypto.subtle.digest("SHA-256", data);

  return base64UrlEncode(digest);
}

export async function signInWithGoogle(): Promise<AuthSession> {
  const codeVerifier = generateRandomString();
  const codeChallenge = await createCodeChallenge(codeVerifier);
  const state = generateRandomString(32);

  const redirectUri = chrome.identity.getRedirectURL();

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: "openid email profile",
    identity_provider: "Google",
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    state,
  });

  const authUrl = `${COGNITO_DOMAIN}/oauth2/authorize?${params.toString()}`;

  console.log("AUTH URL:", authUrl);
  console.log("REDIRECT:", redirectUri);

  const responseUrl = await chrome.identity.launchWebAuthFlow({
    url: authUrl,
    interactive: true,
  });

  console.log("========== AUTH FINISHED ==========");
  console.log("RESPONSE URL:", responseUrl);

  if (!responseUrl) {
    throw new Error("No response URL");
  }

  const callbackUrl = new URL(responseUrl);

  const returnedState = callbackUrl.searchParams.get("state");

  if (returnedState !== state) {
    throw new Error("Invalid OAuth state");
  }

  const error = callbackUrl.searchParams.get("error");

  if (error) {
    const description = callbackUrl.searchParams.get("error_description");

    throw new Error(description || error);
  }

  const code = callbackUrl.searchParams.get("code");

  if (!code) {
    throw new Error("No authorization code returned");
  }

  console.log("Authorization code received");

  // Exchange authorization code for Cognito tokens
  const tokenResponse = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();

    console.error("Token exchange failed:", errorText);

    throw new Error(`Token exchange failed: ${tokenResponse.status}`);
  }

  const tokens = await tokenResponse.json();

  console.log("Tokens received from Cognito");

  const authSession: AuthSession = {
    access_token: tokens.access_token,
    id_token: tokens.id_token,
    refresh_token: tokens.refresh_token,
    expires_in: tokens.expires_in,
    token_type: tokens.token_type,
    expires_at: Date.now() + tokens.expires_in * 1000,
  };

  // IMPORTANT:
  // Persist authentication so it survives reopening
  // the extension and opening another tab.
  await chrome.storage.local.set({
    auth: authSession,
  });

  console.log("Authentication saved");

  return authSession;
}

export async function getStoredAuth(): Promise<AuthSession | null> {
  const result = await chrome.storage.local.get("auth");

  const auth = result.auth as AuthSession | undefined;

  if (!auth) {
    return null;
  }

  // Check whether access token has expired
  if (auth.expires_at && Date.now() >= auth.expires_at) {
    console.log("Stored authentication has expired");

    // We'll add refresh-token handling next.
    await chrome.storage.local.remove("auth");

    return null;
  }

  return auth;
}

export async function signOut() {
  const logoutUri = chrome.identity.getRedirectURL();

  const logoutUrl =
    `${COGNITO_DOMAIN}/logout` +
    `?client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&logout_uri=${encodeURIComponent(logoutUri)}`;

  console.log("LOGOUT URL:", logoutUrl);

  try {
    await chrome.identity.launchWebAuthFlow({
      url: logoutUrl,
      interactive: true,
    });
  } catch (error) {
    console.error("Cognito logout error:", error);
  }

  // Always clear the local extension session
  await chrome.storage.local.remove("auth");

  console.log("Logged out successfully");
}
