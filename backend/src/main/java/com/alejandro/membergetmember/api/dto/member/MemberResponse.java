package com.alejandro.membergetmember.api.dto.member;

public class MemberResponse {

    private Long id;
    private String name;
    private String email;
    private String referralCode;

    public MemberResponse(Long id, String name, String email, String referralCode) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.referralCode = referralCode;
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
}
