package com.saferide.serviceimpl;

import com.saferide.dto.CreateStudentRequest;
import com.saferide.dto.StudentResponse;
import com.saferide.entity.Parent;
import com.saferide.entity.Student;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.StudentRepository;
import com.saferide.service.StudentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final ParentRepository parentRepository;

    public StudentServiceImpl(
            StudentRepository studentRepository,
            ParentRepository parentRepository
    ) {
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
    }

    @Override
    @Transactional
    public StudentResponse createStudent(
            CreateStudentRequest request
    ) {

        if (studentRepository.existsByRollNumber(
                request.getRollNumber()
        )) {
            throw new DuplicateResourceException(
                    "Student roll number already exists"
            );
        }

        Parent parent = findParentById(
                request.getParentId()
        );

        Student student = new Student();

        student.setFullName(request.getFullName());
        student.setRollNumber(request.getRollNumber());
        student.setStandard(request.getStandard());
        student.setDivision(request.getDivision());
        student.setParent(parent);
        student.setAddress(request.getAddress());

        student.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );

        Student savedStudent =
                studentRepository.save(student);

        return mapToResponse(savedStudent);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getAllStudents(
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                createSort(sortBy, sortDir)
        );

        return studentRepository
                .findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> searchStudents(
            String query,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                createSort(sortBy, sortDir)
        );

        return studentRepository
                .findByFullNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(
                        query,
                        query,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {

        Student student = findStudentById(id);

        return mapToResponse(student);
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(
            Long id,
            CreateStudentRequest request
    ) {

        Student student = findStudentById(id);

        if (!student.getRollNumber()
                .equalsIgnoreCase(request.getRollNumber())
                && studentRepository.existsByRollNumber(
                request.getRollNumber()
        )) {
            throw new DuplicateResourceException(
                    "Student roll number already exists"
            );
        }

        Parent parent = findParentById(
                request.getParentId()
        );

        student.setFullName(request.getFullName());
        student.setRollNumber(request.getRollNumber());
        student.setStandard(request.getStandard());
        student.setDivision(request.getDivision());
        student.setParent(parent);
        student.setAddress(request.getAddress());

        if (request.getActive() != null) {
            student.setActive(request.getActive());
        }

        Student updatedStudent =
                studentRepository.save(student);

        return mapToResponse(updatedStudent);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {

        Student student = findStudentById(id);

        studentRepository.delete(student);
    }

    private Student findStudentById(Long id) {

        return studentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found"
                        )
                );
    }

    private Parent findParentById(Long id) {

        return parentRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Parent not found"
                        )
                );
    }

    private Sort createSort(
            String sortBy,
            String sortDir
    ) {

        if ("desc".equalsIgnoreCase(sortDir)) {
            return Sort.by(sortBy).descending();
        }

        return Sort.by(sortBy).ascending();
    }

    private StudentResponse mapToResponse(
            Student student
    ) {

        Parent parent = student.getParent();

        return new StudentResponse(
                student.getId(),
                student.getFullName(),
                student.getRollNumber(),
                student.getStandard(),
                student.getDivision(),

                parent.getId(),
                parent.getFullName(),
                parent.getPhone(),

                student.getAddress(),
                student.getActive(),
                student.getCreatedAt()
        );
    }
}