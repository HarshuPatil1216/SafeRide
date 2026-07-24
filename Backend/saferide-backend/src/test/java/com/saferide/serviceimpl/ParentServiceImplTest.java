package com.saferide.serviceimpl;

import com.saferide.dto.CreateParentRequest;
import com.saferide.dto.ParentResponse;
import com.saferide.entity.Parent;
import com.saferide.exception.DuplicateResourceException;
import com.saferide.exception.ResourceNotFoundException;
import com.saferide.repository.ParentRepository;
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
class ParentServiceImplTest {

    @Mock
    private ParentRepository parentRepository;

    @InjectMocks
    private ParentServiceImpl parentService;

    private CreateParentRequest request;
    private Parent parent;

    @BeforeEach
    void setUp() {

        request = new CreateParentRequest();
        request.setFullName("Suresh Patil");
        request.setEmail("suresh.patil@gmail.com");
        request.setPhone("9876543211");
        request.setAddress("Pune City");
        request.setActive(true);

        parent = new Parent();
        parent.setId(1L);
        parent.setFullName(request.getFullName());
        parent.setEmail(request.getEmail());
        parent.setPhone(request.getPhone());
        parent.setAddress(request.getAddress());
        parent.setActive(request.getActive());
    }

    @Test
    void createParent_shouldReturnParentResponse() {

        when(parentRepository.existsByEmail(request.getEmail()))
                .thenReturn(false);

        when(parentRepository.existsByPhone(request.getPhone()))
                .thenReturn(false);

        when(parentRepository.save(any(Parent.class)))
                .thenReturn(parent);

        ParentResponse response =
                parentService.createParent(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Suresh Patil", response.getFullName());
        assertEquals(
                "suresh.patil@gmail.com",
                response.getEmail()
        );
        assertEquals("9876543211", response.getPhone());
        assertTrue(response.getActive());

        verify(parentRepository)
                .save(any(Parent.class));
    }

    @Test
    void createParent_shouldThrowWhenEmailAlreadyExists() {

        when(parentRepository.existsByEmail(request.getEmail()))
                .thenReturn(true);

        DuplicateResourceException exception =
                assertThrows(
                        DuplicateResourceException.class,
                        () -> parentService.createParent(request)
                );

        assertEquals(
                "Parent email already exists",
                exception.getMessage()
        );

        verify(parentRepository, never())
                .save(any(Parent.class));
    }

    @Test
    void createParent_shouldThrowWhenPhoneAlreadyExists() {

        when(parentRepository.existsByEmail(request.getEmail()))
                .thenReturn(false);

        when(parentRepository.existsByPhone(request.getPhone()))
                .thenReturn(true);

        DuplicateResourceException exception =
                assertThrows(
                        DuplicateResourceException.class,
                        () -> parentService.createParent(request)
                );

        assertEquals(
                "Parent phone already exists",
                exception.getMessage()
        );

        verify(parentRepository, never())
                .save(any(Parent.class));
    }

    @Test
    void getParentById_shouldReturnParentResponse() {

        when(parentRepository.findById(1L))
                .thenReturn(Optional.of(parent));

        ParentResponse response =
                parentService.getParentById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Suresh Patil", response.getFullName());
    }

    @Test
    void getParentById_shouldThrowWhenParentNotFound() {

        when(parentRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> parentService.getParentById(999L)
                );

        assertEquals(
                "Parent not found",
                exception.getMessage()
        );
    }
}