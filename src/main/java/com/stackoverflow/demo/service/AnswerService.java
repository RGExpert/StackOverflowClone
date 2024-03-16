package com.stackoverflow.demo.service;

import com.stackoverflow.demo.entity.Answer;
import com.stackoverflow.demo.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnswerService {
    @Autowired
    private AnswerRepository answerRepository;

    public List<Answer> getAnswersByQuestionId(Long id){
        return this.answerRepository.findAnswersByQuestionId(id);
    }

    public List<Answer> getAllAnswers(){
        return (List<Answer>) this.answerRepository.findAll();
    }

    public Answer addAnswer(Answer answer){
        return this.answerRepository.save(answer);
    }

    public Answer updateAnswer(Answer answer,Long id){
        Optional<Answer> answerDb = this.answerRepository.findById(id);

        if(answerDb.isPresent()){
            Answer answerToUpdate = answerDb.get();

            answerToUpdate.setText(answer.getText());
            answerToUpdate.setImagePath(answer.getImagePath());

            return this.answerRepository.save(answerToUpdate);
        } else{
            return null;
        }
    }

    public String deleteAnswerById(Long id){
        try {
            this.deleteAnswerById(id);
            return "Successfully deleted";
        } catch (Exception e) {
            return "Deletion failed";
        }
    }
}
