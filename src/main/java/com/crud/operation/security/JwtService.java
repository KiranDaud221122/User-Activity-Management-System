package com.crud.operation.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET = "423498247979kiransecretkey98sdf89f9f5f4sd5fs5f5s4f";
    private static final long EXPIRATION =86400000;   // one day valid

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String email){
        return Jwts.builder()
                .setSubject(email)  //identifying the particular user
                .setIssuedAt(new Date()) // useful for expiration calculation , token revocation
                .setExpiration(new Date(System.currentTimeMillis()+EXPIRATION)) //After 24 hours, this token is invalid.
                .signWith(key,SignatureAlgorithm.HS256) //Signs the JWT digitally using your secret key and the HS256 algorithm.
                .compact();
    }

    public String extractEmail(String token){
        return getClaims(token).getSubject();
    }

    public boolean isTokenValid(String token){
        try{
            getClaims(token);
            return true;
        }
        catch (Exception ex){
            return false;
        }
    }

    public Claims getClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
