import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import api from "../api";
import { 
  Mic, MicOff, Play, Pause, Send, Brain, 
  AlertCircle, CheckCircle, Clock, ChevronRight,
  Volume2, RefreshCw, Settings, Building2, User,
  MessageSquare, X, Loader2
} from "lucide-react";

export default function ExpertPortal() {
  const navigate = useNavigate();
  const { 
    user, selectedScenario, scenario, 
    processingState, setProcessingState,
    startRecording, stopRecording,
    speak, stopSpeaking,
    PROCESSING_STATES, resetSession
  } = useSession();

  const [sessions, setSessions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom of transcript
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [liveTranscript]);

  async function loadSessions() {
    try {
      setLoading(true);
      const res = await api.get("/expert/sessions");
      setSessions(res.data || []);
      if (res.data && res.data.length > 0 && !selected) {
        setSelected(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setLoading(false);
    }
  }

  const startVoiceRecording = () => {
    // Check for SpeechRecognition API
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech recognition not supported. Please use Google Chrome.");
      return;
    }

    setIsRecording(true);
    setTranscribedText("");
    setLiveTranscript("");
    setProcessingState(PROCESSING_STATES.RECORDING);

    recognitionRef.current = new SR();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-IN";

    recognitionRef.current.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript + " ";
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setLiveTranscript(final + interim);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech error:", event.error);
      setIsRecording(false);
      setProcessingState(PROCESSING_STATES.IDLE);
    };

    recognitionRef.current.onend = () => {
      setIsRecording(false);
      setProcessingState(PROCESSING_STATES.IDLE);
    };

    recognitionRef.current.start();
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setProcessingState(PROCESSING_STATES.PROCESSING_ASR);
    
    if (liveTranscript.trim()) {
      setTranscribedText(liveTranscript.trim());
    }
  };

  const handleProcessVoice = async () => {
    if (!transcribedText.trim()) {
      alert("Please record or enter some text first.");
      return;
    }

    try {
      setProcessingState(PROCESSING_STATES.PROCESSING_ASR);
      await new Promise(r => setTimeout(r, 1000));
      
      setProcessingState(PROCESSING_STATES.PROCESSING_SEMANTIC);
      await new Promise(r => setTimeout(r, 1000));
      
      setProcessingState(PROCESSING_STATES.PROCESSING_DAG);
      await new Promise(r => setTimeout(r, 1000));

      const res = await api.post("/expert/process", {
        transcribedText: transcribedText,
        scenario: selectedScenario,
        language: "en"
      });

      setProcessingState(PROCESSING_STATES.READY);
      loadSessions();
      setTranscribedText("");
      setLiveTranscript("");
      
      alert("Voice processed successfully! Citizens can now access the instructions.");
    } catch (err) {
      console.error("Failed to process voice:", err);
      setProcessingState(PROCESSING_STATES.READY);
      // Use demo data on error
      loadSessions();
    }
  };

  async function submitFeedback() {
    if (!selected || !feedback.trim()) return;
    try {
      await api.post("/expert/feedback", {
        sessionId: selected.id,
        feedback: feedback
      });
      setFeedback("");
      setShowFeedbackModal(false);
      alert("Feedback submitted successfully!");
      loadSessions();
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      alert("Failed to submit feedback");
    }
  }

  const getProcessingLabel = () => {
    switch (processingState) {
      case PROCESSING_STATES.RECORDING: return "Recording...";
      case PROCESSING_STATES.PROCESSING_ASR: return "Transcribing speech...";
      case PROCESSING_STATES.PROCESSING_SEMANTIC: return "Analyzing content...";
      case PROCESSING_STATES.PROCESSING_DAG: return "Building step DAG...";
      case PROCESSING_STATES.READY: return "Ready";
      default: return "Ready to record";
    }
  };

  const getRiskColor = (score) => {
    if (score >= 0.7) return { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" };
    if (score >= 0.5) return { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" };
    return { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" };
  };

  const getScenarioIcon = (scenarioId) => {
    const icons = { hospital: "🏥", bank: "🏦", government: "🏛️" };
    return icons[scenarioId] || "📋";
  };

  return (
    <div className="flex h-[calc(100vh-80px)]" style={{ backgroundColor: "var(--bg-primary)" }}>
      
      {/* Session List Sidebar */}
      <div className="w-80 border-r overflow-y-auto flex-shrink-0" style={{ 
        backgroundColor: "var(--bg-card)", 
        borderColor: "var(--border)" 
      }}>
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 className="font-bold text-xl flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <Building2 className="w-5 h-5 text-sky-400" />
            Expert Portal
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Process voice instructions for citizens
          </p>
        </div>

        {/* Scenario Badge */}
        <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: "var(--bg-primary)" }}>
            <span className="text-2xl">{scenario?.icon || "📋"}</span>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{scenario?.label || "Select Scenario"}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{scenario?.sublabel || ""}</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="p-4 text-center" style={{ color: "var(--text-muted)" }}>
            <Loader2 className="w-5 h-5 mx-auto animate-spin mb-2" />
            Loading sessions...
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="p-4 text-center" style={{ color: "var(--text-muted)" }}>
            <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No sessions yet.</p>
            <p className="text-xs mt-1">Record your first voice instruction below.</p>
          </div>
        )}

        {sessions.map((s) => (
          <div
            key={s.id}
            className={`p-4 border-b cursor-pointer transition-all ${
              selected?.id === s.id ? "bg-sky-500/10" : "hover:bg-white/5"
            }`}
            style={{ borderColor: "var(--border)" }}
            onClick={() => setSelected(s)}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{getScenarioIcon(s.scenario)}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-2" style={{ color: "var(--text-primary)" }}>
                  {s.transcribedText ? s.transcribedText.substring(0, 60) + "..." : "No transcription"}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {s.scenario || "N/A"}
                  </span>
                  {s.riskScore !== undefined && s.riskScore !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getRiskColor(s.riskScore).bg} ${getRiskColor(s.riskScore).text}`}>
                      Risk: {(s.riskScore * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>
                  {s.createdAt ? new Date(s.createdAt).toLocaleString() : ""}
                </p>
              </div>
            </div>
          </div>
        ))}

        <div className="p-4">
          <button 
            onClick={loadSessions}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
            style={{ color: "var(--text-muted)" }}
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Voice Recording Section */}
        <div className="mb-6 rounded-2xl border" style={{ 
          backgroundColor: "var(--bg-card)", 
          borderColor: "var(--border)" 
        }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Mic className="w-5 h-5 text-sky-400" />
              Record Voice Instruction
            </h3>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {getProcessingLabel()}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Recording Button */}
            <div className="flex flex-col items-center mb-6">
              <button
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isRecording 
                    ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                    : "bg-sky-500 hover:bg-sky-600"
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
              <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
                {isRecording ? "Tap to stop recording" : "Tap to start recording"}
              </p>
            </div>

            {/* Transcript Display */}
            <div 
              ref={transcriptRef}
              className="w-full h-40 p-4 rounded-xl border overflow-y-auto mb-4"
              style={{ 
                backgroundColor: "var(--bg-primary)", 
                borderColor: "var(--border)",
                color: "var(--text-primary)"
              }}
            >
              {liveTranscript ? (
                <p className="text-sm leading-relaxed">{liveTranscript}</p>
              ) : (
                <p className="text-sm" style={{ color: "var(--text-faint)" }}>
                  Your speech will appear here in real-time...
                </p>
              )}
            </div>

            {/* Manual Text Input */}
            <div className="mb-4">
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>
                Or enter text manually
              </label>
              <textarea
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
                placeholder="Type or paste the instruction text here..."
                className="w-full h-24 p-3 rounded-xl border resize-none"
                style={{ 
                  backgroundColor: "var(--bg-primary)", 
                  borderColor: "var(--border)",
                  color: "var(--text-primary)"
                }}
              />
            </div>

            {/* Process Button */}
            <button
              onClick={handleProcessVoice}
              disabled={!transcribedText.trim() || processingState !== PROCESSING_STATES.IDLE && processingState !== PROCESSING_STATES.READY}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all bg-gradient-to-r from-sky-500 to-violet-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processingState === PROCESSING_STATES.PROCESSING_ASR || processingState === PROCESSING_STATES.PROCESSING_SEMANTIC || processingState === PROCESSING_STATES.PROCESSING_DAG ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Process Voice Instruction
                </>
              )}
            </button>
          </div>
        </div>

        {/* Selected Session Details */}
        {selected && (
          <div className="rounded-2xl border" style={{ 
            backgroundColor: "var(--bg-card)", 
            borderColor: "var(--border)" 
          }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}>
              <h3 className="font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Session Details
              </h3>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-all text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <MessageSquare className="w-4 h-4" />
                Add Feedback
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>
                  Transcribed Text
                </label>
                <p className="text-sm p-3 rounded-lg" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
                  {selected.transcribedText || "No transcription available"}
                </p>
              </div>

              {selected.expertFeedback && (
                <div className="mb-4">
                  <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: "var(--text-muted)" }}>
                    Your Feedback
                  </label>
                  <p className="text-sm p-3 rounded-lg" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)" }}>
                    {selected.expertFeedback}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--bg-primary)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Scenario</p>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>{selected.scenario || "N/A"}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--bg-primary)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Risk Score</p>
                  <p className={`font-medium ${selected.riskScore >= 0.7 ? 'text-red-400' : selected.riskScore >= 0.5 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {selected.riskScore ? `${(selected.riskScore * 100).toFixed(0)}%` : "N/A"}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--bg-primary)" }}>
                  <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Created</p>
                  <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                    {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl w-full max-w-md p-6" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Add Feedback</h3>
              <button onClick={() => setShowFeedbackModal(false)} className="p-1 hover:bg-white/10 rounded">
                <X className="w-5 h-5" style={{ color: "var(--text-muted)" }} />
              </button>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback for this session..."
              className="w-full h-32 p-3 rounded-lg mb-4 resize-none"
              style={{ 
                backgroundColor: "var(--bg-primary)", 
                borderColor: "var(--border)",
                color: "var(--text-primary)"
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 py-2 rounded-lg border border-white/10"
                style={{ color: "var(--text-muted)" }}
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className="flex-1 py-2 rounded-lg bg-sky-500 text-white font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

