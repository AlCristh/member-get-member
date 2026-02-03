package com.alejandro.membergetmember.service;

import com.alejandro.membergetmember.api.dto.auth.AuthResponse;
import com.alejandro.membergetmember.api.dto.auth.LoginRequest;
import com.alejandro.membergetmember.api.dto.auth.RegisterRequest;
import com.alejandro.membergetmember.domain.entity.Member;
import com.alejandro.membergetmember.domain.entity.Referral;
import com.alejandro.membergetmember.domain.enums.ReferralStatus;
import com.alejandro.membergetmember.repository.MemberRepository;
import com.alejandro.membergetmember.repository.ReferralRepository;
import com.alejandro.membergetmember.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final MemberRepository memberRepository;
    private final ReferralRepository referralRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final int REFERRAL_CREDIT_REWARD = 1;

    public AuthService(
            MemberRepository memberRepository,
            ReferralRepository referralRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.memberRepository = memberRepository;
        this.referralRepository = referralRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail already registered");
        }

        String referredByCode = normalize(request.getReferredByCode());

        Member referrer = null;
        Referral inviteFoundByEmail = null;

        // 1) Se veio código, mantém seu fluxo atual
        if (referredByCode != null) {
            referrer = memberRepository.findByReferralCode(referredByCode)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid referral code"));
        } else {
            // 2) Se não veio código, tenta achar convite CONVIDADO por email
            inviteFoundByEmail = referralRepository
                    .findFirstByInvitedEmailIgnoreCaseAndStatus(request.getEmail(), ReferralStatus.CONVIDADO)
                    .orElse(null);

            if (inviteFoundByEmail != null) {
                referrer = inviteFoundByEmail.getReferrer();
            }
        }

        // cria usuário
        Member member = new Member();
        member.setName(request.getName());
        member.setEmail(request.getEmail());
        member.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        member.setReferralCode(generateReferralCode());
        member.setReferredByCode(referredByCode);
        member.setCredits(0);

        Member saved = memberRepository.save(member);

        // aplica conversão (se houve indicação)
        if (referrer != null) {
            // autoindicação (segurança extra)
            if (referrer.getId().equals(saved.getId())) {
                throw new IllegalArgumentException("Self referral is not allowed");
            }

            LocalDateTime now = LocalDateTime.now();

            // Se achou convite por email (sem código), usa ele.
            Referral invite = inviteFoundByEmail;

            // Se não achou por email (caso do código), tenta achar o convite por email do
            // referrer
            if (invite == null) {
                invite = referralRepository
                        .findFirstByReferrerAndInvitedEmailIgnoreCaseAndStatus(
                                referrer, saved.getEmail(), ReferralStatus.CONVIDADO)
                        .orElse(null);
            }

            if (invite != null) {
                invite.setReferred(saved);
                invite.setStatus(ReferralStatus.CADASTRADO);
                invite.setRegisteredAt(now);

                // crédito só se ainda não creditou
                if (invite.getCreditedAt() == null) {
                    invite.setCreditedAt(now);
                    referrer.setCredits(
                            (referrer.getCredits() == null ? 0 : referrer.getCredits()) + REFERRAL_CREDIT_REWARD);
                    memberRepository.save(referrer);
                }

                referralRepository.save(invite);
            } else {
                // fallback: se não existia convite, cria referral direto CADASTRADO
                // impede duplicado por referred (regra do case)
                if (!referralRepository.existsByReferred(saved)) {
                    Referral referral = new Referral();
                    referral.setReferrer(referrer);
                    referral.setReferred(saved);
                    referral.setInvitedEmail(saved.getEmail()); // opcional, ajuda rastrear
                    referral.setInvitedAt(now);
                    referral.setRegisteredAt(now);
                    referral.setCreditedAt(now);
                    referral.setStatus(ReferralStatus.CADASTRADO);
                    referral.setResendCount(0);

                    referralRepository.save(referral);

                    referrer.setCredits(
                            (referrer.getCredits() == null ? 0 : referrer.getCredits()) + REFERRAL_CREDIT_REWARD);
                    memberRepository.save(referrer);
                }
            }
        }

        String token = jwtService.generateToken(saved.getEmail());
        return new AuthResponse(token);
    }

    private String generateReferralCode() {
        return UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
    }

    private String normalize(String value) {
        if (value == null)
            return null;
        String v = value.trim();
        return v.isEmpty() ? null : v.toUpperCase();
    }

    public AuthResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), member.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtService.generateToken(member.getEmail());
        return new AuthResponse(token);
    }

}
