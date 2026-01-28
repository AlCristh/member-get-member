package com.alejandro.membergetmember.api.dto.referral;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReferralCreateRequest {

    @NotBlank
    private String referralCode;

    @NotNull
    private Long referredMemberId;

    public String getReferralCode() {
        return referralCode;
    }

    public void setReferralCode(String referralCode) {
        this.referralCode = referralCode;
    }

    public Long getReferredMemberId() {
        return referredMemberId;
    }

    public void setReferredMemberId(Long referredMemberId) {
        this.referredMemberId = referredMemberId;
    }
}
