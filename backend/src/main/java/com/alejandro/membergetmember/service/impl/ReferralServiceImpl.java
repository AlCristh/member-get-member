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
    public Referral createReferral(String referralCode, Long referredMemberId) {
        Member referrer = memberRepository.findByReferralCode(referralCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid referral code"));

        Member referred = memberRepository.findById(referredMemberId)
                .orElseThrow(() -> new IllegalArgumentException("Referred member not found"));

        Referral referral = new Referral();
        referral.setReferrer(referrer);
        referral.setReferred(referred);
        referral.setStatus(ReferralStatus.CONVIDADO);

        return referralRepository.save(referral);
    }

    @Override
    public List<ReferralResponse> findAll() {
        return referralRepository.findAll()
                .stream()
                .map(ReferralMapper::toResponse)
                .toList();
    }
}
