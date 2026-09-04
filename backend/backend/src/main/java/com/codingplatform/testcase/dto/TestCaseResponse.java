package com.codingplatform.testcase.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TestCaseResponse {

    private Long id;

    private Long problemId;

    private String input;

    private String expectedOutput;

    private Boolean isHidden;
}
