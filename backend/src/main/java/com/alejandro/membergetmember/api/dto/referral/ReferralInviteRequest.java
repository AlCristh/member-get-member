package com.alejandro.membergetmember.api.dto.referral;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class ReferralInviteRequest {

    @NotBlank
    @Email
    private String invitedEmail;

    public String getInvitedEmail() {
        return invitedEmail;
    }

    public void setInvitedEmail(String invitedEmail) {
        this.invitedEmail = invitedEmail;
    }
}
