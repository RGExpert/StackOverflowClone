package com.stackoverflow.demo.controller;

import com.stackoverflow.demo.entity.Answer;
import com.stackoverflow.demo.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/answers")
public class AnswerController {
    @Autowired
    private AnswerService answerService;

    @GetMapping("/getAll")
    @ResponseBody
    public List<Answer> getAllAnswers(){
        return this.answerService.getAllAnswers();
    }

    @GetMapping("/question/{id}")
    @ResponseBody
    public List<Answer> getAnswersForQuestion(@PathVariable Long id){
        return this.answerService.getAnswersByQuestionId(id);
    }

    @PostMapping("/addAnswer")
    @ResponseBody
    public Answer addAnswer(@RequestBody Answer answer){
        return this.answerService.addAnswer(answer);
    }

    @PutMapping("/updateAnswer")
    @ResponseBody
    public Answer updateAnswer(@RequestBody Answer answer){
        return this.answerService.updateAnswer(answer,answer.getAnswerId());
    }

    @DeleteMapping("/deleteAnswer")
    @ResponseBody
    public void deleteAnswer(@RequestParam Long id){
        this.answerService.deleteAnswerById(id);
    }
}
