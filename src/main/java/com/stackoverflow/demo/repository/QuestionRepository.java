package com.stackoverflow.demo.repository;

import com.stackoverflow.demo.entity.Question;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Long> {
    @Override
    @Query(value = "SELECT * from question ORDER BY creation_date DESC ",nativeQuery = true)
    Iterable<Question> findAll();
}
