import { useLocation, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { useTheme } from "../context/ThemeContext";
import { Globe, Languages, Sparkles, LogOut, User, ChevronDown, Sun, Moon, Monitor } from "lucide-react";
import { useState } from "react";

const LANG_OPTIONS = [
  { code: "en", native: "EN" },
  { code: "hi", native: "हि" },
  { code: "te", native: "తె" },
];

const THEMES = [
  { value: "dark",   label: "Dark",   icon: <Moon className="w-3.5 h-3.5" /> },
  { value: "light",  label: "Light",  icon: <Sun className="w-3.5 h-3.5" /> },
  { value: "system", label: "System", icon: <Monitor className="w-3.5 h-3.5" /> },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, resetSession, scenario, user, logout, isAuthenticated } = useSession();
  const { theme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const path = location.pathname;

  const handleHome = () => { resetSession(); navigate(isAuthenticated ? "/dashboard" : "/"); };
  const handleLogout = () => { logout(); navigate("/"); setShowMenu(false); };

  const isLight = document.documentElement.getAttribute("data-theme") === "light";

  return (
    <header
      className="relative z-50 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md"
      style={{ backgroundColor: "var(--header-bg)", borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={handleHome}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <Globe className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight" style={{ color: "var(--text-primary)" }}>MVCVS</span>
      </div>

      {/* Center badge */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        {(path === "/expert" || path === "/citizen") && scenario ? (
          <div className="flex items-center gap-3">
            <span className="text-2xl">{scenario.icon}</span>
            <div className="hidden sm:block">
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{scenario.sublabel}</span>
              <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
                {path === "/expert" ? "Expert Portal" : "Citizen Portal"}
              </span>
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20">
            <Sparkles className="w-3 h-3" /> AWS AI for Bharat
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">

        {/* Language toggle — citizen page only */}
        {path === "/citizen" && (
          <div className="flex items-center gap-1 rounded-lg p-1 mr-1" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <Languages className="w-3 h-3 ml-1.5 mr-0.5" style={{ color: "var(--text-muted)" }} />
            {LANG_OPTIONS.map((l) => (
              <button key={l.code} onClick={() => setLanguage(l.code)}
                className="px-2.5 py-1.5 rounded-md text-xs font-bold transition-all"
                style={{ background: language === l.code ? "var(--border-strong)" : "transparent", color: language === l.code ? "var(--text-primary)" : "var(--text-muted)" }}>
                {l.native}
              </button>
            ))}
          </div>
        )}

        {/* Theme switcher */}
        <div className="relative">
          <button onClick={() => { setShowTheme(!showTheme); setShowMenu(false); }}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            title="Change theme">
            {theme === "dark" ? <Moon className="w-4 h-4" /> : theme === "light" ? <Sun className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </button>
          {showTheme && (
            <div className="absolute right-0 top-full mt-2 w-36 rounded-xl shadow-xl overflow-hidden z-50"
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
              {THEMES.map((t) => (
                <button key={t.value} onClick={() => { setTheme(t.value); setShowTheme(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all"
                  style={{
                    color: theme === t.value ? "#0ea5e9" : "var(--text-secondary)",
                    background: theme === t.value ? "rgba(14,165,233,0.08)" : "transparent",
                  }}>
                  {t.icon}
                  {t.label}
                  {theme === t.value && <span className="ml-auto text-sky-400 text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auth / User menu */}
        {isAuthenticated ? (
          <div className="relative">
            <button onClick={() => { setShowMenu(!showMenu); setShowTheme(false); }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm hidden sm:block max-w-[100px] truncate" style={{ color: "var(--text-secondary)" }}>{user?.name}</span>
              <span className="text-xs hidden sm:block capitalize" style={{ color: "var(--text-muted)" }}>[{user?.role}]</span>
              <ChevronDown className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-xl overflow-hidden z-50"
                style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{user?.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 capitalize">{user?.role}</span>
                </div>
                <button onClick={() => { navigate("/dashboard"); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-sky-500/5"
                  style={{ color: "var(--text-secondary)" }}>
                  Dashboard
                </button>
                {user?.role === "expert" && (
                  <button onClick={() => { navigate("/expert"); setShowMenu(false); }}
                    className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-sky-500/5"
                    style={{ color: "var(--text-secondary)" }}>
                    Expert Portal
                  </button>
                )}
                <button onClick={() => { navigate("/citizen"); setShowMenu(false); }}
                  className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-sky-500/5"
                  style={{ color: "var(--text-secondary)" }}>
                  Citizen Portal
                </button>
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                  style={{ borderTop: "1px solid var(--border)" }}>
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/auth", { state: { isLogin: true } })}
              className="text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}>
              Login
            </button>
            <button onClick={() => navigate("/auth", { state: { isLogin: false } })}
              className="text-sm font-bold bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-sky-500/20">
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}