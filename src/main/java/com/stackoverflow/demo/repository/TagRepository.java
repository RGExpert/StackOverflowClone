package com.stackoverflow.demo.repository;


import com.stackoverflow.demo.entity.Tag;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface TagRepository extends CrudRepository<Tag,Long> {

    @Query(value = "SELECT t.* from tag t\n" +
            "JOIN question_tags qt on t.t_id = qt.t_id\n" +
            "where q_id = :q_id",
            nativeQuery = true)
    Iterable<Tag> getTagsByQuestionId(@Param("q_id") Long QId);

    @Query(value = "SELECT t_id from tag where tag_name = :name",nativeQuery = true)
    Optional<Long> getTagIdByTagName(@Param("name") String name);

    @Modifying
    @Query(value = "INSERT INTO question_tags (q_id, t_id) VALUES (:qId, :tId)", nativeQuery = true)
    void saveQuestionTag(@Param("qId") Long qId, @Param("tId") Long tId);

    @Modifying
    @Query(value = "DELETE FROM question_tags WHERE q_id = :qId",nativeQuery = true)
    void deleteAllByQid(@Param("qId") Long qId);
}
