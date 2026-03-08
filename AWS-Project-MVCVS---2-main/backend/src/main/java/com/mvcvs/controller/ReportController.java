package com.mvcvs.controller;

import com.mvcvs.dto.QuizSubmissionResponse;
import com.mvcvs.dto.SessionResponse;
import com.mvcvs.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final SessionService sessionService;

    public ReportController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping
    public ResponseEntity<List<SessionResponse>> getUserReports(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        List<SessionResponse> sessions = sessionService.getUserSessions(email);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionResponse> getReport(@PathVariable Long id) {
        SessionResponse session = sessionService.getSession(id);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<QuizSubmissionResponse> submitQuiz(@PathVariable Long id, 
                                                              @RequestBody Map<String, Object> answers) {
        QuizSubmissionResponse response = sessionService.submitQuiz(id, answers);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/quiz")
    public ResponseEntity<QuizSubmissionResponse> getQuizResult(@PathVariable Long id) {
        QuizSubmissionResponse response = sessionService.getQuizSubmission(id);
        return ResponseEntity.ok(response);
    }
}

