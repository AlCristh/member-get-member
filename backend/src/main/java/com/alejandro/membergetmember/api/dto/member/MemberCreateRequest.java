package com.alejandro.membergetmember.api.dto.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class MemberCreateRequest {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    private String referredByCode;

    // getters e setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getReferredByCode() {
        return referredByCode;
    }

    public void setReferredByCode(String referredByCode) {
        this.referredByCode = referredByCode;
    }
}
