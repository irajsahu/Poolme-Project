package com.poolme.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.ui.Model;

@Controller
public class HomeController {

    @GetMapping("/find-passenger")
    public String findPassenger() {
        return "find-passenger"; // Load find-passenger.html (Create if needed)
    }
    // ✅ Show index page at root URL "/"
    @GetMapping("/")
    public String showIndex(Model model) {
        model.addAttribute("title", "Welcome to Pool Me");
        return "index"; // Loads src/main/resources/templates/index.html
    }

    // ✅ Show Home page after login/registration
    @GetMapping("/home")
    public String showHomePage() {
        return "home"; // Loads src/main/resources/templates/home.html
    }

    // ✅ Show Login Page
    @GetMapping("/login")
    public String login() {
        return "login"; // Loads src/main/resources/templates/login.html
    }

    // ✅ Show Register Page
    @GetMapping("/register")
    public String register() {
        return "register"; // Loads src/main/resources/templates/register.html
    }
}
