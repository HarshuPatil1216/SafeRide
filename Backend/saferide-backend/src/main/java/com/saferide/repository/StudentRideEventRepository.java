package com.saferide.repository;

import com.saferide.entity.StudentRideEvent;
import com.saferide.enums.StudentRideEventType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRideEventRepository
        extends JpaRepository<StudentRideEvent, Long> {

    Page<StudentRideEvent> findByStudentIdOrderByEventTimeDesc(
            Long studentId,
            Pageable pageable
    );

    Page<StudentRideEvent> findByRideIdOrderByEventTimeDesc(
            Long rideId,
            Pageable pageable
    );

    Optional<StudentRideEvent>
    findTopByStudentIdAndRideIdOrderByEventTimeDesc(
            Long studentId,
            Long rideId
    );

    boolean existsByStudentIdAndRideIdAndEventType(
            Long studentId,
            Long rideId,
            StudentRideEventType eventType
    );
}