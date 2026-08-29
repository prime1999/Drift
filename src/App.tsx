import { useEffect, useState } from "react";
import { signInWithGoogle, getStoredAuth } from "./auth/auth";
import femaleImage from "../public/images/female.jpg";
import MainTab from "./components/MainTab";

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

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${femaleImage})`,
        }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 z-10 bg-black/60" />

      {/* Content */}
      <div className="relative z-20 min-h-screen">
        {loading ? (
          <div className="flex min-h-screen items-center justify-center text-white">
            Loading...
          </div>
        ) : !auth ? (
          <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 z-50">
            <h1 className="text-xl text-white font-bold">DRIFT</h1>
            <h3 className="text-xl font-bold text-white mb-4">
              Your browser, finally in sync with your work.
            </h3>
            <p className="mx-auto mt-6 max-w-lg rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-center leading-7 text-white/80 shadow-lg backdrop-blur-md">
              Drift turns your browser into a focused workspace that understands
              what you are working on, keeps what matters within reach, and
              helps you move forward without the tab chaos.
            </p>

            <button
              onClick={handleLogin}
              className="mt-4 text-sm rounded-lg py-2 px-6 font-semiold bg-white text-black transition-all duration-200 cursor-pointer hover:bg-white/90"
            >
              Get Started
            </button>

            {error && <p className="mt-4 text-red-500">{error}</p>}
          </div>
        ) : (
          <MainTab auth={auth} setAuth={setAuth} />
        )}
      </div>
    </main>
  );
}

export default App;
