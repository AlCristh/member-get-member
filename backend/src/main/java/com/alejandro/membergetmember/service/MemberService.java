package com.alejandro.membergetmember.service;

import com.alejandro.membergetmember.api.dto.member.MemberResponse;

import java.util.List;

public interface MemberService {
    List<MemberResponse> findAll();

    List<MemberResponse> getRanking();
}
