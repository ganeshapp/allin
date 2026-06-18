import { useState } from "react";
import { StudyTab } from "./tabs/StudyTab";
import { PlayTab } from "./tabs/PlayTab";
import { AboutModal } from "./components/AboutModal";
import logo from "./assets/logo.png";

type Tab = "study" | "play";

export default function App() {
  const [tab, setTab] = useState<Tab>("play");
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <img src={logo} alt="" className="brand-logo" />
          <h1>All-In</h1>
          <button
            type="button"
            className="info-btn"
            onClick={() => setShowAbout(true)}
            aria-label="About All-In"
            title="About"
          >
            ⓘ
          </button>
          <span className="brand-tag">Poker Training</span>
        </div>
        <nav className="tab-nav">
          <button
            type="button"
            className={`tab-btn ${tab === "study" ? "active" : ""}`}
            onClick={() => setTab("study")}
          >
            Study
          </button>
          <button
            type="button"
            className={`tab-btn ${tab === "play" ? "active" : ""}`}
            onClick={() => setTab("play")}
          >
            Play
          </button>
        </nav>
      </header>

      <main className="app-main">
        {tab === "study" ? <StudyTab /> : <PlayTab />}
      </main>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}
