package com.alejandro.membergetmember.api.mapper;

import com.alejandro.membergetmember.api.dto.member.MemberResponse;
import com.alejandro.membergetmember.domain.entity.Member;

public class MemberMapper {

    public static MemberResponse toResponse(Member member) {
        return new MemberResponse(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getReferralCode(),
                member.getCredits());
    }
}
