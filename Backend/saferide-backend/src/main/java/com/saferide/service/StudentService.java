package com.saferide.service;

import com.saferide.dto.CreateStudentRequest;
import com.saferide.dto.StudentResponse;
import org.springframework.data.domain.Page;

public interface StudentService {

    StudentResponse createStudent(
            CreateStudentRequest request
    );

    Page<StudentResponse> getAllStudents(
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    Page<StudentResponse> searchStudents(
            String query,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    StudentResponse getStudentById(Long id);

    StudentResponse updateStudent(
            Long id,
            CreateStudentRequest request
    );

    void deleteStudent(Long id);
}