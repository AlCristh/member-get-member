package com.alejandro.membergetmember.api.mapper;

import com.alejandro.membergetmember.api.dto.referral.ReferralResponse;
import com.alejandro.membergetmember.domain.entity.Member;
import com.alejandro.membergetmember.domain.entity.Referral;

public class ReferralMapper {

    public static ReferralResponse toResponse(Referral referral) {
        ReferralResponse r = new ReferralResponse();

        r.setId(referral.getId());
        r.setStatus(referral.getStatus().name());

        r.setCreatedAt(referral.getCreatedAt());
        r.setInvitedAt(referral.getInvitedAt());
        r.setRegisteredAt(referral.getRegisteredAt());
        r.setCreditedAt(referral.getCreditedAt());

        r.setResendCount(referral.getResendCount());
        r.setLastResentAt(referral.getLastResentAt());

        Member referrer = referral.getReferrer();
        if (referrer != null)
            r.setReferrerId(referrer.getId());

        Member referred = referral.getReferred();
        if (referred != null) {
            r.setReferredId(referred.getId());
            r.setReferredName(referred.getName());
            r.setReferredEmail(referred.getEmail());
        }

        r.setInvitedEmail(referral.getInvitedEmail());

        return r;
    }
}
