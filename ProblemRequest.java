package com.platform.dto.problem;

import com.platform.entity.Difficulty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ProblemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    private String category;
    private String topicTags;
    private String inputFormat;
    private String outputFormat;
    private String constraints;
    private String sampleInput;
    private String sampleOutput;
    private String starterCode;
    private Integer timeLimitMs;
    private Integer memoryLimitMb;
    private Integer marks;

    @Valid
    private List<TestCaseRequest> testCases;
}
