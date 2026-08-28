import { useEffect, useState } from "react";
import { signInWithGoogle, getStoredAuth, signOut } from "./auth/auth";

function App() {
  const [auth, setAuth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAuth() {
      try {
        const storedAuth = await getStoredAuth();

        setAuth(storedAuth);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAuth();
  }, []);

  async function handleLogin() {
    try {
      setLoading(true);
      setError("");

      const tokens = await signInWithGoogle();

      setAuth(tokens);
    } catch (error) {
      console.error("Login failed:", error);

      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await signOut();

    setAuth(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome to Drift</h1>

        <button
          onClick={handleLogin}
          className="mt-4 rounded-lg bg-black px-5 py-3 text-white"
        >
          Continue with Google
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to Drift</h1>

      <p className="mt-2">You are authenticated.</p>

      <button
        onClick={handleLogout}
        className="mt-4 rounded-lg border px-5 py-3"
      >
        Sign out
      </button>
    </div>
  );
}

export default App;
