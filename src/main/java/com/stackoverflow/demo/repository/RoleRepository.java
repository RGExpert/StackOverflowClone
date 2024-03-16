package com.stackoverflow.demo.repository;

import com.stackoverflow.demo.entity.Role;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {
    @Query(value = "SELECT * from role where role_name = 'Regular' LIMIT 1",
            nativeQuery = true)
    Role getRegular();
}
