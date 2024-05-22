package com.stackoverflow.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "answer")
@Data
@NoArgsConstructor
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "a_id")
    private Long answerId;

    @ManyToOne
    @JoinColumn(name = "q_id")
    private Question questionId;

    @ManyToOne
    @JoinColumn(name = "u_id")
    private User userId;

    @Column(name = "text")
    private String text;

    @Column(name = "creation_date")
    private String creationDate;

    @Column(name = "image_path")
    private String imagePath;

}
