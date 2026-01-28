package com.alejandro.membergetmember.repository;

import com.alejandro.membergetmember.domain.entity.Member;
import com.alejandro.membergetmember.domain.entity.Referral;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReferralRepository extends JpaRepository<Referral, Long> {

    boolean existsByReferred(Member referred);

    Optional<Referral> findByReferred(Member referred);
}
