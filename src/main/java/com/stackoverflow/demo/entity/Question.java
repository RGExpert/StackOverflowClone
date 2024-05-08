package com.stackoverflow.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "question")
@Data
@NoArgsConstructor
public class Question {
    @Id
    @Column(name = "q_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qId;

    @ManyToOne()
    @JoinColumn(name = "u_id")
    private User userId;

    @Column(name = "title")
    private String title;

    @Column(name = "creation_date")
    private Timestamp creationDate;

    @Column(name = "text")
    private String text;
    @Column(name = "image_path")
    private String imagePath;
}
