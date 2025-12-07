package controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class RootController {

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return "<html><body><h1>Fonte da Juventude 2.0</h1><p>API em execução...</p><p>Endpoints:</p><ul><li>/users - Gerenciamento de usuários</li><li>/patients - Gerenciamento de pacientes</li><li>/plans - Gerenciamento de planos</li></ul></body></html>";
    }

    @GetMapping("/health")
    @ResponseBody
    public String health() {
        return "{\"status\": \"UP\"}";
    }
}
