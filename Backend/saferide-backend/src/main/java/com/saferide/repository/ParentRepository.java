package com.saferide.repository;

import com.saferide.entity.Parent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParentRepository extends JpaRepository<Parent, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    Page<Parent> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String fullName,
            String email,
            String phone,
            Pageable pageable
    );
}