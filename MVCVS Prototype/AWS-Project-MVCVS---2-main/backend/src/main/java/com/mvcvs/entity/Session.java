package com.mvcvs.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;
import org.hibernate.annotations.Type;
import io.hypersistence.utils.hibernate.type.json.JsonType;

@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String scenario;

    @Column(columnDefinition = "TEXT")
    private String transcribedText;

    @Column(columnDefinition = "TEXT")
    private String audioSummary;

    private Double riskScore;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Map<String, Object> quiz;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Map<String, Object> dag;

    @Type(JsonType.class)
    @Column(columnDefinition = "json")
    private Map<String, Object> simplifiedSteps;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status = SessionStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String language;

    @Column(name = "audio_url")
    private String audioUrl;

    @Column(columnDefinition = "TEXT")
    private String expertFeedback;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum SessionStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED
    }

    public Session() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getExpertFeedback() { return expertFeedback; }
    public void setExpertFeedback(String expertFeedback) { this.expertFeedback = expertFeedback; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

