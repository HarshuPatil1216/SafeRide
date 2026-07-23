package com.saferide.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleEmailAlreadyExists(
            EmailAlreadyExistsException exception
    ) {
        ApiErrorResponse response = new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(),
                HttpStatus.CONFLICT.getReasonPhrase(),
                exception.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException exception
    ) {
        Map<String, String> messages = new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        messages.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Validation Failed");
        response.put("messages", messages);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntimeException(
            RuntimeException exception
    ) {
        HttpStatus status = determineStatus(exception.getMessage());

        ApiErrorResponse response = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                exception.getMessage()
        );

        return ResponseEntity
                .status(status)
                .body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpectedException(
            Exception exception
    ) {
        ApiErrorResponse response = new ApiErrorResponse(
                LocalDateTime.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "Something went wrong"
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }

    private HttpStatus determineStatus(String message) {

        if (message == null || message.isBlank()) {
            return HttpStatus.INTERNAL_SERVER_ERROR;
        }

        String normalizedMessage = message.toLowerCase();

        if (normalizedMessage.contains("not found")) {
            return HttpStatus.NOT_FOUND;
        }

        if (normalizedMessage.contains("already exists")
                || normalizedMessage.contains("already registered")) {
            return HttpStatus.CONFLICT;
        }

        if (normalizedMessage.contains("only scheduled ride")
                || normalizedMessage.contains("only in-progress ride")) {
            return HttpStatus.BAD_REQUEST;
        }

        if (normalizedMessage.contains("invalid email or password")) {
            return HttpStatus.UNAUTHORIZED;
        }

        return HttpStatus.BAD_REQUEST;
    }
}