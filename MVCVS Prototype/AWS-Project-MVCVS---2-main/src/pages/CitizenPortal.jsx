import { useState, useEffect } from "react";
import { useSession } from "../context/SessionContext";
import api from "../api";
import { 
  Play, Pause, Volume2, VolumeX, CheckCircle, XCircle,
  Brain, AlertTriangle, ChevronRight, User, Building2,
  Clock, Award, RefreshCw, Languages, BookOpen,
  Check, X, Loader2, MessageSquare
} from "lucide-react";

export default function CitizenPortal() {
  const { 
    user, selectedScenario, scenario, 
    speak, stopSpeaking, language, setLanguage,
    verificationScore, riskLevel
  } = useSession();

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    loadUserSessions();
  }, []);

  useEffect(() => {
    // Reset when session changes
    setQuizAnswers({});
    setQuizResult(null);
    setCurrentStep(0);
  }, [selectedSession]);

  async function loadUserSessions() {
    try {
      setLoading(true);
      const res = await api.get("/reports");
      setSessions(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedSession(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setLoading(false);
    }
  }

  function speechLang() {
    if (language === "hi") return "hi-IN";
    if (language === "te") return "te-IN";
    return "en-IN";
  }

  function handleSpeak(text) {
    stopSpeaking();
    setIsPlaying(true);
    speak(text, speechLang());
    setTimeout(() => setIsPlaying(false), text.length * 50);
  }

  function handleStopSpeaking() {
    stopSpeaking();
    setIsPlaying(false);
  }

  function handleAnswer(questionId, answer) {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }

  async function submitQuiz() {
    if (!selectedSession?.id) return;

    try {
      const res = await api.post(`/reports/${selectedSession.id}/submit`, {
        answers: quizAnswers
      });
      setQuizResult(res.data);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      // Calculate local result
      const questions = getQuizQuestions();
      let correct = 0;
      questions.forEach(q => {
        const qId = q.id || q.question;
        if (quizAnswers[qId] === q.correct) {
          correct++;
        }
      });
      setQuizResult({
        score: correct,
        totalQuestions: questions.length,
        passed: correct / questions.length >= 0.5
      });
    }
  }

  function getQuizQuestions() {
    if (selectedSession?.quiz?.questions) {
      return selectedSession.quiz.questions;
    }
    return scenario?.quiz || [];
  }

  function getExplanation() {
    if (selectedSession?.explanation) {
      return selectedSession.explanation;
    }
    return scenario?.translations?.[language]?.audioText || 
           scenario?.translations?.en?.audioText ||
           "No explanation available";
  }

  function getSteps() {
    if (selectedSession?.simplifiedSteps) {
      return selectedSession.simplifiedSteps;
    }
    if (scenario?.translations?.[language]?.steps) {
      return scenario.translations[language].steps;
    }
    return scenario?.translations?.en?.steps || [];
  }

  const getScoreColor = (score, total) => {
    const percentage = score / total;
    if (percentage >= 0.8) return { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" };
    if (percentage >= 0.5) return { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" };
    return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" };
  };

  const langOptions = [
    { code: "en", label: "English", native: "EN" },
    { code: "hi", label: "हिंदी", native: "HI" },
    { code: "te", label: "తెలుగు", native: "TE" },
  ];

  const steps = getSteps();
  const questions = getQuizQuestions();

  return (
    <div className="flex h-[calc(100vh-80px)]" style={{ backgroundColor: "var(--bg-primary)" }}>
      
      {/* Sessions List Sidebar */}
      <div className="w-80 border-r overflow-y-auto flex-shrink-0" style={{ 
        backgroundColor: "var(--bg-card)", 
        borderColor: "var(--border)" 
      }}>
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-bold text-xl flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Building2 className="w-5 h-5 text-emerald-400" />
            Citizen Portal
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            View instructions and take quizzes
          </p>
        </div>

        {/* Language Selector */}
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <label className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
            <Languages className="w-3 h-3" />
            Select Language
          </label>
          <div className="flex gap-2 mt-2">
            {langOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  language === lang.code 
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" 
                    : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                }`}
              >
                {lang.native}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>
            Available Sessions
          </h3>

          {loading && (
            <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
              <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" />
              Loading...
            </div>
          )}

          {!loading && sessions.length === 0 && (
            <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No sessions available yet.</p>
              <p className="text-xs mt-1">Ask an expert to create one for you.</p>
            </div>
          )}

          {sessions.map((s) => (
            <div
              key={s.id}
              className={`p-4 rounded-xl border cursor-pointer transition-all mb-3 ${
                selectedSession?.id === s.id 
                  ? "bg-emerald-500/10 border-emerald-500/30" 
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              onClick={() => setSelectedSession(s)}
            >
              <p className="font-medium text-sm line-clamp-2" style={{ color: "var(--text-primary)" }}>
                {s.transcribedText ? s.transcribedText.substring(0, 50) + "..." : "Session " + s.id}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {s.scenario || "General"}
                </span>
                <span>•</span>
                <span>{new Date(s.createdAt).toLocaleDateString()}</span>
              </div>
              {s.riskScore !== undefined && s.riskScore !== null && (
                <div className="mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    s.riskScore >= 0.7 ? "bg-red-500/20 text-red-400" :
                    s.riskScore >= 0.5 ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    Risk: {(s.riskScore * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
          <button 
            onClick={loadUserSessions}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
            style={{ color: "var(--text-muted)" }}
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {!selectedSession ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center" style={{ color: "var(--text-muted)" }}>
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Select a session to begin</p>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            
            {/* Audio Player Section */}
            <div className="rounded-2xl border mb-6" style={{ 
              backgroundColor: "var(--bg-card)", 
              borderColor: "var(--border)" 
            }}>
              <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <Volume2 className="w-5 h-5 text-emerald-400" />
                  Listen to Instructions
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={isPlaying ? handleStopSpeaking : () => handleSpeak(getExplanation())}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isPlaying 
                        ? "bg-emerald-500 hover:bg-emerald-600" 
                        : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                  >
                    {isPlaying ? (
                      <VolumeX className="w-7 h-7 text-white" />
                    ) : (
                      <Play className="w-7 h-7 text-white ml-1" />
                    )}
                  </button>
                </div>
                <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  {isPlaying ? "Playing... Tap to stop" : "Tap to listen to the instructions"}
                </p>
                
                {/* Explanation Text */}
                <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: "var(--bg-primary)" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {getExplanation()}
                  </p>
                </div>
              </div>
            </div>

            {/* Steps Section */}
            <div className="rounded-2xl border mb-6" style={{ 
              backgroundColor: "var(--bg-card)", 
              borderColor: "var(--border)" 
            }}>
              <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Steps to Follow
                </h3>
              </div>
              <div className="p-4">
                {steps.length === 0 ? (
                  <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
                    No steps available for this session.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          currentStep === index 
                            ? "border-emerald-500/50 bg-emerald-500/10" 
                            : "border-white/10 hover:border-white/20"
                        }`}
                        onClick={() => setCurrentStep(index)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            currentStep === index 
                              ? "bg-emerald-500 text-white" 
                              : "bg-white/10 text-white/50"
                          }`}>
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                              {step.title}
                            </h4>
                            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quiz Section */}
            {!quizResult ? (
              <div className="rounded-2xl border" style={{ 
                backgroundColor: "var(--bg-card)", 
                borderColor: "var(--border)" 
              }}>
                <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    <Brain className="w-5 h-5 text-emerald-400" />
                    Test Your Understanding
                  </h3>
                </div>
                <div className="p-4">
                  {questions.length === 0 ? (
                    <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
                      No quiz available for this session.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {questions.map((q, qIndex) => {
                        const qId = q.id || `q${qIndex}`;
                        return (
                          <div key={qId} className="p-4 rounded-xl" style={{ backgroundColor: "var(--bg-primary)" }}>
                            <p className="font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                              {qIndex + 1}. {q.question}
                            </p>
                            <div className="space-y-2">
                              {q.options && q.options.map((option, oIndex) => (
                                <button
                                  key={oIndex}
                                  onClick={() => handleAnswer(qId, q.correct === option ? option : option)}
                                  className={`w-full p-3 rounded-lg text-left text-sm transition-all border ${
                                    quizAnswers[qId] === option
                                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                      : "border-white/10 hover:border-white/30"
                                  }`}
                                  style={{ 
                                    color: quizAnswers[qId] === option ? "var(--text-primary)" : "var(--text-secondary)"
                                  }}
                                >
                                  <span className="mr-2">{String.fromCharCode(65 + oIndex)}.</span>
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      <button
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length < questions.length}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-5 h-5" />
                        Submit Answers ({Object.keys(quizAnswers).length}/{questions.length})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Result */
              <div className="rounded-2xl border p-6 text-center" style={{ 
                backgroundColor: "var(--bg-card)", 
                borderColor: "var(--border)" 
              }}>
                <div className="mb-6">
                  {quizResult.score / quizResult.totalQuestions >= 0.8 ? (
                    <Award className="w-20 h-20 mx-auto text-emerald-400" />
                  ) : quizResult.score / quizResult.totalQuestions >= 0.5 ? (
                    <CheckCircle className="w-20 h-20 mx-auto text-yellow-400" />
                  ) : (
                    <AlertTriangle className="w-20 h-20 mx-auto text-red-400" />
                  )}
                </div>

                <h3 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  {quizResult.score} / {quizResult.totalQuestions}
                </h3>

                <p className="text-lg mb-6" style={{ color: "var(--text-muted)" }}>
                  {quizResult.score / quizResult.totalQuestions >= 0.8 
                    ? "🎉 Excellent! You understood the instructions well!" :
                  quizResult.score / quizResult.totalQuestions >= 0.5 
                    ? "👍 Good! But there's room for improvement." :
                    "📚 Please review the instructions again."}
                </p>

                <button
                  onClick={() => {
                    setQuizResult(null);
                    setQuizAnswers({});
                    setCurrentStep(0);
                  }}
                  className="px-6 py-3 rounded-xl font-medium transition-all border border-white/20 hover:bg-white/10"
                  style={{ color: "var(--text-primary)" }}
                >
                  Try Again
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

