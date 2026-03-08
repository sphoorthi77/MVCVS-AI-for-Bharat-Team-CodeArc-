package com.mvcvs.dto;

import com.mvcvs.entity.Session;
import java.time.LocalDateTime;
import java.util.Map;

public class SessionResponse {
    private Long id;
    private String scenario;
    private String transcribedText;
    private String audioSummary;
    private Double riskScore;
    private String explanation;
    private Map<String, Object> quiz;
    private Map<String, Object> dag;
    private Map<String, Object> simplifiedSteps;
    private Session.SessionStatus status;
    private String language;
    private String audioUrl;
    private String expertFeedback;
    private LocalDateTime createdAt;

    public SessionResponse() {}

    public static SessionResponse fromEntity(Session session) {
        SessionResponse response = new SessionResponse();
        response.setId(session.getId());
        response.setScenario(session.getScenario());
        response.setTranscribedText(session.getTranscribedText());
        response.setAudioSummary(session.getAudioSummary());
        response.setRiskScore(session.getRiskScore());
        response.setExplanation(session.getExplanation());
        response.setQuiz(session.getQuiz());
        response.setDag(session.getDag());
        response.setSimplifiedSteps(session.getSimplifiedSteps());
        response.setStatus(session.getStatus());
        response.setLanguage(session.getLanguage());
        response.setAudioUrl(session.getAudioUrl());
        response.setExpertFeedback(session.getExpertFeedback());
        response.setCreatedAt(session.getCreatedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getScenario() { return scenario; }
    public void setScenario(String scenario) { this.scenario = scenario; }

    public String getTranscribedText() { return transcribedText; }
    public void setTranscribedText(String transcribedText) { this.transcribedText = transcribedText; }

    public String getAudioSummary() { return audioSummary; }
    public void setAudioSummary(String audioSummary) { this.audioSummary = audioSummary; }

    public Double getRiskScore() { return riskScore; }
    public void setRiskScore(Double riskScore) { this.riskScore = riskScore; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public Map<String, Object> getQuiz() { return quiz; }
    public void setQuiz(Map<String, Object> quiz) { this.quiz = quiz; }

    public Map<String, Object> getDag() { return dag; }
    public void setDag(Map<String, Object> dag) { this.dag = dag; }

    public Map<String, Object> getSimplifiedSteps() { return simplifiedSteps; }
    public void setSimplifiedSteps(Map<String, Object> simplifiedSteps) { this.simplifiedSteps = simplifiedSteps; }

    public Session.SessionStatus getStatus() { return status; }
    public void setStatus(Session.SessionStatus status) { this.status = status; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getExpertFeedback() { return expertFeedback; }
    public void setExpertFeedback(String expertFeedback) { this.expertFeedback = expertFeedback; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

