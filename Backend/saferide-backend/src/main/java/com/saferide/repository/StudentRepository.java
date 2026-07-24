package com.saferide.repository;

import com.saferide.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByRollNumber(String rollNumber);

    Page<Student> findByFullNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(
            String fullName,
            String rollNumber,
            Pageable pageable
    );
}