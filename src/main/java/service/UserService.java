package org.example;

// Adicione estes imports explicitamente se o IntelliJ não os fizer
import org.example.User;
import org.example.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

// ... (Restante do código)

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registra um novo usuário no sistema, criptografando a senha antes de salvar.
     */
    public User registerNewUser(User newUser) {

        String rawPassword;
        rawPassword = newUser.getPasswordHash();
        String hashedPassword = passwordEncoder.encode(rawPassword);
        newUser.setPasswordHash(hashedPassword);

        return userRepository.save(newUser);
    }
}