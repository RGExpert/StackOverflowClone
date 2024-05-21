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

    @Query(value = "SELECT\n" +
            "    2.5 * COUNT(CASE WHEN pr.rating = 1 AND pr.post_type = 0 THEN 1 END) +\n" +
            "    5.0 * COUNT(CASE WHEN pr.rating = 1 AND pr.post_type = 1 THEN 1 END) -\n" +
            "    1.5 * COUNT(CASE WHEN pr.rating = 0 AND pr.post_type = 0 THEN 1 END) -\n" +
            "    2.5 * COUNT(CASE WHEN pr.rating = 0 AND pr.post_type = 1 THEN 1 END) -\n" +
            "    1.5 * (SELECT COUNT(*)\n" +
            "           FROM\n" +
            "            answer a1 JOIN post_rating p on p.post_type=1 and a1.a_id = p.post_id\n" +
            "            WHERE\n" +
            "                p.u_id = :userId\n" +
            "                AND\n" +
            "                a1.u_id != :userId\n" +
            "                AND\n" +
            "                p.rating = 0\n" +
            "           )\n" +
            "FROM\n" +
            "    post_rating pr\n" +
            "\n" +
            "LEFT OUTER JOIN answer a2 on pr.post_id = a2.a_id\n" +
            "LEFT OUTER JOIN question q on pr.post_id = q.q_id\n" +
            "WHERE\n" +
            "    (a2.u_id  = :userId AND pr.post_type = 1)\n" +
            "    OR\n" +
            "    (q.u_id = :userId AND pr.post_type = 0)",
    nativeQuery = true)
    Double getUserScore(@Param("userId") Long userId);

    @Query(value = "SELECT\n" +
            "    banned\n" +
            "FROM\n" +
            "    user_app\n" +
            "WHERE\n" +
            "    u_id = :userId",
    nativeQuery = true)
    Boolean getBannedStatus(@Param("userId") Long userId);


}
