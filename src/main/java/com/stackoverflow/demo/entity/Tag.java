package com.stackoverflow.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@Table(name = "tag")
public class Tag {

    @Column(name = "t_id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tagId;

    @Column(name = "tag_name")
    private String tagName;

    public Tag(String tagName) {
        this.tagName = tagName;
    }
}
