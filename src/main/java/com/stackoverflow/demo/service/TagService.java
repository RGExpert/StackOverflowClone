package com.stackoverflow.demo.service;

import com.stackoverflow.demo.entity.Tag;
import com.stackoverflow.demo.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    public List<Tag> getTagsByQuestionId(Long QId){
        return (List<Tag>) this.tagRepository.getTagsByQuestionId(QId);
    }

    public List<Tag> getAll(){
        return (List<Tag>) this.tagRepository.findAll();
    }

    @Transactional
    public List<Tag> addTagsToQuestion(Long qid, List<String> tagNames) {
        this.tagRepository.deleteAllByQid(qid);
        for (String tag: tagNames) {
            Optional<Long> tagOptional= this.tagRepository.getTagIdByTagName(tag);
            if(tagOptional.isEmpty()){
                this.tagRepository.save(new Tag(tag));
                tagOptional= this.tagRepository.getTagIdByTagName(tag);
            }
            this.tagRepository.saveQuestionTag(qid,tagOptional.get());

        }
        return null;
    }
}
