const COGNITO_DOMAIN =
  "https://eu-north-1hiw10emnf.auth.eu-north-1.amazoncognito.com";

const CLIENT_ID = "1vhrvge8nu9m7f60js6jb0h78m";

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

function decodeJwt(token: string) {
  const payload = token.split(".")[1];

  if (!payload) {
    throw new Error("Invalid ID token");
  }

  const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

  return JSON.parse(decoded);
}

export async function signInWithGoogle() {
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

  const authUrl = `${COGNITO_DOMAIN}/oauth2/authorize?${params}`;

  const responseUrl = await chrome.identity.launchWebAuthFlow({
    url: authUrl,
    interactive: true,
  });

  if (!responseUrl) {
    throw new Error("No response URL");
  }

  const callbackUrl = new URL(responseUrl);

  const returnedState = callbackUrl.searchParams.get("state");

  if (returnedState !== state) {
    throw new Error("Invalid OAuth state");
  }

  const code = callbackUrl.searchParams.get("code");

  if (!code) {
    const error = callbackUrl.searchParams.get("error");

    throw new Error(error || "No authorization code returned");
  }

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
    const error = await tokenResponse.text();

    throw new Error(`Token exchange failed: ${error}`);
  }

  const tokens = await tokenResponse.json();

  // Get user information from Cognito ID token
  const user = decodeJwt(tokens.id_token);

  const auth = {
    ...tokens,

    user: {
      id: user.sub,
      name: user.nickname,
      email: user.email,
      picture: user.picture,
    },
  };

  // Persist authentication
  await chrome.storage.local.set({
    auth,
  });

  return auth;
}

export async function getStoredAuth() {
  const result = await chrome.storage.local.get("auth");

  return result.auth || null;
}

export async function signOut() {
  const logoutUri = chrome.identity.getRedirectURL();

  const logoutUrl =
    `${COGNITO_DOMAIN}/logout` +
    `?client_id=${encodeURIComponent(CLIENT_ID)}` +
    `&logout_uri=${encodeURIComponent(logoutUri)}`;

  try {
    await chrome.identity.launchWebAuthFlow({
      url: logoutUrl,
      interactive: true,
    });
  } catch (error) {
    console.error("Cognito logout error:", error);
  }

  await chrome.storage.local.remove("auth");

  console.log("Logged out successfully");
}
