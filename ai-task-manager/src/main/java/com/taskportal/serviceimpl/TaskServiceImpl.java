package com.taskportal.serviceimpl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.taskportal.dto.TaskRequest;
import com.taskportal.entity.Status;
import com.taskportal.entity.Task;
import com.taskportal.entity.User;
import com.taskportal.repository.TaskRepository;
import com.taskportal.repository.UserRepository;
import com.taskportal.service.TaskService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl
        implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    public Task createTask(
            TaskRequest request,
            String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow();

        Task task =
                Task.builder()
                        .title(request.getTitle())
                        .description(
                                request.getDescription())
                        .priority(
                                request.getPriority())
                        .dueDate(
                                request.getDueDate())
                        .estimatedHours(
                                request.getEstimatedHours())
                        .status(Status.TODO)
                        .createdAt(
                                LocalDateTime.now())
                        .user(user)
                        .build();

        return taskRepository.save(task);
    }

    @Override
    public List<Task> getAllTasks(
            String email) {

        return taskRepository
                .findByUserEmail(email);
    }

    @Override
    public Task updateTask(
            Long id,
            TaskRequest request,
            String email) {

    	Task task =
    	        taskRepository
    	                .findByIdAndUserEmail(id, email)
    	                .orElseThrow(() ->
    	                        new RuntimeException(
    	                                "Task not found or access denied"));

        task.setTitle(
                request.getTitle());

        task.setDescription(
                request.getDescription());

        task.setPriority(
                request.getPriority());
        
        task.setStatus(
                request.getStatus());

        task.setDueDate(
                request.getDueDate());

        task.setEstimatedHours(
                request.getEstimatedHours());

        return taskRepository.save(task);
    }
    
    @Override
    public Task updateStatus(
            Long id,
            String status,
            String email) {

    	Task task =
    	        taskRepository
    	                .findByIdAndUserEmail(id, email)
    	                .orElseThrow(() ->
    	                        new RuntimeException(
    	                                "Task not found or access denied"));

        task.setStatus(
                Status.valueOf(status));

        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(
            Long id,
            String email) {

    	Task task =
    	        taskRepository
    	                .findByIdAndUserEmail(id, email)
    	                .orElseThrow(() ->
    	                        new RuntimeException(
    	                                "Task not found or access denied"));

    	taskRepository.delete(task);
    }
}