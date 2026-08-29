import { useEffect, useState } from "react";
import { signOut } from "../auth/auth";

type Props = {
  auth: any;
  setAuth: React.Dispatch<React.SetStateAction<any>>;
};

const MainTab = ({ auth, setAuth }: Props) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = currentTime.getHours();

  const timeOfDay =
    hours < 12
      ? "morning"
      : hours < 17
      ? "afternoon"
      : hours < 21
      ? "evening"
      : "night";

  const time = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  async function handleLogout() {
    await signOut();
    setAuth(null);
  }

  return (
    <main className="relative min-h-screen overflow-hidden z-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <p className="text-7xl font-semibold text-white">{time}</p>
        <p className="text-lg font-semibold text-white/90">
          Good {timeOfDay}, {auth?.user?.name || "there"}!
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 text-sm font-semibold text-white/70 transition-all duration-200 cursor-pointer hover:text-white/50"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
};

export default MainTab;
