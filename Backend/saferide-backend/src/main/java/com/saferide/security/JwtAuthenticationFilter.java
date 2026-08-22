package com.saferide.security;

import com.saferide.entity.User;
import com.saferide.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserRepository userRepository;


    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {

        this.jwtService =
                jwtService;

        this.userRepository =
                userRepository;
    }


    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request
    ) {

        String path =
                request.getServletPath();

        return path.equals(
                "/api/health"
        )
                || path.equals(
                "/api/auth/login"
        )
                || path.equals(
                "/api/auth/register"
        );
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    )
            throws ServletException, IOException {


        String authorizationHeader =
                request.getHeader(
                        "Authorization"
                );


        // ====================================
        // NO TOKEN
        // ====================================

        if (
                authorizationHeader == null
                        ||
                        !authorizationHeader.startsWith(
                                "Bearer "
                        )
        ) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }


        String token =
                authorizationHeader.substring(
                        7
                );


        try {

            // ==================================
            // EXTRACT EMAIL
            // ==================================

            String email =
                    jwtService.extractEmail(
                            token
                    );


            // ==================================
            // FIND USER
            // ==================================

            User user =
                    userRepository
                            .findByEmail(email)
                            .orElseThrow(
                                    () ->
                                            new RuntimeException(
                                                    "User not found"
                                            )
                            );


            // ==================================
            // VALIDATE TOKEN
            // ==================================

            if (
                    !jwtService.isTokenValid(
                            token,
                            user.getEmail()
                    )
            ) {

                throw new RuntimeException(
                        "Invalid token"
                );
            }


            // ==================================
            // ROLE
            // ==================================

            String authorityName =
                    "ROLE_" +
                            user.getRole().name();


            // ==================================
            // DEBUG LOG
            // ==================================

            System.out.println(
                    "================================"
            );

            System.out.println(
                    "JWT USER      : " +
                            user.getEmail()
            );

            System.out.println(
                    "JWT ROLE      : " +
                            user.getRole().name()
            );

            System.out.println(
                    "JWT AUTHORITY : " +
                            authorityName
            );

            System.out.println(
                    "REQUEST       : " +
                            request.getMethod() +
                            " " +
                            request.getRequestURI()
            );

            System.out.println(
                    "================================"
            );


            // ==================================
            // AUTHORITY
            // ==================================

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(
                            authorityName
                    );


            // ==================================
            // AUTHENTICATION
            // ==================================

            UsernamePasswordAuthenticationToken
                    authentication =
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            null,
                            List.of(authority)
                    );


            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );


        } catch (Exception exception) {

            SecurityContextHolder
                    .clearContext();


            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.setContentType(
                    "application/json"
            );


            response.getWriter().write(
                    "{\"message\":\"Invalid or expired token\"}"
            );

            return;
        }


        filterChain.doFilter(
                request,
                response
        );
    }
}