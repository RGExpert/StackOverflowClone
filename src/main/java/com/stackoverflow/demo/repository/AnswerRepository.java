package com.stackoverflow.demo.repository;

import com.stackoverflow.demo.entity.Answer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends CrudRepository<Answer,Long> {

    @Query(value = "SELECT DISTINCT * from answer where q_id = :id",nativeQuery = true)
    List<Answer> findAnswersByQuestionId(@Param("id") Long id);

    @Query(value = "SELECT\n" +
            "    COUNT(CASE WHEN rating = 1 THEN 1 END) -\n" +
            "    COUNT(CASE WHEN rating = 0 THEN 1 END) AS overallRating\n" +
            "FROM\n" +
            "    post_rating\n" +
            "WHERE\n" +
            "    post_id = :aId\n" +
            "    AND post_type = 1;\n",
            nativeQuery = true)
    Integer getOverallRating(@Param("aId") Long aId);
}
