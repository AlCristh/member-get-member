package com.alejandro.membergetmember.api.controller;

import com.alejandro.membergetmember.api.dto.referral.ReferralCreateRequest;
import com.alejandro.membergetmember.api.dto.referral.ReferralResponse;
import com.alejandro.membergetmember.api.mapper.ReferralMapper;
import com.alejandro.membergetmember.domain.entity.Referral;
import com.alejandro.membergetmember.service.ReferralService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referrals")
public class ReferralController {

    private final ReferralService referralService;

    public ReferralController(ReferralService referralService) {
        this.referralService = referralService;
    }

    @PostMapping
    public ResponseEntity<ReferralResponse> create(@RequestBody @Valid ReferralCreateRequest request) {

        Referral referral = referralService.createReferral(
                request.getReferralCode(),
                request.getReferredMemberId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ReferralMapper.toResponse(referral));
    }

    @GetMapping
    public ResponseEntity<List<ReferralResponse>> findAll() {
        return ResponseEntity.ok(referralService.findAll());
    }
}
