package com.mvcvs.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AIService {

    @Value("${anthropic.api.key:}")
    private String anthropicApiKey;

    @Value("${groq.api.key:}")
    private String groqApiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(30))
        .build();

    public Map<String, Object> generateQuizAndDag(String scenario, String transcribedText, String language) {
        // If Groq API key is available, use AI
        if (groqApiKey != null && !groqApiKey.isEmpty()) {
            try {
                return generateWithGroq(scenario, transcribedText, language);
            } catch (Exception e) {
                System.err.println("Groq API failed, falling back to predefined: " + e.getMessage());
            }
        }
        // Fallback to predefined scenarios
        return getPredefinedScenario(scenario);
    }

    private Map<String, Object> generateWithGroq(String scenario, String transcribedText, String language) throws Exception {
        String prompt = buildPrompt(scenario, transcribedText, language);
        
        String requestBody = """
            {
                "model": "llama-3.1-70b-versatile",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert at creating educational content. Generate a quiz and step-by-step instructions from expert instructions. Always respond with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": "%s"
                    }
                ],
                "temperature": 0.3,
                "max_tokens": 2000
            }
            """.formatted(prompt);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.groq.com/openai/v1/chat/completions"))
            .header("Authorization", "Bearer " + groqApiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() != 200) {
            throw new Exception("Groq API error: " + response.statusCode() + " - " + response.body());
        }

        return parseGroqResponse(response.body(), scenario);
    }

    private String buildPrompt(String scenario, String transcribedText, String language) {
        return String.format("""
            Analyze the following expert instruction and create:
            1. A simplified step-by-step guide (4-5 steps)
            2. A comprehension quiz (3 multiple choice questions)
            
            Context: This is a %s scenario.
            Original instruction: %s
            Language for output: %s
            
            Output ONLY valid JSON in this exact format:
            {
                "simplifiedSteps": [
                    {"step": 1, "title": "Step title", "desc": "Step description"}
                ],
                "quiz": {
                    "questions": [
                        {
                            "id": "q1",
                            "question": "Question text",
                            "options": ["Option A", "Option B", "Option C", "Option D"],
                            "correct": "Correct answer",
                            "explanation": "Why this is correct"
                        }
                    ]
                }
            }
            """, scenario, transcribedText, language);
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseGroqResponse(String responseBody, String scenario) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Extract JSON from response
            Pattern jsonPattern = Pattern.compile("\\{[\\s\\S]*\\}");
            Matcher matcher = jsonPattern.matcher(responseBody);
            
            if (matcher.find()) {
                String jsonStr = matcher.group();
                // Clean the JSON
                jsonStr = jsonStr.replace("```json", "").replace("```", "");
                
                // Simple parsing - extract key parts
                Map<String, Object> parsed = new com.fasterxml.jackson.databind.ObjectMapper()
                    .readValue(jsonStr, Map.class);
                
                result.put("simplifiedSteps", parsed.get("simplifiedSteps"));
                result.put("quiz", parsed.get("quiz"));
            }
        } catch (Exception e) {
            System.err.println("Failed to parse AI response: " + e.getMessage());
        }
        
        // If parsing failed, use predefined
        if (result.isEmpty() || result.get("simplifiedSteps") == null) {
            return getPredefinedScenario(scenario);
        }
        
        // Add DAG
        result.put("dag", getPredefinedScenario(scenario).get("dag"));
        
        return result;
    }

    public Map<String, Object> getPredefinedScenario(String scenario) {
        Map<String, Object> result = new HashMap<>();
        
        if ("hospital".equalsIgnoreCase(scenario)) {
            result.put("dag", getHospitalDag());
            result.put("quiz", getHospitalQuiz());
            result.put("simplifiedSteps", getHospitalSteps());
        } else if ("bank".equalsIgnoreCase(scenario)) {
            result.put("dag", getBankDag());
            result.put("quiz", getBankQuiz());
            result.put("simplifiedSteps", getBankSteps());
        } else if ("government".equalsIgnoreCase(scenario)) {
            result.put("dag", getGovernmentDag());
            result.put("quiz", getGovernmentQuiz());
            result.put("simplifiedSteps", getGovernmentSteps());
        } else {
            result.put("dag", getHospitalDag());
            result.put("quiz", getHospitalQuiz());
            result.put("simplifiedSteps", getHospitalSteps());
        }
        
        return result;
    }

    // Hospital DAG
    private Map<String, Object> getHospitalDag() {
        Map<String, Object> dag = new HashMap<>();
        
        List<Map<String, Object>> nodes = new ArrayList<>();
        
        Map<String, Object> node1 = new HashMap<>();
        node1.put("id", "1");
        node1.put("type", "input");
        Map<String, Object> data1 = new HashMap<>();
        data1.put("label", "Diagnosis: BPPV\n(Benign Positional Vertigo)");
        node1.put("data", data1);
        Map<String, Object> pos1 = new HashMap<>();
        pos1.put("x", 300);
        pos1.put("y", 0);
        node1.put("position", pos1);
        nodes.add(node1);

        Map<String, Object> node2 = new HashMap<>();
        node2.put("id", "2");
        Map<String, Object> data2 = new HashMap<>();
        data2.put("label", "Step 1: Epley Maneuver\n(Performed by Doctor)");
        node2.put("data", data2);
        Map<String, Object> pos2 = new HashMap<>();
        pos2.put("x", 300);
        pos2.put("y", 100);
        node2.put("position", pos2);
        nodes.add(node2);

        Map<String, Object> node3 = new HashMap<>();
        node3.put("id", "3");
        Map<String, Object> data3 = new HashMap<>();
        data3.put("label", "Step 2: Rest 48hrs\n⚠️ NO lying on LEFT side");
        node3.put("data", data3);
        Map<String, Object> pos3 = new HashMap<>();
        pos3.put("x", 100);
        pos3.put("y", 220);
        node3.put("position", pos3);
        nodes.add(node3);

        Map<String, Object> node4 = new HashMap<>();
        node4.put("id", "4");
        Map<String, Object> data4 = new HashMap<>();
        data4.put("label", "Step 3: Head Elevated\nSleep at 45° angle");
        node4.put("data", data4);
        Map<String, Object> pos4 = new HashMap<>();
        pos4.put("x", 500);
        pos4.put("y", 220);
        node4.put("position", pos4);
        nodes.add(node4);

        Map<String, Object> node5 = new HashMap<>();
        node5.put("id", "5");
        Map<String, Object> data5 = new HashMap<>();
        data5.put("label", "Step 4: Follow-up\nDay 7 – Mandatory");
        node5.put("data", data5);
        Map<String, Object> pos5 = new HashMap<>();
        pos5.put("x", 300);
        pos5.put("y", 340);
        node5.put("position", pos5);
        nodes.add(node5);

        dag.put("nodes", nodes);
        
        List<Map<String, Object>> edges = new ArrayList<>();
        
        Map<String, Object> e1 = new HashMap<>();
        e1.put("id", "e1-2");
        e1.put("source", "1");
        e1.put("target", "2");
        e1.put("animated", true);
        edges.add(e1);

        Map<String, Object> e2 = new HashMap<>();
        e2.put("id", "e2-3");
        e2.put("source", "2");
        e2.put("target", "3");
        edges.add(e2);

        Map<String, Object> e3 = new HashMap<>();
        e3.put("id", "e2-4");
        e3.put("source", "2");
        e3.put("target", "4");
        edges.add(e3);

        Map<String, Object> e4 = new HashMap<>();
        e4.put("id", "e3-5");
        e4.put("source", "3");
        e4.put("target", "5");
        edges.add(e4);

        Map<String, Object> e5 = new HashMap<>();
        e5.put("id", "e4-5");
        e5.put("source", "4");
        e5.put("target", "5");
        edges.add(e5);

        dag.put("edges", edges);
        
        return dag;
    }

    private Map<String, Object> getHospitalQuiz() {
        Map<String, Object> quiz = new HashMap<>();
        
        List<Map<String, Object>> questions = new ArrayList<>();
        
        Map<String, Object> q1 = new HashMap<>();
        q1.put("id", "q1");
        q1.put("question", "After the doctor's procedure, which side should you AVOID sleeping on?");
        q1.put("options", Arrays.asList("Right side", "Left side", "Back", "No restriction"));
        q1.put("correct", "Left side");
        q1.put("explanation", "You must NOT sleep on your LEFT side for 48 hours. The crystals in your ear need to settle in the correct position.");
        
        Map<String, Object> q2 = new HashMap<>();
        q2.put("id", "q2");
        q2.put("question", "When is your mandatory follow-up appointment?");
        q2.put("options", Arrays.asList("Tomorrow", "In 3 days", "In 7 days", "In 1 month"));
        q2.put("correct", "In 7 days");
        q2.put("explanation", "The 7-day follow-up is MANDATORY. Missing it could mean missing signs that your condition hasn't healed properly.");
        
        Map<String, Object> q3 = new HashMap<>();
        q3.put("id", "q3");
        q3.put("question", "If your dizziness gets much worse at home, what should you do?");
        q3.put("options", Arrays.asList("Wait and see for 2-3 days", "Call a friend", "Go to the ER immediately", "Take a painkiller"));
        q3.put("correct", "Go to the ER immediately");
        q3.put("explanation", "Sudden worsening of dizziness is an emergency sign that requires immediate ER attention.");
        
        questions.add(q1);
        questions.add(q2);
        questions.add(q3);
        
        quiz.put("questions", questions);
        return quiz;
    }

    private List<Map<String, Object>> getHospitalSteps() {
        List<Map<String, Object>> steps = new ArrayList<>();
        
        Map<String, Object> step1 = new HashMap<>();
        step1.put("step", 1);
        step1.put("title", "Rest for 48 Hours");
        step1.put("desc", "Do NOT lie on your LEFT side. Sleep sitting up at an angle.");
        steps.add(step1);
        
        Map<String, Object> step2 = new HashMap<>();
        step2.put("step", 2);
        step2.put("title", "Sleep Position");
        step2.put("desc", "Use extra pillows to keep your head raised at 45 degrees for the next week.");
        steps.add(step2);
        
        Map<String, Object> step3 = new HashMap<>();
        step3.put("step", 3);
        step3.put("title", "7-Day Check-up");
        step3.put("desc", "Return to hospital on [DATE]. This is MANDATORY, do not skip.");
        steps.add(step3);
        
        Map<String, Object> step4 = new HashMap<>();
        step4.put("step", 4);
        step4.put("title", "Emergency Signs");
        step4.put("desc", "If dizziness gets worse OR you cannot walk straight → Go to ER IMMEDIATELY.");
        steps.add(step4);
        
        return steps;
    }

    // Bank DAG
    private Map<String, Object> getBankDag() {
        Map<String, Object> dag = new HashMap<>();
        
        List<Map<String, Object>> nodes = new ArrayList<>();
        
        Map<String, Object> node1 = new HashMap<>();
        node1.put("id", "1");
        node1.put("type", "input");
        Map<String, Object> data1 = new HashMap<>();
        data1.put("label", "Loan Disbursed\n₹5,00,000");
        node1.put("data", data1);
        Map<String, Object> pos1 = new HashMap<>();
        pos1.put("x", 300);
        pos1.put("y", 0);
        node1.put("position", pos1);
        nodes.add(node1);

        Map<String, Object> node2 = new HashMap<>();
        node2.put("id", "2");
        Map<String, Object> data2 = new HashMap<>();
        data2.put("label", "Moratorium Period\nCourse + 6 months");
        node2.put("data", data2);
        Map<String, Object> pos2 = new HashMap<>();
        pos2.put("x", 300);
        pos2.put("y", 100);
        node2.put("position", pos2);
        nodes.add(node2);

        Map<String, Object> node3 = new HashMap<>();
        node3.put("id", "3");
        Map<String, Object> data3 = new HashMap<>();
        data3.put("label", "⚠️ Interest Accrues\nDuring Moratorium");
        node3.put("data", data3);
        Map<String, Object> pos3 = new HashMap<>();
        pos3.put("x", 100);
        pos3.put("y", 220);
        node3.put("position", pos3);
        nodes.add(node3);

        Map<String, Object> node4 = new HashMap<>();
        node4.put("id", "4");
        Map<String, Object> data4 = new HashMap<>();
        data4.put("label", "EMI Starts After\nMoratorium Ends");
        node4.put("data", data4);
        Map<String, Object> pos4 = new HashMap<>();
        pos4.put("x", 500);
        pos4.put("y", 220);
        node4.put("position", pos4);
        nodes.add(node4);

        dag.put("nodes", nodes);
        
        List<Map<String, Object>> edges = new ArrayList<>();
        
        Map<String, Object> e1 = new HashMap<>();
        e1.put("id", "e1-2");
        e1.put("source", "1");
        e1.put("target", "2");
        e1.put("animated", true);
        edges.add(e1);

        Map<String, Object> e2 = new HashMap<>();
        e2.put("id", "e2-3");
        e2.put("source", "2");
        e2.put("target", "3");
        edges.add(e2);

        Map<String, Object> e3 = new HashMap<>();
        e3.put("id", "e2-4");
        e3.put("source", "2");
        e3.put("target", "4");
        edges.add(e3);

        dag.put("edges", edges);
        
        return dag;
    }

    private Map<String, Object> getBankQuiz() {
        Map<String, Object> quiz = new HashMap<>();
        
        List<Map<String, Object>> questions = new ArrayList<>();
        
        Map<String, Object> q1 = new HashMap<>();
        q1.put("id", "q1");
        q1.put("question", "During the moratorium period, what happens to your loan?");
        q1.put("options", Arrays.asList("Nothing, it stays the same", "Interest is added every month", "The bank pays it off", "You pay half the EMI"));
        q1.put("correct", "Interest is added every month");
        q1.put("explanation", "Even during the moratorium (when you don't pay EMIs), interest is still being charged and added to your principal amount.");
        
        Map<String, Object> q2 = new HashMap<>();
        q2.put("id", "q2");
        q2.put("question", "What document MUST you submit to the bank after completing your course?");
        q2.put("options", Arrays.asList("Aadhaar Card", "Mark Sheet", "Course Completion Certificate", "Admission Letter"));
        q2.put("correct", "Course Completion Certificate");
        q2.put("explanation", "The Course Completion Certificate formally notifies the bank your moratorium period should end and EMIs should begin.");
        
        Map<String, Object> q3 = new HashMap<>();
        q3.put("id", "q3");
        q3.put("question", "How long after your course ends do you have before the first EMI is due?");
        q3.put("options", Arrays.asList("1 month", "3 months", "6 months", "1 year"));
        q3.put("correct", "6 months");
        q3.put("explanation", "There is a 6-month grace period after course completion before EMIs begin, giving you time to find employment.");
        
        questions.add(q1);
        questions.add(q2);
        questions.add(q3);
        
        quiz.put("questions", questions);
        return quiz;
    }

    private List<Map<String, Object>> getBankSteps() {
        List<Map<String, Object>> steps = new ArrayList<>();
        
        Map<String, Object> step1 = new HashMap<>();
        step1.put("step", 1);
        step1.put("title", "Moratorium = Payment Pause");
        step1.put("desc", "You don't pay EMIs during your course. BUT interest is still being added to your loan every month.");
        steps.add(step1);
        
        Map<String, Object> step2 = new HashMap<>();
        step2.put("step", 2);
        step2.put("title", "After Course: 6 More Months Grace");
        step2.put("desc", "After your degree, you have 6 months before the first EMI is due. Use this to find a job.");
        steps.add(step2);
        
        Map<String, Object> step3 = new HashMap<>();
        step3.put("step", 3);
        step3.put("title", "Submit Your Certificate");
        step3.put("desc", "You MUST submit your course completion certificate to the bank to officially end the moratorium.");
        steps.add(step3);
        
        Map<String, Object> step4 = new HashMap<>();
        step4.put("step", 4);
        step4.put("title", "Missed EMI Penalty");
        step4.put("desc", "If you miss an EMI after the moratorium, a 2% penalty is charged. Set reminders on your phone!");
        steps.add(step4);
        
        return steps;
    }

    // Government DAG
    private Map<String, Object> getGovernmentDag() {
        Map<String, Object> dag = new HashMap<>();
        
        List<Map<String, Object>> nodes = new ArrayList<>();
        
        Map<String, Object> node1 = new HashMap<>();
        node1.put("id", "1");
        node1.put("type", "input");
        Map<String, Object> data1 = new HashMap<>();
        data1.put("label", "Mandate: Link PAN\nwith Aadhaar");
        node1.put("data", data1);
        Map<String, Object> pos1 = new HashMap<>();
        pos1.put("x", 300);
        pos1.put("y", 0);
        node1.put("position", pos1);
        nodes.add(node1);

        Map<String, Object> node2 = new HashMap<>();
        node2.put("id", "2");
        Map<String, Object> data2 = new HashMap<>();
        data2.put("label", "Check: Already Linked?");
        node2.put("data", data2);
        Map<String, Object> pos2 = new HashMap<>();
        pos2.put("x", 300);
        pos2.put("y", 100);
        node2.put("position", pos2);
        nodes.add(node2);

        Map<String, Object> node3 = new HashMap<>();
        node3.put("id", "3");
        Map<String, Object> data3 = new HashMap<>();
        data3.put("label", "✅ No Action Needed\nYou're Compliant");
        node3.put("data", data3);
        Map<String, Object> pos3 = new HashMap<>();
        pos3.put("x", 100);
        pos3.put("y", 220);
        node3.put("position", pos3);
        nodes.add(node3);

        Map<String, Object> node4 = new HashMap<>();
        node4.put("id", "4");
        Map<String, Object> data4 = new HashMap<>();
        data4.put("label", "Link via incometax.gov.in\nOR SMS: UIDPAN to 567678");
        node4.put("data", data4);
        Map<String, Object> pos4 = new HashMap<>();
        pos4.put("x", 500);
        pos4.put("y", 220);
        node4.put("position", pos4);
        nodes.add(node4);

        dag.put("nodes", nodes);
        
        List<Map<String, Object>> edges = new ArrayList<>();
        
        Map<String, Object> e1 = new HashMap<>();
        e1.put("id", "e1-2");
        e1.put("source", "1");
        e1.put("target", "2");
        e1.put("animated", true);
        edges.add(e1);

        Map<String, Object> e2 = new HashMap<>();
        e2.put("id", "e2-3");
        e2.put("source", "2");
        e2.put("target", "3");
        edges.add(e2);

        Map<String, Object> e3 = new HashMap<>();
        e3.put("id", "e2-4");
        e3.put("source", "2");
        e3.put("target", "4");
        edges.add(e3);

        dag.put("edges", edges);
        
        return dag;
    }

    private Map<String, Object> getGovernmentQuiz() {
        Map<String, Object> quiz = new HashMap<>();
        
        List<Map<String, Object>> questions = new ArrayList<>();
        
        Map<String, Object> q1 = new HashMap<>();
        q1.put("id", "q1");
        q1.put("question", "What happens to your PAN card if you don't link it with Aadhaar?");
        q1.put("options", Arrays.asList("It expires and you get a new one", "It becomes INOPERATIVE", "A small fine is charged", "Nothing, it still works"));
        q1.put("correct", "It becomes INOPERATIVE");
        q1.put("explanation", "An inoperative PAN means you cannot open bank accounts, file income tax, or conduct financial transactions above ₹50,000.");
        
        Map<String, Object> q2 = new HashMap<>();
        q2.put("id", "q2");
        q2.put("question", "What is the penalty fee you must pay to link PAN-Aadhaar now?");
        q2.put("options", Arrays.asList("Free of charge", "₹500", "₹1,000", "₹5,000"));
        q2.put("correct", "₹1,000");
        q2.put("explanation", "A late fee of ₹1,000 is charged for linking PAN-Aadhaar after the original deadline passed.");
        
        Map<String, Object> q3 = new HashMap<>();
        q3.put("id", "q3");
        q3.put("question", "Which SMS can you send to link PAN with Aadhaar?");
        q3.put("options", Arrays.asList("PANLINK to 123456", "UIDPAN to 567678", "LINKPAN to 999000", "AADHAARPAN to 100"));
        q3.put("correct", "UIDPAN to 567678");
        q3.put("explanation", "Send UIDPAN followed by your 12-digit Aadhaar and 10-digit PAN to 567678 from your registered mobile number.");
        
        questions.add(q1);
        questions.add(q2);
        questions.add(q3);
        
        quiz.put("questions", questions);
        return quiz;
    }

    private List<Map<String, Object>> getGovernmentSteps() {
        List<Map<String, Object>> steps = new ArrayList<>();
        
        Map<String, Object> step1 = new HashMap<>();
        step1.put("step", 1);
        step1.put("title", "Check If Already Linked");
        step1.put("desc", "Visit incometax.gov.in → 'Link Aadhaar Status'. Enter PAN & Aadhaar numbers to check.");
        steps.add(step1);
        
        Map<String, Object> step2 = new HashMap<>();
        step2.put("step", 2);
        step2.put("title", "Link Online (If Not Done)");
        step2.put("desc", "Go to incometax.gov.in → 'Link Aadhaar'. Fill PAN, Aadhaar, and mobile number. Pay ₹1000 fee.");
        steps.add(step2);
        
        Map<String, Object> step3 = new HashMap<>();
        step3.put("step", 3);
        step3.put("title", "OR Link via SMS");
        step3.put("desc", "Send SMS: UIDPAN [12-digit Aadhaar] [10-digit PAN] to 567678 from your registered mobile.");
        steps.add(step3);
        
        Map<String, Object> step4 = new HashMap<>();
        step4.put("step", 4);
        step4.put("title", "⚠️ CRITICAL WARNING");
        step4.put("desc", "If your PAN becomes INOPERATIVE: You cannot open bank accounts, file taxes, or make transactions above ₹50,000.");
        steps.add(step4);
        
        return steps;
    }
}

