package com.mvcvs.controller;

import com.mvcvs.dto.ProcessRequest;
import com.mvcvs.dto.SessionResponse;
import com.mvcvs.entity.Session;
import com.mvcvs.repository.SessionRepository;
import com.mvcvs.service.SessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expert")
public class ExpertController {

    private final SessionService sessionService;
    private final SessionRepository sessionRepository;

    public ExpertController(SessionService sessionService, SessionRepository sessionRepository) {
        this.sessionService = sessionService;
        this.sessionRepository = sessionRepository;
    }

    @PostMapping("/process")
    public ResponseEntity<SessionResponse> processVoice(@RequestBody ProcessRequest request,
                                                         @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        String email = userDetails.getUsername();
        SessionResponse response = sessionService.processVoice(request, email);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<SessionResponse>> getAllSessions() {
        List<SessionResponse> sessions = sessionService.getAllSessions();
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/feedback")
    public ResponseEntity<Map<String, String>> submitFeedback(@RequestBody Map<String, Object> request,
                                                               @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long sessionId = Long.valueOf(request.get("sessionId").toString());
        String feedback = (String) request.get("feedback");

        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setExpertFeedback(feedback);
        sessionRepository.save(session);

        return ResponseEntity.ok(Map.of("message", "Feedback submitted successfully"));
    }
}

