package com.alejandro.membergetmember.service.impl;

import  com.alejandro.membergetmember.api.dto.member.MemberCreateRequest;
import  com.alejandro.membergetmember.api.dto.member.MemberResponse;
import com.alejandro.membergetmember.api.mapper.MemberMapper;
import com.alejandro.membergetmember.domain.entity.Member;
import com.alejandro.membergetmember.repository.MemberRepository;
import com.alejandro.membergetmember.service.MemberService;
import java.util.List;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    public MemberServiceImpl(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Override
    public MemberResponse create(MemberCreateRequest request) {

        // valida e-mail duplicado
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        // converte DTO para entidade
        Member member = MemberMapper.toEntity(request);

        // gera código de indicação próprio
        member.setReferralCode(generateReferralCode());

        // salva no banco
        Member saved = memberRepository.save(member);

        // retorna DTO de resposta
        return MemberMapper.toResponse(saved);
    }

    private String generateReferralCode() {
        return UUID.randomUUID()
                .toString()
                .substring(0, 8)
                .toUpperCase();
    }

    @Override
    public List<MemberResponse> findAll() {
        return memberRepository.findAll()
                .stream()
                .map(MemberMapper::toResponse)
                .toList();
    }

}
