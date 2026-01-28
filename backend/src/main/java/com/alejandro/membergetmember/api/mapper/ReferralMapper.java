package com.alejandro.membergetmember.api.mapper;

import com.alejandro.membergetmember.api.dto.referral.ReferralResponse;
import com.alejandro.membergetmember.domain.entity.Referral;

public class ReferralMapper {

    public static ReferralResponse toResponse(Referral referral) {
        ReferralResponse response = new ReferralResponse();
        response.setId(referral.getId());
        response.setReferrerId(referral.getReferrer().getId());
        response.setReferredId(referral.getReferred().getId());
        response.setCreatedAt(referral.getCreatedAt());
        return response;
    }
}
