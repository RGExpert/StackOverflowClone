package com.stackoverflow.demo.repository;

import com.stackoverflow.demo.entity.Answer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends CrudRepository<Answer,Long> {

    @Query(value = "SELECT DISTINCT * FROM answer where q_id = :id")
    List<Answer> findAnswersByQuestionId(@Param("id") Long id);
}
