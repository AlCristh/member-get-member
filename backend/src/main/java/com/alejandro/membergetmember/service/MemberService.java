package com.alejandro.membergetmember.service;

import com.alejandro.membergetmember.api.dto.member.MemberCreateRequest;
import com.alejandro.membergetmember.api.dto.member.MemberResponse;;;

public interface MemberService {

    MemberResponse create(MemberCreateRequest request);

}
