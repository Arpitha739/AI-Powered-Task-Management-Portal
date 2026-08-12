package com.taskportal.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskportal.entity.Status;
import com.taskportal.entity.Task;

public interface TaskRepository
        extends JpaRepository<Task, Long> {

    List<Task> findByUserEmail(String email);

    long countByUserEmail(String email);

    long countByUserEmailAndStatus(
            String email,
            Status status);
    
    Optional<Task> findByIdAndUserEmail(
            Long id,
            String email);
}