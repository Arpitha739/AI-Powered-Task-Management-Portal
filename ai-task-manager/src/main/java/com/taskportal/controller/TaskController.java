package com.taskportal.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.taskportal.dto.TaskRequest;
import com.taskportal.entity.Task;
import com.taskportal.service.TaskService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public Task createTask(
    		 @Valid @RequestBody TaskRequest request,
            Authentication authentication) {

        return taskService.createTask(
                request,
                authentication.getName());
    }

    @GetMapping
    public List<Task> getAllTasks(
            Authentication authentication) {

        return taskService.getAllTasks(
                authentication.getName());
    }

    @PutMapping("/{id}")
    public Task updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {

        return taskService.updateTask(
                id,
                request,
                authentication.getName());
    }
    
    @PatchMapping("/{id}/status")
    public Task updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {

        return taskService.updateStatus(
                id,
                status,
                authentication.getName());
    }

    @DeleteMapping("/{id}")
    public String deleteTask(
            @PathVariable Long id,
            Authentication authentication) {

        taskService.deleteTask(
                id,
                authentication.getName());

        return "Task Deleted Successfully";
    }
}