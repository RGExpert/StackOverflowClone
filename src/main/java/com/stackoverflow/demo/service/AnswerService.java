package com.stackoverflow.demo.service;

import com.stackoverflow.demo.entity.Answer;
import com.stackoverflow.demo.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnswerService {
    @Autowired
    private AnswerRepository answerRepository;

    public List<Answer> getAnswersByQuestionId(Long id) {
        return this.answerRepository.findAnswersByQuestionId(id);
    }

    public List<Answer> getAllAnswers() {
        return (List<Answer>) this.answerRepository.findAll();
    }

    public Answer addAnswer(Answer answer) {
        return this.answerRepository.save(answer);
    }

    public Answer updateAnswer(Answer answer, Long id, Long userId, List<SimpleGrantedAuthority> authorities) {
        Optional<Answer> answerDb = this.answerRepository.findById(id);

        if (answerDb.isPresent()) {
            Answer answerToUpdate = answerDb.get();
            if(answerToUpdate.getUserId().getUserId() != userId && !authorities.contains(new SimpleGrantedAuthority("ADMIN"))){
                return null;
            }
            answerToUpdate.setText(answer.getText());

            if (answer.getImagePath() != null) {
                answerToUpdate.setImagePath(answer.getImagePath());
            }
            return this.answerRepository.save(answerToUpdate);
        } else {
            return null;
        }
    }

    public void deleteAnswerById(Long id,Long userId,List<SimpleGrantedAuthority> authorities) {
        try {
            Optional<Answer> answerOptional = this.answerRepository.findById(id);
            if(answerOptional.isPresent()){
                if(answerOptional.get().getUserId().getUserId() != userId
                        && !authorities.contains(new SimpleGrantedAuthority("ADMIN"))){
                    return;
                }
            }
            this.answerRepository.deleteById(id);
            //return "Successfully deleted";
        } catch (Exception e) {
            //return "Deletion failed";
        }
    }

    public Integer getOverallRating(Long qId){
        return this.answerRepository.getOverallRating(qId);
    }
}
