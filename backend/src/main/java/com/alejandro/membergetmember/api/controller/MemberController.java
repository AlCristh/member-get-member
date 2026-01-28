package com.alejandro.membergetmember.api.controller;

import com.alejandro.membergetmember.api.dto.member.MemberCreateRequest;
import com.alejandro.membergetmember.api.dto.member.MemberResponse;
import com.alejandro.membergetmember.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping
    public ResponseEntity<MemberResponse> create(
            @RequestBody @Valid MemberCreateRequest request) {
        MemberResponse response = memberService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
