package com.stackoverflow.demo.controller;

import com.stackoverflow.demo.model.EmailDetails;
import com.stackoverflow.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/sendMail")
    public String sendMail(@RequestBody EmailDetails emailDetails){
        return this.emailService.sendSimpleMail(emailDetails);
    }

}
