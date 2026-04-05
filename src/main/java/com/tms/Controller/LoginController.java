package com.tms.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.tms.modal.Users;
import com.tms.repository.UserRepository;

@Controller
public class LoginController {

    @Autowired
    UserRepository userrepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // LOGIN PAGE
    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    // REGISTER PAGE
    @GetMapping("/Register")
    public String register() {
        return "Register";
    }

    // LOGOUT
    @PostMapping("/Logout")
    public String Logout() {
        return "login";
    }

    // REGISTRATION
    @PostMapping("/registration")
    public String registration(
            @RequestParam("userName") String username,
            @RequestParam("Password") String password,
            @RequestParam("role") String role,
            Model model) {

        if (userrepo.existsById(username)) {
            model.addAttribute("error", "Username already exists");
            return "register";
        }

        Users newUser = new Users();
        newUser.setUserName(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(role);

        if (userrepo.save(newUser) != null) {
            model.addAttribute("Status", "Successfully Registered");
        } else {
            model.addAttribute("error", "Registration failed");
        }

        return "login";
    }

    // DASHBOARD (DEFAULT AFTER LOGIN)
    @GetMapping("/dashboard")
    public String dashboardPage() {
        return "dashboard";   // dashboard.html
    }

    // TASK PAGE
    @GetMapping("/tasks")
    public String tasksPage() {
        return "TaskManagement";   // tasks.html
    }
}