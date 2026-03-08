import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { Mic, Brain, ShieldCheck, ChevronRight, Zap, BarChart3, Languages, Users, Globe, Award, Star, Quote, ArrowRight } from "lucide-react";

const FEATURES = [
  { icon: <Mic className="w-6 h-6" />, title: "Real Voice Recording", desc: "Speak directly into your browser microphone. AI transcribes in real-time using speech recognition.", color: "#0ea5e9" },
  { icon: <Brain className="w-6 h-6" />, title: "AI Meaning Extraction", desc: "Claude AI extracts procedural steps, deadlines, and consequences from expert speech.", color: "#8b5cf6" },
  { icon: <ShieldCheck className="w-6 h-6" />, title: "Comprehension Verification", desc: "AI-generated quizzes confirm citizens truly understood — not just heard — the instructions.", color: "#10b981" },
  { icon: <BarChart3 className="w-6 h-6" />, title: "Predictive Risk Scoring", desc: "Before failure happens, identify who is likely to miss steps and intervene early.", color: "#f59e0b" },
];

const TESTIMONIALS = [
  {
    quote: "This system helped me understand my hospital instructions clearly. The quiz made sure I really understood.",
    name: "Ramesh Kumar",
    role: "Patient",
    avatar: "RK",
    color: "#0ea5e9"
  },
  {
    quote: "As a banker, I can now ensure my customers truly understand loan terms before they sign.",
    name: "Priya Sharma",
    role: "Bank Officer",
    avatar: "PS",
    color: "#8b5cf6"
  },
  {
    quote: "The voice translation feature is amazing! It explains government procedures in simple language.",
    name: "Anil Reddy",
    role: "Citizen",
    avatar: "AR",
    color: "#10b981"
  }
];

const STATS = [
  { value: "50+", label: "Healthcare Scenarios", icon: "🏥" },
  { value: "10K+", label: "Citizens Helped", icon: "👥" },
  { value: "95%", label: "Comprehension Rate", icon: "📈" },
  { value: "3", label: "Languages Supported", icon: "🌐" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSession();

  return (
    <div className="text-white font-sans overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none" style={{ 
        backgroundImage: "linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px)", 
        backgroundSize: "60px 60px" 
      }} />
      
      {/* Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-sky-400 bg-sky-400/10 px-4 py-2 rounded-full border border-sky-400/20 mb-8">
          <Zap className="w-3 h-3" />AWS AI for Bharat Hackathon Winner
        </div>
        <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-none tracking-tight">
          <span className="block text-white">Bridging the Gap</span>
          <span className="block" style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #10b981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Between Expert & Citizen
          </span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mx-auto mb-12 leading-relaxed">
          Doctors, bankers, and government officers speak in complex language. Citizens nod without understanding.
          MVCVS <strong className="text-white/80">records voice, translates, simplifies, and verifies comprehension</strong> — preventing procedural failure before it happens.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          {isAuthenticated ? (
            <button onClick={() => navigate("/dashboard")}
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all text-white"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)" }}>
              Go to Dashboard <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/auth", { state: { isLogin: false } })}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all text-white"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)" }}>
                <Mic className="w-4 h-4" />Get Started Free
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate("/auth", { state: { isLogin: true } })}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm border border-white/20 hover:bg-white/5 transition-all">
                <Languages className="w-4 h-4" />Sign In
              </button>
            </>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {STATS.map((stat, i) => (
            <div key={i} className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-white/50 max-w-xl mx-auto">Everything you need to ensure instructions are understood, not just translated.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-all hover:scale-105">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: `${f.color}20`, color: f.color }}>{f.icon}</div>
              <h3 className="font-bold text-sm text-white mb-2">{f.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-24">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8">
          <p className="text-xs text-white/30 uppercase tracking-widest text-center mb-8">How It Works</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            {["Expert Records Voice", "AI Transcribes", "Logic DAG Extracted", "Citizen Gets Steps", "Quiz Verifies", "Risk Score Saved"].map((step, i, arr) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold mb-2"
                    style={{ background: `hsl(${200 + i * 20}, 80%, 50%)20`, color: `hsl(${200 + i * 20}, 80%, 70%)`, border: `1px solid hsl(${200 + i * 20}, 80%, 50%)30` }}>
                    {i + 1}
                  </div>
                  <span className="text-[10px] text-white/40 max-w-[70px] leading-tight">{step}</span>
                </div>
                {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-white/20 hidden sm:block flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What People Say</h2>
          <p className="text-white/50 max-w-xl mx-auto">Real stories from users who benefited from MVCVS.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
              <Quote className="w-8 h-8 mb-4 opacity-30" style={{ color: t.color }} />
              <p className="text-sm text-white/70 mb-6 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: `${t.color}20`, color: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 pb-24">
        <div className="rounded-3xl p-12 text-center overflow-hidden relative" 
          style={{ background: "linear-gradient(135deg, rgba(14,165,233,0.15) 0%, rgba(139,92,246,0.15) 100%)", border: "1px solid rgba(14,165,233,0.2)" }}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-30" />
          <div className="relative z-10">
            <Globe className="w-12 h-12 mx-auto mb-6 text-sky-400" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Join thousands of experts and citizens who are improving understanding through AI-powered voice.
             comprehension</p>
            {!isAuthenticated && (
              <button 
                onClick={() => navigate("/auth", { state: { isLogin: false } })}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all text-white"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)" }}
              >
                Create Free Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Supported Languages */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 pb-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Supported Languages</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { code: "English", native: "English", flag: "🇬🇧" },
              { code: "Hindi", native: "हिंदी", flag: "🇮🇳" },
              { code: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
            ].map((lang, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium text-white">{lang.native}</span>
                <span className="text-white/40 text-sm">({lang.code})</span>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-sm mt-6">More languages coming soon!</p>
        </div>
      </section>
    </div>
  );
}

