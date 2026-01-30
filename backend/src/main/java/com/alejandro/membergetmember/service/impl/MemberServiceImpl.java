package com.alejandro.membergetmember.service.impl;

import com.alejandro.membergetmember.api.dto.member.MemberResponse;
import com.alejandro.membergetmember.api.mapper.MemberMapper;
import com.alejandro.membergetmember.repository.MemberRepository;
import com.alejandro.membergetmember.service.MemberService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public List<MemberResponse> findAll() {
        return memberRepository.findAll()
                .stream()
                .map(MemberMapper::toResponse)
                .toList();
    }

    @Override
    public List<MemberResponse> getRanking() {
        return memberRepository.findAllByOrderByCreditsDescCreatedAtAsc()
                .stream()
                .map(MemberMapper::toResponse)
                .toList();
    }
}
