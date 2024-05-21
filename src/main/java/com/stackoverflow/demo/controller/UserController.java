package com.stackoverflow.demo.controller;

import com.stackoverflow.demo.controller.dto.RatingRequest;
import com.stackoverflow.demo.entity.User;
import com.stackoverflow.demo.securingweb.UserPrincipal;
import com.stackoverflow.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/principal")
    @ResponseBody
    public User getUserFromPrincipal(@AuthenticationPrincipal UserPrincipal userPrincipal){
        return this.userService.getUserById(userPrincipal.getUserId());
    }

    @GetMapping("/getAll")
    @ResponseBody
    public List<User> getAllUsers(){
        return this.userService.getAllUsers();
    }

    @GetMapping("/getById/{id}")
    @ResponseBody
    public User getUserById(@PathVariable Long id){
        return this.userService.getUserById(id);
    }

    @GetMapping("/getByUserName/{username}")
    @ResponseBody
    public User getUserById(@PathVariable String username){
        return this.userService.getByUsername(username);
    }

    @PostMapping("/addUser")
    @ResponseBody
    public User addUser(@RequestBody User user){
        return this.userService.addUser(user);
    }

    @PutMapping("/updateUser")
    @ResponseBody
    public User updateUser(@RequestBody User user){
        return this.userService.updateUser(user,user.getUserId());
    }


    @DeleteMapping("/deleteUser")
    @ResponseBody
    public String deleteUser(@RequestParam Long id){
        return this.userService.deleteUserById(id);
    }

    @GetMapping("/userQuestionRating/{id}")
    @ResponseBody
    public Boolean getUserRatingForQuestion(@PathVariable Long id,@AuthenticationPrincipal UserPrincipal userPrincipal){
        return this.userService.getUserRating(id,userPrincipal.getUserId(),0);
    }

    @GetMapping("/userAnswerRating/{id}")
    @ResponseBody
    public Boolean getUserRatingForAnswer(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal userPrincipal){
        return this.userService.getUserRating(id,userPrincipal.getUserId(),1);
    }

    @PutMapping("/updateQuestionRating/{id}")
    @ResponseBody
    public void addQuestionRating(@RequestBody RatingRequest ratingRequest,@PathVariable Long id,@AuthenticationPrincipal UserPrincipal userPrincipal){
        this.userService.addRating(0,ratingRequest.getRating(),id,userPrincipal.getUserId());
    }

    @PutMapping("/updateAnswerRating/{id}")
    @ResponseBody
    public void addAnswerRating(@RequestBody RatingRequest ratingRequest,@PathVariable Long id,@AuthenticationPrincipal UserPrincipal userPrincipal){
        this.userService.addRating(1,ratingRequest.getRating(),id,userPrincipal.getUserId());
    }

    @GetMapping("/getUserScore/{id}")
    @ResponseBody
    public Double getUserScore(@PathVariable("id") Long userId){
        return this.userService.getUserScore(userId);
    }

}
