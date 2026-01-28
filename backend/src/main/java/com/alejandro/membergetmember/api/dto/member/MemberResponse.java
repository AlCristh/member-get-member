package com.alejandro.membergetmember.api.dto.member;

public class MemberResponse {

    private Long id;
    private String name;
    private String email;
    private String referralCode;
    private Integer credits;

    public MemberResponse(
            Long id,
            String name,
            String email,
            String referralCode,
            Integer credits) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.referralCode = referralCode;
        this.credits = credits;
    }

    // getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getReferralCode() {
        return referralCode;
    }

    public Integer getCredits() {
        return credits;
    }
}
