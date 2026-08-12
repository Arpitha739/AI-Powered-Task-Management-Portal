package com.taskportal.serviceimpl;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.taskportal.dto.AiResponse;
import com.taskportal.service.AiService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final RestTemplate restTemplate;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1/interactions";

    @Override
    public AiResponse generateTask(String title) {

        try {

            String apiKey = System.getenv("GEMINI_API_KEY");

            if (apiKey == null || apiKey.isBlank()) {

                throw new RuntimeException(
                        "GEMINI_API_KEY environment variable is not configured");
            }

            String prompt = """
                    You are a task management assistant.

                    Analyze the following task title and generate:

                    DESCRIPTION: A clear task description
                    PRIORITY: LOW, MEDIUM, or HIGH
                    ESTIMATED_HOURS: Number only

                    Task Title:
                    %s

                    Return ONLY in this exact format:

                    DESCRIPTION: <description>
                    PRIORITY: <priority>
                    ESTIMATED_HOURS: <hours>
                    """.formatted(title);

            Map<String, Object> requestBody = Map.of(
                    "model", "gemini-3.6-flash",
                    "input", prompt
            );

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", apiKey);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response =
                    restTemplate.exchange(
                            GEMINI_URL,
                            HttpMethod.POST,
                            entity,
                            Map.class
                    );

            Map responseBody = response.getBody();

            if (responseBody == null) {
                throw new RuntimeException("Empty response from Gemini");
            }

            List steps = (List) responseBody.get("steps");

            if (steps == null || steps.isEmpty()) {
                throw new RuntimeException(
                        "No steps returned from Gemini");
            }

            String aiText = null;

            /*
             * Find the model_output step.
             */
            for (Object stepObject : steps) {

                Map step = (Map) stepObject;

                String type = String.valueOf(
                        step.get("type"));

                if ("model_output".equals(type)) {

                    List content =
                            (List) step.get("content");

                    if (content != null && !content.isEmpty()) {

                        Map textContent =
                                (Map) content.get(0);

                        aiText =
                                String.valueOf(
                                        textContent.get("text"));

                        break;
                    }
                }
            }

            if (aiText == null || aiText.isBlank()) {

                throw new RuntimeException(
                        "No text response returned from Gemini");
            }

            String description = "";
            String priority = "";
            String estimatedHours = "";

            String[] lines =
                    aiText.split("\\r?\\n");

            for (String line : lines) {

                line = line.trim();

                if (line.startsWith("DESCRIPTION:")) {

                    description =
                            line.replace(
                                    "DESCRIPTION:",
                                    "")
                                .trim();
                }

                else if (line.startsWith("PRIORITY:")) {

                    priority =
                            line.replace(
                                    "PRIORITY:",
                                    "")
                                .trim();
                }

                else if (line.startsWith(
                        "ESTIMATED_HOURS:")) {

                    estimatedHours =
                            line.replace(
                                    "ESTIMATED_HOURS:",
                                    "")
                                .trim();
                }
            }

            return new AiResponse(
                    description,
                    priority,
                    estimatedHours
            );

        } catch (Exception e) {

            e.printStackTrace();

            return new AiResponse(
                    "Unable to generate description currently.",
                    "MEDIUM",
                    "2"
            );
        }
    }
}