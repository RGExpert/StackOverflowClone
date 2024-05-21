package com.stackoverflow.demo.service;

import com.stackoverflow.demo.entity.Question;
import com.stackoverflow.demo.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getAllQuestions(){
        return (List<Question>) this.questionRepository.findAll();
    }

    public Question getQuestionById(Long id){
        Optional<Question> question = this.questionRepository.findById(id);
        return question.orElse(null);
    }

    public Question addQuestion(Question question){
        return this.questionRepository.save(question);
    }

    public Question updateQuestion(Question question){
        Optional<Question> questionDb = this.questionRepository.findById(question.getQId());
        if(questionDb.isPresent()){
            Question questionToUpdate = questionDb.get();

            questionToUpdate.setText(question.getText());
            questionToUpdate.setTitle(question.getTitle());
            //questionToUpdate.setCreationDate(question.getCreationDate());
            //questionToUpdate.setUserId(question.getUserId());
            if (question.getImagePath() != null) {
                questionToUpdate.setImagePath(question.getImagePath());
            }
            return this.questionRepository.save(questionToUpdate);
        }else {
            return null;
        }
    }
    public Integer getOverallRating(Long qId){
        return this.questionRepository.getOverallRating(qId);
    }

    public String deleteQuestionById(Long id){
        try {
            this.questionRepository.deleteById(id);
            return "Successfully deleted";
        } catch (Exception e) {
            return "Delete failed";
        }
    }
}
