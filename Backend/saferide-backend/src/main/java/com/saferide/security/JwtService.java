package com.saferide.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET =
            "MySecretKeyForSafeRideApplication2026MySecretKey123456";

    private static final long EXPIRATION_TIME =
            24 * 60 * 60 * 1000L; // 24 hours

    private final SecretKey key;

    public JwtService() {
        this.key = Keys.hmacShaKeyFor(
                SECRET.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(String email) {

        Date issuedAt = new Date();
        Date expiration = new Date(
                issuedAt.getTime() + EXPIRATION_TIME
        );

        return Jwts.builder()
                .subject(email)
                .issuedAt(issuedAt)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }

    public String extractEmail(String token) {

        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(
            String token,
            String email
    ) {

        try {

            Claims claims = extractAllClaims(token);

            String tokenEmail = claims.getSubject();

            Date expiration = claims.getExpiration();

            return tokenEmail != null
                    && tokenEmail.equals(email)
                    && expiration != null
                    && expiration.after(new Date());

        } catch (Exception e) {

            return false;
        }
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}