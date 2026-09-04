package com.codingplatform.execution.dto;

import com.codingplatform.common.ProgrammingLanguage;
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
public class ExecutionRequest {

    private String code;
    private ProgrammingLanguage language;
    private String stdinInput;

    @Builder.Default
    private int timeLimitSeconds = 5;

    @Builder.Default
    private int memoryLimitMb = 256;
}
