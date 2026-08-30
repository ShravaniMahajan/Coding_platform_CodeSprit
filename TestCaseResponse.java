package com.platform.dto.problem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCaseResponse {
    private Long testcaseId;
    private String input;
    private String expectedOutput;
    private Boolean isSample;
}
