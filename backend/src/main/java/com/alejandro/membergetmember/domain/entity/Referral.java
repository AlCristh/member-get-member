package com.alejandro.membergetmember.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.alejandro.membergetmember.domain.enums.ReferralStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "referrals")
@Getter
@Setter
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quem indicou
    @ManyToOne(optional = false)
    @JoinColumn(name = "referrer_id")
    private Member referrer;

    // Quem foi indicado
    @ManyToOne(optional = false)
    @JoinColumn(name = "referred_id", unique = true)
    private Member referred;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ReferralStatus.CADASTRADO;
        }
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReferralStatus status;

}
