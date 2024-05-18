package com.stackoverflow.demo.controller;

import com.stackoverflow.demo.entity.User;
import com.stackoverflow.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

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
}
