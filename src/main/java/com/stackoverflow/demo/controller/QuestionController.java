package com.stackoverflow.demo.controller;

import com.stackoverflow.demo.controller.dto.RatingRequest;
import com.stackoverflow.demo.entity.Question;
import com.stackoverflow.demo.securingweb.UserPrincipal;
import com.stackoverflow.demo.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @GetMapping("/getAll")
    @ResponseBody
    public List<Question> getAllQuestions(){
        return this.questionService.getAllQuestions();
    }

    @GetMapping("/getById/{id}")
    @ResponseBody
    public Question getQuestionById(@PathVariable Long id){
        return this.questionService.getQuestionById(id);
    }

    @PostMapping("/addQuestion")
    @ResponseBody
    public Question addQuestion(@RequestBody Question question){
        return this.questionService.addQuestion(question);
    }

    @PutMapping("/updateQuestion")
    @ResponseBody
    public Question updateQuestion(@RequestBody Question question){
        return this.questionService.updateQuestion(question);
    }

    @DeleteMapping("/deleteQuestion")
    @ResponseBody
    public String deleteQuestion(@RequestParam Long id){
        return this.questionService.deleteQuestionById(id);
    }

    @GetMapping("/getRating/{id}")
    @ResponseBody
    public Integer getOverallRating(@PathVariable Long id){
        return this.questionService.getOverallRating(id);
    }
}
