package com.codingplatform.execution.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExecutionResponse {

    private String stdout;
    private String stderr;
    private int exitCode;
    private long executionTimeMs;
    private long memoryUsedKb;
    private boolean timedOut;
    private boolean compiledSuccessfully;
    private String compileError;
}
