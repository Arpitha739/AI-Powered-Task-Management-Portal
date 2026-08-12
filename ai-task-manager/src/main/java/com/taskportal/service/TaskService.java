package com.taskportal.service;

import java.util.List;

import com.taskportal.dto.TaskRequest;
import com.taskportal.entity.Task;

public interface TaskService {

    Task createTask(
            TaskRequest request,
            String email);

    List<Task> getAllTasks(
            String email);

    Task updateTask(
            Long id,
            TaskRequest request,
            String email);
    
    Task updateStatus(
            Long id,
            String status,
            String email);

    void deleteTask(
            Long id,
            String email);
}