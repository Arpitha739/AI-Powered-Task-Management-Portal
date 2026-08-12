package com.taskportal.dto;

import java.time.LocalDate;

import com.taskportal.entity.Priority;
import com.taskportal.entity.Status;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequest {

    @NotBlank(message = "Task title is required")
    private String title;

    private String description;

    private Priority priority;

    private Status status;

    private LocalDate dueDate;

    private String estimatedHours;
}