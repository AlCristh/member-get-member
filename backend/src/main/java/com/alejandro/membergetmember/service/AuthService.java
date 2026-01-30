package com.alejandro.membergetmember.service;

import com.alejandro.membergetmember.api.dto.auth.AuthResponse;
import com.alejandro.membergetmember.api.dto.auth.LoginRequest;
import com.alejandro.membergetmember.api.dto.auth.RegisterRequest;
import com.alejandro.membergetmember.domain.entity.Member;
import com.alejandro.membergetmember.repository.MemberRepository;
import com.alejandro.membergetmember.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(MemberRepository memberRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail already registered");
        }

        Member member = new Member();
        member.setName(request.getName());
        member.setEmail(request.getEmail());
        member.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        member.setReferralCode(generateReferralCode());
        member.setReferredByCode(request.getReferredByCode()); // BLOCO 2 vai usar isso pra conversão

        Member saved = memberRepository.save(member);

        String token = jwtService.generateToken(saved.getEmail());
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        boolean ok = passwordEncoder.matches(request.getPassword(), member.getPasswordHash());
        if (!ok) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtService.generateToken(member.getEmail());
        return new AuthResponse(token);
    }

    private String generateReferralCode() {
        return UUID.randomUUID().toString().replace("-", "")
                .substring(0, 8)
                .toUpperCase();
    }
}
