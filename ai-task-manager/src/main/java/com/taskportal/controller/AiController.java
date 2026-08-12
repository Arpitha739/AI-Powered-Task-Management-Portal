package com.taskportal.controller;

import org.springframework.web.bind.annotation.*;

import com.taskportal.dto.AiRequest;
import com.taskportal.dto.AiResponse;
import com.taskportal.service.AiService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/generate")
    public AiResponse generate(
            @RequestBody AiRequest request) {

        System.out.println("========== AI CONTROLLER REACHED ==========");
        System.out.println("Title: " + request.getTitle());

        return aiService.generateTask(
                request.getTitle());
    }
}