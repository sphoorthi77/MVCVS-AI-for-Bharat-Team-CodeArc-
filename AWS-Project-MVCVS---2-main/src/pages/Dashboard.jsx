import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSession } from "../context/SessionContext";
import { SCENARIOS } from "../data/scenarios";
import { Mic, Users, BarChart3, Clock, ChevronRight, Play } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user, selectedScenario, setSelectedScenario,
    resetSession, voiceHistory, isAuthenticated,
  } = useSession();

  // Redirect if not logged in — use useEffect, not during render
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  // Handle role case-insensitivity (backend returns EXPERT/CITIZEN uppercase)
  const userRole = user?.role?.toLowerCase() || "";

  const handleEnter = (path) => {
    resetSession();
    navigate(path);
  };

  return (
    <div className="text-white relative min-h-screen">
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, #0ea5e920 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #8b5cf620 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto p-6 pt-8">

        {/* Welcome Banner */}
        <div className="mb-8 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          <h1 className="text-3xl font-black text-white mb-1">
            Welcome back, <span className="text-sky-400">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-white/40 text-sm mt-1 capitalize">
            {userRole} Account · {user?.email}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Mic className="w-5 h-5" />, label: "Voice Sessions", value: voiceHistory.length || 0, color: "#0ea5e9" },
            { icon: <BarChart3 className="w-5 h-5" />, label: "Scenarios", value: Object.keys(SCENARIOS).length, color: "#8b5cf6" },
            { icon: <Users className="w-5 h-5" />, label: "Role", value: userRole === "expert" ? "Expert" : "Citizen", color: "#10b981" },
            { icon: <Clock className="w-5 h-5" />, label: "Status", value: "Active", color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${s.color}20`, color: s.color }}
              >
                {s.icon}
              </div>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Choose Scenario */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-1">Choose a Scenario</h2>
          <p className="text-xs text-white/30 mb-4">Select the type of expert instruction before entering a portal</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.values(SCENARIOS).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedScenario(s.id)}
                className={`relative p-5 rounded-xl border text-left transition-all duration-200 ${
                  selectedScenario === s.id
                    ? "border-sky-500/60 bg-sky-500/10 shadow-lg shadow-sky-500/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                {selectedScenario === s.id && (
                  <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-sky-400 shadow-lg shadow-sky-400/50" />
                )}
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="font-bold text-sm text-white mb-1">{s.label}</div>
                <div className="text-xs text-white/40">{s.sublabel}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Portal Entry Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {userRole === "expert" && (
            <button
              onClick={() => handleEnter("/expert")}
              className="group flex items-center justify-between p-5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
                  <Mic className="w-6 h-6 text-sky-400" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">Expert Portal</p>
                  <p className="text-xs text-white/40 mt-0.5">Record voice → AI builds DAG + quiz</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-sky-400 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
          <button
            onClick={() => handleEnter("/citizen")}
            className="group flex items-center justify-between p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Play className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white">Citizen Portal</p>
                <p className="text-xs text-white/40 mt-0.5">Listen to steps, take quiz, get score</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Voice History */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Recent Voice Sessions</h2>
          {voiceHistory.length === 0 ? (
            <div className="p-8 rounded-xl border border-white/[0.07] bg-white/[0.02] text-center">
              <p className="text-white/20 text-sm">No sessions yet.</p>
              <p className="text-white/10 text-xs mt-1">
                {userRole === "expert"
                  ? "Go to Expert Portal and record your first voice instruction."
                  : "Ask an expert to process instructions first."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {voiceHistory.slice(0, 5).map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]"
                >
                  <div className="text-2xl">{SCENARIOS[h.scenario]?.icon || "🎙️"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {SCENARIOS[h.scenario]?.label || h.scenario}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5 truncate">
                      {h.audioSummary || h.transcribedText}
                    </p>
                    <p className="text-xs text-white/20 mt-1">
                      {new Date(h.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

