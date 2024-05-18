package com.stackoverflow.demo.repository;

import com.stackoverflow.demo.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User,Long> {
    @Query(value =  "SELECT * from user_app\n" +
                    "where user_name = :user_name\n" +
                    "LIMIT 1",
                    nativeQuery = true)
    Optional<User> findByUserName(@Param("user_name") String username);
}
