package com.stackoverflow.demo.securingweb;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JWTIssuer {
    private final JWTProperties properties;
    public String issue(long userId, String username, List<String> roles){
        return JWT.create()
                .withSubject(String.valueOf(userId))
                .withClaim("u",username)
                .withClaim("a",roles)
                .withExpiresAt(Instant.now().plus(Duration.of(1, ChronoUnit.DAYS)))
                .sign(Algorithm.HMAC256(properties.getSecretKey()));
    }
}
