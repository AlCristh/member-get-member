package com.alejandro.membergetmember.service;

import com.alejandro.membergetmember.api.dto.member.MemberCreateRequest;
import com.alejandro.membergetmember.api.dto.member.MemberResponse;
import java.util.List;

public interface MemberService {

    MemberResponse create(MemberCreateRequest request);

    List<MemberResponse> findAll();
}
