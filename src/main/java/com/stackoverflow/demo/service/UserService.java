package com.stackoverflow.demo.service;

import com.stackoverflow.demo.entity.User;
import com.stackoverflow.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<User> getAllUsers(){
        return (List<User>) this.userRepository.findAll();
    }

    public User getByUsername(String username){
        Optional<User> user = this.userRepository.findByUserName(username);
        return user.orElse(null);
    }

    public User getUserById(Long id){
        Optional<User> user = this.userRepository.findById(id);
        return user.orElse(null);
    }

    public User addUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return this.userRepository.save(user);
    }

    @Transactional
    public User updateUser(User user, Long id){
        Optional<User> userDb = this.userRepository.findById(id);
        if(userDb.isPresent()){
            User userToUpdate=userDb.get();

            userToUpdate.setUserName(user.getUserName());
            userToUpdate.setRole(user.getRole());
            userToUpdate.setPassword(user.getPassword());

            return this.userRepository.save(userToUpdate);
        } else {
            return null;
        }
    }

    public String deleteUserById(Long id){
        try {
            this.userRepository.deleteById(id);
            return "Successfully deleted";
        } catch (Exception e) {
            return "Deletion failed";
        }
    }


}
