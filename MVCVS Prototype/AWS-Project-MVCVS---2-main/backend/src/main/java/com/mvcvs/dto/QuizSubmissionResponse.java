package com.mvcvs.dto;

import com.mvcvs.entity.QuizSubmission;
import java.time.LocalDateTime;
import java.util.Map;

public class QuizSubmissionResponse {
    private Long id;
    private Long sessionId;
    private Map<String, Object> answers;
    private Integer score;
    private Integer totalQuestions;
    private LocalDateTime submittedAt;

    public QuizSubmissionResponse() {}

    public static QuizSubmissionResponse fromEntity(QuizSubmission submission) {
        QuizSubmissionResponse response = new QuizSubmissionResponse();
        response.setId(submission.getId());
        response.setSessionId(submission.getSession().getId());
        response.setAnswers(submission.getAnswers());
        response.setScore(submission.getScore());
        response.setTotalQuestions(submission.getTotalQuestions());
        response.setSubmittedAt(submission.getSubmittedAt());
        return response;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }

    public Map<String, Object> getAnswers() { return answers; }
    public void setAnswers(Map<String, Object> answers) { this.answers = answers; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}

