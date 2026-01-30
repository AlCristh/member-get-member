package com.alejandro.membergetmember.service;

import com.alejandro.membergetmember.api.dto.referral.ReferralResponse;
import com.alejandro.membergetmember.domain.entity.Referral;

import java.util.List;

public interface ReferralService {

    Referral createReferral(String referralCode, Long referredMemberId);

    Referral inviteByEmail(String referrerEmail, String invitedEmail);

    Referral resend(String referrerEmail, Long referralId);

    List<ReferralResponse> findAll();

    List<ReferralResponse> findMyReferrals(String email);
}
