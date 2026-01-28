package com.alejandro.membergetmember.service;

import com.alejandro.membergetmember.domain.entity.Referral;

public interface ReferralService {

    Referral createReferral(String referralCode, Long referredMemberId);
}
