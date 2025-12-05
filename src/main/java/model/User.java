package org.example.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor; // <--- GARANTIR ESTE IMPORT
import lombok.AllArgsConstructor;

//@Entity // <-- COMENTE ESTA LINHA TEMPORARIAMENTE
@Table(name = "users")
// ...
@Data
@NoArgsConstructor // <--- CRÍTICO: NECESSÁRIO PARA SPRING CONVERTER JSON EM OBJETO
@AllArgsConstructor
public class User {


    // Define a chave primária (Primary Key) da tabela
    @Id
    // Configura a geração automática do ID pelo banco de dados (MySQL)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash; // Armazenaremos o hash da senha aqui

    // Opcional: Para controle de acesso
    private String role;
}