package com.codingplatform.problem.dto;

import com.codingplatform.problem.entity.Difficulty;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProblemResponse {

    private Long id;

    private String title;

    private String description;

    private Difficulty difficulty;

    private String inputFormat;

    private String outputFormat;

    private String constraints;

    private String topic;

    private String starterCodeJava;

    private String starterCodePython;

    private String starterCodeCpp;

    private String starterCodeJavascript;

    private String editorial;

    private String hints;

    private Integer editorialUnlockAttempts;
}