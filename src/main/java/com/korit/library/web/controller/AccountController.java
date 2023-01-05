package com.korit.library.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.lang.annotation.Retention;

@Controller
@RequestMapping("/account")
public class AccountController {

    @GetMapping("/login")
    public String loadIndex(){
        return "account/login";
    }
    @GetMapping("/register")
    public String register(){
        return "account/register";
    }

}
