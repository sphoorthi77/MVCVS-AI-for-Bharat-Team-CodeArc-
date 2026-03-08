import { Moon, Sun, Monitor, Globe } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <footer className="relative z-10 border-t mt-auto" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Column 1: About */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-bold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>MVCVS</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Multilingual Voice Comprehension & Verification System. We ensure that translated instructions are actually understood, not just converted to another language.
          </p>
        </div>

        {/* Column 2: Theme Changer */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest mb-5" style={{ color: "var(--text-secondary)" }}>Appearance</h3>
          <div className="flex flex-col gap-2 w-fit">
            {themeOptions.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-sky-500/10 border border-sky-500/30 text-sky-400 font-medium"
                      : "hover:bg-white/5"
                  }`}
                  style={{ 
                    color: isActive ? "#0ea5e9" : "var(--text-muted)",
                    borderColor: isActive ? "rgba(14,165,233,0.3)" : "transparent"
                  }}
                >
                  <Icon className="w-4 h-4" /> {t.label}
                  {isActive && <span className="ml-auto text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 3: Developed By */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest mb-5" style={{ color: "var(--text-secondary)" }}>Developed By</h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-sky-400">
                MS
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Mallipudi Sphoorthi</span>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-violet-400">
                SM
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Shivansh Mishra</span>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-emerald-400">
                PM
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Prachi Mehta</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-6 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--border)" }}>
        <p className="text-xs" style={{ color: "var(--text-faint)" }}>
          © {new Date().getFullYear()} Team CodeArc. AWS AI for Bharat Hackathon.
        </p>
        <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-faint)" }}>
          <span className="cursor-pointer transition-colors hover:text-sky-400">Privacy Policy</span>
          <span className="cursor-pointer transition-colors hover:text-sky-400">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}

