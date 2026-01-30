package com.alejandro.membergetmember.api.controller;

import com.alejandro.membergetmember.api.dto.member.MemberResponse;
import com.alejandro.membergetmember.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    public ResponseEntity<List<MemberResponse>> findAll() {
        return ResponseEntity.ok(memberService.findAll());
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<MemberResponse>> ranking() {
        return ResponseEntity.ok(memberService.getRanking());
    }
}
