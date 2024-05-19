package com.stackoverflow.demo.controller;


import com.stackoverflow.demo.entity.Question;
import com.stackoverflow.demo.entity.Tag;
import com.stackoverflow.demo.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping("/GetForQid/{id}")
    @ResponseBody
    public List<Tag> getQuestionById(@PathVariable Long id){
        return this.tagService.getTagsByQuestionId(id);
    }

    @GetMapping("/getAll")
    @ResponseBody
    public List<Tag> getAll(){
        return this.tagService.getAll();
    }

    @PostMapping("/addTagsToQuestion/{qid}")
    @ResponseBody
    public List<Tag> addTags(@PathVariable Long qid,@RequestBody List<String> tagNames){
        return tagService.addTagsToQuestion(qid,tagNames);
    }
}
