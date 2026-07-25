package com.saferide.service;

import com.saferide.dto.CreateParentRequest;
import com.saferide.dto.ParentResponse;
import org.springframework.data.domain.Page;

public interface ParentService {

    ParentResponse createParent(
            CreateParentRequest request
    );

    Page<ParentResponse> getAllParents(
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    Page<ParentResponse> searchParents(
            String query,
            int page,
            int size,
            String sortBy,
            String sortDir
    );

    ParentResponse getParentById(Long id);

    ParentResponse updateParent(
            Long id,
            CreateParentRequest request
    );

    void deleteParent(Long id);
}