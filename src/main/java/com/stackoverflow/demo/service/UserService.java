package com.stackoverflow.demo.service;

import com.stackoverflow.demo.entity.User;
import com.stackoverflow.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.Null;
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

    public List<User> getAllUsers() {
        return (List<User>) this.userRepository.findAll();
    }

    public User getByUsername(String username) {
        Optional<User> user = this.userRepository.findByUserName(username);
        return user.orElse(null);
    }

    public User getUserById(Long id) {
        Optional<User> user = this.userRepository.findById(id);
        return user.orElse(null);
    }

    public User addUser(User user) {
        user.setBanned(0);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return this.userRepository.save(user);
    }

    @Transactional
    public User updateUser(Integer newBannedStatus, Long id) {
        Optional<User> userDb = this.userRepository.findById(id);
        if (userDb.isPresent()) {
            User userToUpdate = userDb.get();

            userToUpdate.setBanned(newBannedStatus);

            return this.userRepository.save(userToUpdate);
        } else {
            return null;
        }
    }

    public String deleteUserById(Long id) {
        try {
            this.userRepository.deleteById(id);
            return "Successfully deleted";
        } catch (Exception e) {
            return "Deletion failed";
        }
    }

    public Boolean getUserRating(Long qId, Long uId, Integer postType) {
        Integer queryResult = this.userRepository.getUserRating(qId, uId, postType);
        //System.out.println(queryResult);
        if (queryResult == null) {
            return null;
        }
        switch (queryResult) {

            case 0 -> {
                return Boolean.FALSE;
            }
            case 1 -> {
                return Boolean.TRUE;
            }
            default -> {
                return null;
            }
        }
    }

    @Transactional
    public void addRating(Integer postType, Boolean rating, Long id, Long uId) {
        Integer intRating = null;
        if(rating != null){
            intRating = rating ? 1 : 0;
        } else {
            intRating = -1;
        }

        Integer currentRating = this.userRepository.getUserRating(id, uId, postType);
        if (currentRating != null) {
            this.userRepository.updateRating(postType, id, uId, intRating);
        } else {
            this.userRepository.addRating(postType, intRating, id, uId);
        }
    }

    public Double getUserScore(Long uId){
        return this.userRepository.getUserScore(uId);
    }

    public Boolean getBannedStatus(Long userId){
        return this.userRepository.getBannedStatus(userId);
    }



}
