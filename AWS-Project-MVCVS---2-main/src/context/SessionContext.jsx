import { createContext, useContext, useState } from "react";
import { SCENARIOS } from "../data/scenarios";

const API_URL = "http://127.0.0.1:8080/api";
const SessionContext = createContext(null);

export const PROCESSING_STATES = {
  IDLE: "idle",
  RECORDING: "recording",
  PROCESSING_ASR: "processing_asr",
  PROCESSING_SEMANTIC: "processing_semantic",
  PROCESSING_DAG: "processing_dag",
  READY: "ready",
};

export function SessionProvider({ children }) {
  const [selectedScenario, setSelectedScenario] = useState("hospital");
  const [processingState, setProcessingState] = useState(PROCESSING_STATES.IDLE);
  const [verificationScore, setVerificationScore] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [language, setLanguage] = useState("en");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mvcvs_user") || "null"); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem("mvcvs_token") || null);
  const [currentReport, setCurrentReport] = useState(null);
  const [voiceHistory, setVoiceHistory] = useState([]);
  const [liveTranscript, setLiveTranscript] = useState("");

  const scenario = SCENARIOS[selectedScenario];
  const isAuthenticated = !!token && !!user;

  const safeFetch = async (url, options = {}) => {
    try {
      if (token && !options.headers?.Authorization) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const res = await fetch(url, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Server error ${res.status}`);
      return data;
    } catch (err) {
      if (err.message === "Failed to fetch" || err.name === "TypeError") {
        throw new Error(
          "Cannot connect to backend. Make sure:\n1. Backend is running (Spring Boot on port 8080)\n2. MySQL is running on port 3306\n3. CORS is properly configured"
        );
      }
      throw err;
    }
  };

  const login = async (email, password) => {
    const data = await safeFetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("mvcvs_token", data.token);
    localStorage.setItem("mvcvs_user", JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role) => {
    const data = await safeFetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    localStorage.setItem("mvcvs_token", data.token);
    localStorage.setItem("mvcvs_user", JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("mvcvs_token");
    localStorage.removeItem("mvcvs_user");
    setToken(null);
    setUser(null);
    setCurrentReport(null);
    resetSession();
  };

  const startSpeechRecognition = (onInterim) => {
    return new Promise((resolve, reject) => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        reject(new Error("Speech recognition not supported. Please use Google Chrome."));
        return;
      }
      const r = new SR();
      r.continuous = true;
      r.interimResults = true;
      r.lang = "en-IN";
      let final = "";

      r.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript + " ";
          else interim += e.results[i][0].transcript;
        }
        setLiveTranscript(final + interim);
        if (onInterim) onInterim(final + interim);
      };
      r.onerror = (e) => reject(new Error("Microphone error: " + e.error));
      r.onend = () => resolve(final.trim());
      r.start();
      window._mvcvsRecognition = r;
    });
  };

  const stopSpeechRecognition = () => {
    if (window._mvcvsRecognition) {
      window._mvcvsRecognition.stop();
      window._mvcvsRecognition = null;
    }
  };

  const speak = (text, lang = "en-IN") => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.85;
    const voices = window.speechSynthesis.getVoices();
    const v = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  const startRecording = () => {
    setLiveTranscript("");
    setProcessingState(PROCESSING_STATES.RECORDING);
  };

  const stopRecording = async (transcribedText) => {
    stopSpeechRecognition();
    const text = transcribedText || liveTranscript || scenario.translations.en.audioText;
    setProcessingState(PROCESSING_STATES.PROCESSING_ASR);
    await new Promise((r) => setTimeout(r, 1200));
    setProcessingState(PROCESSING_STATES.PROCESSING_SEMANTIC);
    await new Promise((r) => setTimeout(r, 1200));
    setProcessingState(PROCESSING_STATES.PROCESSING_DAG);

    try {
      const data = await safeFetch(`${API_URL}/expert/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transcribedText: text,
          scenario: selectedScenario,
          language,
        }),
      });
      setCurrentReport(data);
      setVoiceHistory((prev) => [
        {
          id: data.id,
          scenario: selectedScenario,
          transcribedText: text,
          timestamp: new Date().toISOString(),
          audioSummary: data.audioSummary,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("AI processing failed, using static data:", err.message);
    } finally {
      setProcessingState(PROCESSING_STATES.READY);
    }
  };

  const resetSession = () => {
    setProcessingState(PROCESSING_STATES.IDLE);
    setVerificationScore(null);
    setRiskLevel(null);
    setQuizAnswers({});
    setCurrentReport(null);
    setLiveTranscript("");
    stopSpeaking();
  };

  const submitQuiz = async (answers) => {
    setQuizAnswers(answers);
    const questions = currentReport?.quiz || scenario.quiz;
    const correct = questions.filter((q) => answers[q.id] === q.correct).length;
    const score = Math.round((correct / questions.length) * 100);
    setVerificationScore(score);
    setRiskLevel(score >= 80 ? "LOW" : score >= 50 ? "MEDIUM" : "HIGH");

    if (currentReport?.id && token) {
      try {
        await safeFetch(`${API_URL}/reports/${currentReport.id}/submit`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ answers }),
        });
      } catch (err) {
        console.error("Could not save quiz result:", err.message);
      }
    }
  };

  return (
    <SessionContext.Provider
      value={{
        selectedScenario, setSelectedScenario,
        scenario: {
          ...scenario,
          dag: currentReport?.dag || scenario.dag,
          quiz: currentReport?.quiz || scenario.quiz,
          translations: currentReport?.simplifiedSteps
            ? {
                ...scenario.translations,
                en: { ...scenario.translations.en, steps: currentReport.simplifiedSteps },
              }
            : scenario.translations,
        },
        processingState, setProcessingState, startRecording, stopRecording, resetSession,
        verificationScore, riskLevel, quizAnswers, submitQuiz,
        language, setLanguage,
        user, login, register, logout, token, isAuthenticated,
        currentReport, voiceHistory, liveTranscript, setLiveTranscript,
        speak, stopSpeaking, startSpeechRecognition, stopSpeechRecognition,
        PROCESSING_STATES,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be within SessionProvider");
  return ctx;
};
