package com.codingplatform.problem.dto;

import com.codingplatform.problem.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProblemRequest {

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