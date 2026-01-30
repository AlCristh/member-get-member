package com.alejandro.membergetmember.repository;

import com.alejandro.membergetmember.domain.entity.Member;
import com.alejandro.membergetmember.domain.entity.Referral;
import com.alejandro.membergetmember.domain.enums.ReferralStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReferralRepository extends JpaRepository<Referral, Long> {

    boolean existsByReferred(Member referred);

    List<Referral> findAllByReferrer(Member referrer);

    Optional<Referral> findFirstByReferrerAndInvitedEmailIgnoreCaseAndStatus(
            Member referrer,
            String invitedEmail,
            ReferralStatus status);

  
    boolean existsByReferrerAndInvitedEmailIgnoreCaseAndStatus(
            Member referrer,
            String invitedEmail,
            ReferralStatus status);
}
