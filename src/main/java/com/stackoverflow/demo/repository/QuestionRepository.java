package com.stackoverflow.demo.repository;

import com.stackoverflow.demo.entity.Question;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Long> {
    @Override
    @Query(value = "SELECT * from question ORDER BY creation_date DESC ",nativeQuery = true)
    Iterable<Question> findAll();

    @Query(value = "SELECT\n" +
            "    COUNT(CASE WHEN rating = 1 THEN 1 END) -\n" +
            "    COUNT(CASE WHEN rating = 0 THEN 1 END) AS overallRating\n" +
            "FROM\n" +
            "    post_rating\n" +
            "WHERE\n" +
            "    post_id = :qId\n" +
            "    AND post_type = 0;\n",
    nativeQuery = true)
    Integer getOverallRating(@Param("qId") Long qId);
}
