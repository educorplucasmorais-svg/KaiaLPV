package model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "planos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String planCode; // Ex: PL-342

    @Column(nullable = false)
    private Long patientId; // Referência ao paciente

    @Column(length = 500)
    private String patientName; // Nome do paciente (para referência rápida)

    @Column(nullable = false, columnDefinition = "TEXT")
    private String goal; // Objetivo/observação do plano

    @Column(columnDefinition = "TEXT")
    private String treatments; // JSON array de tratamentos selecionados

    @Column(columnDefinition = "TEXT")
    private String essentialTreatments; // JSON array de tratamentos essenciais

    @Column(length = 50)
    private String status; // "Rascunho", "Emitido", "Revisão", "Concluído"

    @Column(columnDefinition = "LONGBLOB")
    private byte[] fileData; // PDF ou documento gerado

    @Column(length = 255)
    private String fileName; // Nome do arquivo

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "Rascunho";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
