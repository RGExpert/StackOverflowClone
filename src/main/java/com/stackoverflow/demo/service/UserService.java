package com.stackoverflow.demo.service;

import com.stackoverflow.demo.entity.User;
import com.stackoverflow.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers(){
        return (List<User>) this.userRepository.findAll();
    }

    public User getUserById(Long id){
        Optional<User> user = this.userRepository.findById(id);
        return user.orElse(null);
    }

    public User addUser(User user){
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
