package com.taskportal.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(
            RuntimeException ex) {

        Map<String, String> response = new HashMap<>();

        response.put("message", ex.getMessage());

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(
            Exception ex) {

        Map<String, String> response = new HashMap<>();

        response.put(
                "message",
                "Something went wrong. Please try again.");

        return new ResponseEntity<>(
                response,
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(
            org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {

        Map<String, String> response = new HashMap<>();

        String message =
                ex.getBindingResult()
                        .getFieldError()
                        .getDefaultMessage();

        response.put("message", message);

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST);
    }
    
}