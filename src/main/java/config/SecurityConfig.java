package org.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // <-- NOVO IMPORT
import org.springframework.security.crypto.password.PasswordEncoder;    // <-- NOVO IMPORT
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // --- 1. Bean para o PasswordEncoder (CRÍTICO PARA HASHING) ---
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Padrão da indústria
    }

    // --- 2. Configuração de Segurança (CSRF, Autorização) ---
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Desabilita CSRF para POST/PUT (apenas dev)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/**").permitAll() // Permite acesso a todas as rotas (incluindo /api/register)
                        .anyRequest().authenticated()
                );
        return http.build();
    }

    // --- 3. Configuração de CORS (Comunicação Frontend/Backend) ---
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                            "http://localhost:5173",
                            "https://kaia-lpv.vercel.app",
                            "https://*.vercel.app",
                            "https://dracybeleguedes.com.br"
                        )
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}