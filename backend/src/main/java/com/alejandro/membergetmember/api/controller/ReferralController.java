package com.alejandro.membergetmember.api.controller;

import com.alejandro.membergetmember.api.dto.referral.ReferralCreateRequest;
import com.alejandro.membergetmember.api.dto.referral.ReferralInviteRequest;
import com.alejandro.membergetmember.api.dto.referral.ReferralResponse;
import com.alejandro.membergetmember.api.mapper.ReferralMapper;
import com.alejandro.membergetmember.domain.entity.Referral;
import com.alejandro.membergetmember.security.SecurityUtils;
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

    // (debug antigo) cria CONVIDADO apontando pra um member existente
    @PostMapping
    public ResponseEntity<ReferralResponse> create(@RequestBody @Valid ReferralCreateRequest request) {
        Referral referral = referralService.createReferral(
                request.getReferralCode(),
                request.getReferredMemberId());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ReferralMapper.toResponse(referral));
    }

    // ✅ convite por email (CONVIDADO)
    @PostMapping("/invite")
    public ResponseEntity<ReferralResponse> invite(@RequestBody @Valid ReferralInviteRequest request) {
        String email = SecurityUtils.getCurrentUserEmail();

        Referral referral = referralService.inviteByEmail(email, request.getInvitedEmail());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ReferralMapper.toResponse(referral));
    }

    // ✅ reenviar convite (incrementa resend_count)
    @PostMapping("/{id}/resend")
    public ResponseEntity<ReferralResponse> resend(@PathVariable("id") Long id) {
        String email = SecurityUtils.getCurrentUserEmail();

        Referral referral = referralService.resend(email, id);

        return ResponseEntity.ok(ReferralMapper.toResponse(referral));
    }

    // admin/debug
    @GetMapping
    public ResponseEntity<List<ReferralResponse>> findAll() {
        return ResponseEntity.ok(referralService.findAll());
    }

    // ✅ FRONT deve usar
    @GetMapping("/my")
    public ResponseEntity<List<ReferralResponse>> myReferrals() {
        String email = SecurityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(referralService.findMyReferrals(email));
    }
}
