package com.stackoverflow.demo.controller.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class RatingRequest {
    private Boolean rating;

    public RatingRequest(Boolean rating) {
        this.rating = rating;
    }
}