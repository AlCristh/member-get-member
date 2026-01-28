package com.alejandro.membergetmember.api.dto.referral;

import java.time.LocalDateTime;

public class ReferralResponse {

    private Long id;
    private Long referrerId;
    private Long referredId;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReferrerId() {
        return referrerId;
    }

    public void setReferrerId(Long referrerId) {
        this.referrerId = referrerId;
    }

    public Long getReferredId() {
        return referredId;
    }

    public void setReferredId(Long referredId) {
        this.referredId = referredId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
