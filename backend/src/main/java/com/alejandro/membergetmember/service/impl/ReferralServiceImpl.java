package com.alejandro.membergetmember.service.impl;

import com.alejandro.membergetmember.api.dto.referral.ReferralResponse;
import com.alejandro.membergetmember.api.mapper.ReferralMapper;
import com.alejandro.membergetmember.domain.entity.Member;
import com.alejandro.membergetmember.domain.entity.Referral;
import com.alejandro.membergetmember.domain.enums.ReferralStatus;
import com.alejandro.membergetmember.repository.MemberRepository;
import com.alejandro.membergetmember.repository.ReferralRepository;
import com.alejandro.membergetmember.service.ReferralService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReferralServiceImpl implements ReferralService {

    private final ReferralRepository referralRepository;
    private final MemberRepository memberRepository;

    public ReferralServiceImpl(
            ReferralRepository referralRepository,
            MemberRepository memberRepository) {
        this.referralRepository = referralRepository;
        this.memberRepository = memberRepository;
    }

    @Override
    @Transactional
    public Referral createReferral(String referralCode, Long referredMemberId) {
        Member referrer = memberRepository.findByReferralCode(referralCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid referral code"));

        Member referred = memberRepository.findById(referredMemberId)
                .orElseThrow(() -> new IllegalArgumentException("Referred member not found"));

        if (referrer.getId().equals(referred.getId())) {
            throw new IllegalArgumentException("Self referral is not allowed");
        }

        if (referralRepository.existsByReferred(referred)) {
            throw new IllegalArgumentException("Referral already exists for this referred member");
        }

        Referral referral = new Referral();
        referral.setReferrer(referrer);
        referral.setReferred(referred);
        referral.setStatus(ReferralStatus.CONVIDADO);
        referral.setInvitedAt(LocalDateTime.now());

        return referralRepository.save(referral);
    }

    @Override
    @Transactional
    public Referral inviteByEmail(String referrerEmail, String invitedEmailRaw) {
        String invitedEmail = normalizeEmail(invitedEmailRaw);

        Member referrer = memberRepository.findByEmail(referrerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (memberRepository.existsByEmail(invitedEmail)) {
            throw new IllegalArgumentException("E-mail already registered");
        }

        if (referrer.getEmail().equalsIgnoreCase(invitedEmail)) {
            throw new IllegalArgumentException("Self referral is not allowed");
        }

        if (referralRepository.existsByInvitedEmailIgnoreCaseAndStatus(invitedEmail, ReferralStatus.CONVIDADO)) {
            throw new IllegalArgumentException("Invite already exists for this email");
        }

        if (referralRepository.existsByReferrerAndInvitedEmailIgnoreCaseAndStatus(referrer, invitedEmail,
                ReferralStatus.CONVIDADO)) {
            throw new IllegalArgumentException("Invite already exists for this email");
        }

        Referral referral = new Referral();
        referral.setReferrer(referrer);
        referral.setInvitedEmail(invitedEmail);
        referral.setStatus(ReferralStatus.CONVIDADO);
        referral.setInvitedAt(LocalDateTime.now());
        referral.setResendCount(0);

        return referralRepository.save(referral);
    }

    @Override
    @Transactional
    public Referral resend(String referrerEmail, Long referralId) {
        Member referrer = memberRepository.findByEmail(referrerEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Referral referral = referralRepository.findById(referralId)
                .orElseThrow(() -> new IllegalArgumentException("Referral not found"));

        if (!referral.getReferrer().getId().equals(referrer.getId())) {
            throw new IllegalArgumentException("Not allowed");
        }

        if (referral.getStatus() != ReferralStatus.CONVIDADO) {
            throw new IllegalArgumentException("Only CONVIDADO referrals can be resent");
        }

        int count = referral.getResendCount() == null ? 0 : referral.getResendCount();
        referral.setResendCount(count + 1);
        referral.setLastResentAt(LocalDateTime.now());

        return referralRepository.save(referral);
    }
    

    @Override
    public List<ReferralResponse> findAll() {
        return referralRepository.findAll()
                .stream()
                .map(ReferralMapper::toResponse)
                .toList();
    }

    @Override
    public List<ReferralResponse> findMyReferrals(String email) {
        Member me = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return referralRepository.findAllByReferrer(me)
                .stream()
                .map(ReferralMapper::toResponse)
                .toList();
    }

    private String normalizeEmail(String v) {
        if (v == null)
            throw new IllegalArgumentException("Email required");
        String s = v.trim().toLowerCase();
        if (s.isEmpty())
            throw new IllegalArgumentException("Email required");
        return s;
    }

    
    
}
