package com.codingplatform.execution.controller;

import com.codingplatform.execution.dto.ExecutionRequest;
import com.codingplatform.execution.dto.ExecutionResponse;
import com.codingplatform.execution.service.DockerExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execution")
@RequiredArgsConstructor
public class ExecutionController {

    private final DockerExecutionService dockerExecutionService;

    @PostMapping("/run")
    public ResponseEntity<ExecutionResponse> runCode(@RequestBody RunRequest request) {
        ExecutionRequest execRequest = ExecutionRequest.builder()
                .code(request.getCode())
                .language(request.getLanguage())
                .stdinInput(request.getInput())
                .build();
        ExecutionResponse response = dockerExecutionService.executeCode(execRequest);
        return ResponseEntity.ok(response);
    }

    @lombok.Data
    public static class RunRequest {
        private Long problemId;
        private String code;
        private com.codingplatform.common.ProgrammingLanguage language;
        private String input;
    }
}
