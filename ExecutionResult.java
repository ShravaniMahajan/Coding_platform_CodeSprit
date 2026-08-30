package com.platform.service.execution;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExecutionResult {
    private ExecutionOutcome outcome;
    private String stdout;
    private String stderr;
    private long executionTimeMs;
}
