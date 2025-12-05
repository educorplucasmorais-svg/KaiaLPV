package org.example;

import org.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Informa ao Spring que esta é uma interface de acesso a dados
@Repository
// Estendemos JpaRepository, que nos dá métodos como save(), findAll(), delete()
public interface UserRepository extends JpaRepository<User, Long> {
    // Definimos um método personalizado que o Spring implementará automaticamente
    // Isso é essencial para buscar o usuário no processo de login
    User findByEmail(String email);
}