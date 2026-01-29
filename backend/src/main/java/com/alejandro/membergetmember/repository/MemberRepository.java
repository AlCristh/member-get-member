package com.alejandro.membergetmember.repository;

import com.alejandro.membergetmember.domain.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    Optional<Member> findByReferralCode(String referralCode);

    List<Member> findAllByOrderByCreditsDescCreatedAtAsc();
    
    boolean existsByEmail(String email);
}
