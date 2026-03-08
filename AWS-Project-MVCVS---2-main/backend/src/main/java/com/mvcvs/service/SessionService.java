package com.mvcvs.service;

import com.mvcvs.dto.ProcessRequest;
import com.mvcvs.dto.QuizSubmissionResponse;
import com.mvcvs.dto.SessionResponse;
import com.mvcvs.entity.QuizSubmission;
import com.mvcvs.entity.Session;
import com.mvcvs.entity.User;
import com.mvcvs.repository.QuizSubmissionRepository;
import com.mvcvs.repository.SessionRepository;
import com.mvcvs.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final QuizSubmissionRepository quizSubmissionRepository;
    private final UserRepository userRepository;
    private final AIService aiService;

    public SessionService(SessionRepository sessionRepository, QuizSubmissionRepository quizSubmissionRepository,
                         UserRepository userRepository, AIService aiService) {
        this.sessionRepository = sessionRepository;
        this.quizSubmissionRepository = quizSubmissionRepository;
        this.userRepository = userRepository;
        this.aiService = aiService;
    }

    public SessionResponse processSession(ProcessRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Session session = new Session();
        session.setUser(user);
        session.setScenario(request.getScenario());
        session.setTranscribedText(request.getTranscribedText());
        session.setLanguage(request.getLanguage());
        session.setAudioUrl(request.getAudioUrl());
        session.setStatus(Session.SessionStatus.PROCESSING);

        session = sessionRepository.save(session);

        // Generate DAG and Quiz using AI service
        Map<String, Object> aiResult = aiService.generateQuizAndDag(
            request.getScenario(),
            request.getTranscribedText(),
            request.getLanguage()
        );

        Map<String, Object> dag = (Map<String, Object>) aiResult.get("dag");
        Map<String, Object> quiz = (Map<String, Object>) aiResult.get("quiz");
        Map<String, Object> simplifiedSteps = (Map<String, Object>) aiResult.get("simplifiedSteps");

        session.setDag(dag);
        session.setQuiz(quiz);
        session.setSimplifiedSteps(simplifiedSteps);
        
        // Calculate risk score based on scenario
        double riskScore = calculateRiskScore(request.getScenario());
        session.setRiskScore(riskScore);
        
        // Generate explanation
        String explanation = generateExplanation(request.getScenario(), request.getLanguage());
        session.setExplanation(explanation);
        
        // Generate audio summary
        String audioSummary = generateAudioSummary(request.getScenario(), request.getLanguage());
        session.setAudioSummary(audioSummary);

        session.setStatus(Session.SessionStatus.COMPLETED);
        session = sessionRepository.save(session);

        return SessionResponse.fromEntity(session);
    }

    private double calculateRiskScore(String scenario) {
        if ("hospital".equalsIgnoreCase(scenario)) {
            return 0.7;
        } else if ("bank".equalsIgnoreCase(scenario)) {
            return 0.5;
        } else if ("government".equalsIgnoreCase(scenario)) {
            return 0.6;
        }
        return 0.5;
    }

    private String generateExplanation(String scenario, String language) {
        if ("hospital".equalsIgnoreCase(scenario)) {
            return "You have been diagnosed with BPPV. The Epley maneuver has been performed to reposition the crystals in your inner ear.";
        } else if ("bank".equalsIgnoreCase(scenario)) {
            return "Your student loan has been disbursed. The moratorium period allows you to pause payments during your course.";
        } else if ("government".equalsIgnoreCase(scenario)) {
            return "Linking PAN with Aadhaar is mandatory. If not done, your PAN will become inoperative.";
        }
        return "Session processed successfully.";
    }

    private String generateAudioSummary(String scenario, String language) {
        if ("hospital".equalsIgnoreCase(scenario)) {
            return "You have a condition called BPPV - tiny crystals in your ear are in the wrong place. The doctor has done a procedure to move them back.";
        } else if ("bank".equalsIgnoreCase(scenario)) {
            return "Your student loan has been approved. You won't pay anything while studying, but interest is adding up.";
        } else if ("government".equalsIgnoreCase(scenario)) {
            return "The Government of India has made it mandatory to link your PAN card with your Aadhaar card.";
        }
        return "Your session has been processed.";
    }

    public List<SessionResponse> getUserSessions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Session> sessions = sessionRepository.findByUserId(user.getId());
        return sessions.stream()
            .map(SessionResponse::fromEntity)
            .collect(Collectors.toList());
    }

    public SessionResponse getSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));
        return SessionResponse.fromEntity(session);
    }

    public QuizSubmissionResponse submitQuiz(Long sessionId, Map<String, Object> answers) {
        Session session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Session not found"));

        // Calculate score
        Map<String, Object> quiz = session.getQuiz();
        int score = 0;
        int totalQuestions = 0;
        
        if (quiz != null && quiz.containsKey("questions")) {
            Object questionsObj = quiz.get("questions");
            if (questionsObj instanceof List) {
                List<Map<String, Object>> questions = (List<Map<String, Object>>) questionsObj;
                totalQuestions = questions.size();
                
                for (Map<String, Object> question : questions) {
                    String qId = (String) question.get("id");
                    Object userAnswer = answers.get(qId);
                    Object correctAnswer = question.get("correct");
                    
                    if (userAnswer != null && correctAnswer != null) {
                        if (userAnswer.equals(correctAnswer)) {
                            score++;
                        }
                    }
                }
            }
        }

        QuizSubmission submission = new QuizSubmission();
        submission.setSession(session);
        submission.setAnswers(answers);
        submission.setScore(score);
        submission.setTotalQuestions(totalQuestions);

        submission = quizSubmissionRepository.save(submission);

        return QuizSubmissionResponse.fromEntity(submission);
    }

    public QuizSubmissionResponse getQuizSubmission(Long sessionId) {
        List<QuizSubmission> submissions = quizSubmissionRepository.findBySessionId(sessionId);
        if (submissions.isEmpty()) {
            return null;
        }
        return QuizSubmissionResponse.fromEntity(submissions.get(0));
    }

    // Additional methods needed by controllers
    public SessionResponse processVoice(ProcessRequest request, String userEmail) {
        return processSession(request, userEmail);
    }

    public List<SessionResponse> getAllSessions() {
        List<Session> sessions = sessionRepository.findAll();
        return sessions.stream()
            .map(SessionResponse::fromEntity)
            .collect(Collectors.toList());
    }

    public List<SessionResponse> getUserSessions() {
        // This will be called with authentication context
        List<Session> sessions = sessionRepository.findAll();
        return sessions.stream()
            .map(SessionResponse::fromEntity)
            .collect(Collectors.toList());
    }
}

