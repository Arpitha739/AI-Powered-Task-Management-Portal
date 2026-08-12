package com.taskportal.service;

import com.taskportal.dto.AiResponse;

public interface AiService {

    AiResponse generateTask(String title);
}