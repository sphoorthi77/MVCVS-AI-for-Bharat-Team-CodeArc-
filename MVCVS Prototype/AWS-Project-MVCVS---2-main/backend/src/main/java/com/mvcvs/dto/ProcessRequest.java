package com.mvcvs.dto;

import java.util.Map;

public class ProcessRequest {
    private String scenario;
    private String transcribedText;
    private String language;
    private String audioUrl;
    private Map<String, Object> dag;
    private Map<String, Object> quiz;

    public ProcessRequest() {}

    public String getScenario() { return scenario; }
    public void setScenario(String scenario) { this.scenario = scenario; }

    public String getTranscribedText() { return transcribedText; }
    public void setTranscribedText(String transcribedText) { this.transcribedText = transcribedText; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public Map<String, Object> getDag() { return dag; }
    public void setDag(Map<String, Object> dag) { this.dag = dag; }

    public Map<String, Object> getQuiz() { return quiz; }
    public void setQuiz(Map<String, Object> quiz) { this.quiz = quiz; }
}

