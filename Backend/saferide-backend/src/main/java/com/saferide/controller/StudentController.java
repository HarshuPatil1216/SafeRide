package com.saferide.controller;

import com.saferide.dto.CreateStudentRequest;
import com.saferide.dto.StudentResponse;
import com.saferide.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@Validated
@Tag(
        name = "Student Management",
        description = "APIs for creating, viewing, searching, updating and deleting students"
)
public class StudentController {

    private final StudentService studentService;

    public StudentController(
            StudentService studentService
    ) {
        this.studentService = studentService;
    }

    @Operation(
            summary = "Create a student",
            description = "Creates a new student with a unique roll number"
    )
    @ApiResponse(
            responseCode = "201",
            description = "Student created successfully"
    )
    @ApiResponse(
            responseCode = "400",
            description = "Invalid request data"
    )
    @ApiResponse(
            responseCode = "409",
            description = "Student roll number already exists"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<StudentResponse> createStudent(
            @Valid @RequestBody CreateStudentRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(studentService.createStudent(request));
    }

    @Operation(
            summary = "Get all students",
            description = "Returns students with pagination and sorting"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Students returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public ResponseEntity<Page<StudentResponse>> getAllStudents(
            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "Page number cannot be negative")
            int page,

            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "Page size must be at least 1")
            @Max(value = 100, message = "Page size cannot exceed 100")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String sortDir
    ) {
        return ResponseEntity.ok(
                studentService.getAllStudents(
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }

    @Operation(
            summary = "Search students",
            description = "Searches students by full name or roll number"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Matching students returned successfully"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/search")
    public ResponseEntity<Page<StudentResponse>> searchStudents(
            @RequestParam String query,

            @RequestParam(defaultValue = "0")
            @Min(value = 0, message = "Page number cannot be negative")
            int page,

            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "Page size must be at least 1")
            @Max(value = 100, message = "Page size cannot exceed 100")
            int size,

            @RequestParam(defaultValue = "id")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String sortDir
    ) {
        return ResponseEntity.ok(
                studentService.searchStudents(
                        query,
                        page,
                        size,
                        sortBy,
                        sortDir
                )
        );
    }

    @Operation(
            summary = "Get student by ID",
            description = "Returns the student matching the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Student found successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Student not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> getStudentById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                studentService.getStudentById(id)
        );
    }

    @Operation(
            summary = "Update a student",
            description = "Updates student details using the provided ID"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Student updated successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Student not found"
    )
    @ApiResponse(
            responseCode = "409",
            description = "Student roll number already exists"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody CreateStudentRequest request
    ) {
        return ResponseEntity.ok(
                studentService.updateStudent(id, request)
        );
    }

    @Operation(
            summary = "Delete a student",
            description = "Deletes the student matching the provided ID"
    )
    @ApiResponse(
            responseCode = "204",
            description = "Student deleted successfully"
    )
    @ApiResponse(
            responseCode = "404",
            description = "Student not found"
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Long id
    ) {
        studentService.deleteStudent(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}