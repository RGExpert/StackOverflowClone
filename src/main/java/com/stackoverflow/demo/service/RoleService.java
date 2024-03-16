package com.stackoverflow.demo.service;

import com.stackoverflow.demo.entity.Role;
import com.stackoverflow.demo.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public Role getRole(Long id){
        Optional<Role> role = this.roleRepository.findById(id);
        return role.orElseGet(
                        () -> this.roleRepository.getRegular());
    }
}
