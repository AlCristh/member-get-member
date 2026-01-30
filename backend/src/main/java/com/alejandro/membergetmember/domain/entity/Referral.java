package com.alejandro.membergetmember.domain.entity;

import com.alejandro.membergetmember.domain.enums.ReferralStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "referrals")
@Getter
@Setter
public class Referral {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // quem indicou
    @ManyToOne(optional = false)
    @JoinColumn(name = "referrer_id", nullable = false)
    private Member referrer;

    // quem foi indicado (pode ser null no caso de convite antes do cadastro)
    @ManyToOne(optional = true)
    @JoinColumn(name = "referred_id", unique = true, nullable = true)
    private Member referred;

    // email convidado (para o caso CONVIDADO antes de existir Member)
    @Column(name = "invited_email")
    private String invitedEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReferralStatus status;

    // quando o convite foi criado
    @Column(name = "invited_at")
    private LocalDateTime invitedAt;

    // quando de fato se cadastrou (conversão)
    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    // quando o crédito foi aplicado (impede crédito duplicado)
    @Column(name = "credited_at")
    private LocalDateTime creditedAt;

    // quantos reenvios já foram feitos
    @Column(name = "resend_count", nullable = false, columnDefinition = "integer default 0")
    private Integer resendCount = 0;

    // data do último reenvio
    @Column(name = "last_resent_at")
    private LocalDateTime lastResentAt;

    // created_at (mantém compatibilidade com seu front que já mostra)
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();

        if (this.createdAt == null)
            this.createdAt = now;

        // se é convite e ainda não setaram invitedAt
        if (this.invitedAt == null && this.status == ReferralStatus.CONVIDADO) {
            this.invitedAt = now;
        }

        if (this.resendCount == null)
            this.resendCount = 0;

        // fallback de segurança
        if (this.status == null)
            this.status = ReferralStatus.CONVIDADO;
    }
}
