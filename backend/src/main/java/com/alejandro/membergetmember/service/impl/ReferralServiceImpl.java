package com.alejandro.membergetmember.service.impl;

import com.alejandro.membergetmember.domain.entity.Member;
import com.alejandro.membergetmember.domain.entity.Referral;
import com.alejandro.membergetmember.repository.MemberRepository;
import com.alejandro.membergetmember.repository.ReferralRepository;
import com.alejandro.membergetmember.service.ReferralService;
import org.springframework.stereotype.Service;

@Service
public class ReferralServiceImpl implements ReferralService {

    private final MemberRepository memberRepository;
    private final ReferralRepository referralRepository;

    public ReferralServiceImpl(MemberRepository memberRepository,
            ReferralRepository referralRepository) {
        this.memberRepository = memberRepository;
        this.referralRepository = referralRepository;
    }

    @Override
    public Referral createReferral(String referralCode, Long referredMemberId) {

        Member referrer = memberRepository.findByReferralCode(referralCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid referral code"));

        Member referred = memberRepository.findById(referredMemberId)
                .orElseThrow(() -> new IllegalArgumentException("Referred member not found"));

        if (referrer.getId().equals(referred.getId())) {
            throw new IllegalArgumentException("Self-referral is not allowed");
        }

        if (referralRepository.existsByReferred(referred)) {
            throw new IllegalArgumentException("Member has already been referred");
        }

        Referral referral = new Referral();
        referral.setReferrer(referrer);
        referral.setReferred(referred);

  

        return referralRepository.save(referral);
    }
}
