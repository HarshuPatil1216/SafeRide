package com.saferide.serviceimpl;

import com.saferide.dto.CreateStudentRequest;
import com.saferide.dto.StudentResponse;
import com.saferide.entity.Student;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private CreateStudentRequest request;
    private Student student;

    @BeforeEach
    void setUp() {

        request = new CreateStudentRequest();
        request.setFullName("Aarav Suresh Patil");
        request.setRollNumber("STD001");
        request.setStandard("6");
        request.setDivision("B");
        request.setParentName("Suresh Patil");
        request.setParentPhone("9876543211");
        request.setAddress("Pune City");
        request.setActive(true);

        student = new Student();
        student.setId(1L);
        student.setFullName(request.getFullName());
        student.setRollNumber(request.getRollNumber());
        student.setStandard(request.getStandard());
        student.setDivision(request.getDivision());
        student.setParentName(request.getParentName());
        student.setParentPhone(request.getParentPhone());
        student.setAddress(request.getAddress());
        student.setActive(request.getActive());
    }

    @Test
    void createStudent_shouldReturnStudentResponse() {

        when(studentRepository.existsByRollNumber(
                request.getRollNumber()
        )).thenReturn(false);

        when(studentRepository.save(any(Student.class)))
                .thenReturn(student);

        StudentResponse response =
                studentService.createStudent(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(
                "Aarav Suresh Patil",
                response.getFullName()
        );
        assertEquals("STD001", response.getRollNumber());
        assertEquals("6", response.getStandard());
        assertEquals("B", response.getDivision());
        assertTrue(response.getActive());

        verify(studentRepository)
                .save(any(Student.class));
    }

    @Test
    void createStudent_shouldThrowWhenRollNumberAlreadyExists() {

        when(studentRepository.existsByRollNumber(
                request.getRollNumber()
        )).thenReturn(true);

        DuplicateResourceException exception =
                assertThrows(
                        DuplicateResourceException.class,
                        () -> studentService.createStudent(request)
                );

        assertEquals(
                "Student roll number already exists",
                exception.getMessage()
        );

        verify(studentRepository, never())
                .save(any(Student.class));
    }

    @Test
    void getStudentById_shouldReturnStudentResponse() {

        when(studentRepository.findById(1L))
                .thenReturn(Optional.of(student));

        StudentResponse response =
                studentService.getStudentById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("STD001", response.getRollNumber());
        assertEquals(
                "Aarav Suresh Patil",
                response.getFullName()
        );
    }

    @Test
    void getStudentById_shouldThrowWhenStudentNotFound() {

        when(studentRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> studentService.getStudentById(999L)
                );

        assertEquals(
                "Student not found",
                exception.getMessage()
        );
    }
}