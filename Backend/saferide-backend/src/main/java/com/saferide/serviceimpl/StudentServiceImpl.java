package com.saferide.serviceimpl;

import com.saferide.dto.CreateStudentRequest;
import com.saferide.dto.StudentResponse;
import com.saferide.entity.Parent;
import com.saferide.entity.Route;
import com.saferide.entity.Stop;
import com.saferide.entity.Student;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.ParentRepository;
import com.saferide.repository.RouteRepository;
import com.saferide.repository.StopRepository;
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
    private final RouteRepository routeRepository;
    private final StopRepository stopRepository;

    public StudentServiceImpl(
            StudentRepository studentRepository,
            ParentRepository parentRepository,
            RouteRepository routeRepository,
            StopRepository stopRepository
    ) {
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
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

        Route route = findOptionalRouteById(
                request.getRouteId()
        );

        Stop stop = findAndValidateOptionalStop(
                request.getStopId(),
                route
        );

        Student student = new Student();

        student.setFullName(request.getFullName());
        student.setRollNumber(request.getRollNumber());
        student.setStandard(request.getStandard());
        student.setDivision(request.getDivision());
        student.setParent(parent);
        student.setRoute(route);
        student.setStop(stop);
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

        Route route = findOptionalRouteById(
                request.getRouteId()
        );

        Stop stop = findAndValidateOptionalStop(
                request.getStopId(),
                route
        );

        student.setFullName(request.getFullName());
        student.setRollNumber(request.getRollNumber());
        student.setStandard(request.getStandard());
        student.setDivision(request.getDivision());
        student.setParent(parent);
        student.setRoute(route);
        student.setStop(stop);
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

    private Route findOptionalRouteById(Long routeId) {

        if (routeId == null) {
            return null;
        }

        return routeRepository
                .findById(routeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Route not found"
                        )
                );
    }

    private Stop findAndValidateOptionalStop(
            Long stopId,
            Route route
    ) {

        if (stopId == null) {
            return null;
        }

        if (route == null) {
            throw new IllegalArgumentException(
                    "Route must be selected before assigning a stop"
            );
        }

        Stop stop = stopRepository
                .findById(stopId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Stop not found"
                        )
                );

        if (!stop.getRoute().getId().equals(route.getId())) {
            throw new IllegalArgumentException(
                    "Selected stop does not belong to selected route"
            );
        }

        return stop;
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
        Route route = student.getRoute();
        Stop stop = student.getStop();

        return new StudentResponse(
                student.getId(),
                student.getFullName(),
                student.getRollNumber(),
                student.getStandard(),
                student.getDivision(),

                parent.getId(),
                parent.getFullName(),
                parent.getPhone(),

                route != null ? route.getId() : null,
                route != null ? route.getRouteName() : null,

                stop != null ? stop.getId() : null,
                stop != null ? stop.getStopName() : null,

                student.getAddress(),
                student.getActive(),
                student.getCreatedAt()
        );
    }
}