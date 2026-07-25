package com.saferide.serviceimpl;

import com.saferide.dto.CreateParentRequest;
import com.saferide.dto.ParentResponse;
import com.saferide.entity.Parent;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.ParentRepository;
import com.saferide.service.ParentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class ParentServiceImpl implements ParentService {

    private final ParentRepository parentRepository;

    public ParentServiceImpl(
            ParentRepository parentRepository
    ) {
        this.parentRepository = parentRepository;
    }

    @Override
    public ParentResponse createParent(
            CreateParentRequest request
    ) {

        if (parentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Parent email already exists"
            );
        }

        if (parentRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException(
                    "Parent phone already exists"
            );
        }

        Parent parent = new Parent();

        parent.setFullName(request.getFullName());
        parent.setEmail(request.getEmail());
        parent.setPhone(request.getPhone());
        parent.setAddress(request.getAddress());
        parent.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );

        Parent savedParent =
                parentRepository.save(parent);

        return mapToResponse(savedParent);
    }

    @Override
    public Page<ParentResponse> getAllParents(
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

        return parentRepository
                .findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<ParentResponse> searchParents(
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

        return parentRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                        query,
                        query,
                        query,
                        pageable
                )
                .map(this::mapToResponse);
    }

    @Override
    public ParentResponse getParentById(Long id) {

        Parent parent = findParentById(id);

        return mapToResponse(parent);
    }

    @Override
    public ParentResponse updateParent(
            Long id,
            CreateParentRequest request
    ) {

        Parent parent = findParentById(id);

        if (!parent.getEmail().equalsIgnoreCase(request.getEmail())
                && parentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Parent email already exists"
            );
        }

        if (!parent.getPhone().equals(request.getPhone())
                && parentRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException(
                    "Parent phone already exists"
            );
        }

        parent.setFullName(request.getFullName());
        parent.setEmail(request.getEmail());
        parent.setPhone(request.getPhone());
        parent.setAddress(request.getAddress());

        if (request.getActive() != null) {
            parent.setActive(request.getActive());
        }

        Parent updatedParent =
                parentRepository.save(parent);

        return mapToResponse(updatedParent);
    }

    @Override
    public void deleteParent(Long id) {

        Parent parent = findParentById(id);

        parentRepository.delete(parent);
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

    private ParentResponse mapToResponse(
            Parent parent
    ) {

        return new ParentResponse(
                parent.getId(),
                parent.getFullName(),
                parent.getEmail(),
                parent.getPhone(),
                parent.getAddress(),
                parent.getActive(),
                parent.getCreatedAt()
        );
    }
}