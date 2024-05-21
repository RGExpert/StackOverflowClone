package com.stackoverflow.demo.repository;

import com.stackoverflow.demo.entity.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    @Query(value = "SELECT * from user_app\n" +
            "where user_name = :user_name\n" +
            "LIMIT 1",
            nativeQuery = true)
    Optional<User> findByUserName(@Param("user_name") String username);

    @Query(value = "SELECT IFNULL(\n" +
            "           (SELECT rating\n" +
            "            FROM post_rating\n" +
            "            WHERE post_id = :pId\n" +
            "              AND u_id = :uId\n" +
            "              AND post_type = :post_type\n" +
            "            LIMIT 1),\n" +
            "           NULL) AS rating;",
            nativeQuery = true)
    Integer getUserRating(@Param("pId") Long pId, @Param("uId") Long uId,@Param("post_type") Integer post_type);

    @Modifying
    @Query(value = "INSERT INTO stackoverflow.post_rating (post_type, rating, post_id, u_id) VALUES (:post_t, :r, :id, :u_id)"
    ,nativeQuery = true)
    void addRating(@Param("post_t") Integer post_type,@Param("r") Integer rating,@Param("id") Long postId, @Param("u_id") Long userId);

    @Modifying
    @Query(value = "UPDATE stackoverflow.post_rating t SET t.rating = :new_rating WHERE t.post_type = :rating AND t.post_id = :post_id AND t.u_id = :user_id",
            nativeQuery = true)
    void updateRating(@Param("rating") Integer rating, @Param("post_id") Long qId, @Param("user_id")Long uId,@Param("new_rating") Integer newRating);


}
