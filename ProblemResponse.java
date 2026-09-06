package com.platform.dto.problem;

import com.platform.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemResponse {
    private Long problemId;
    private String title;
    private String description;
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
    private LocalDateTime createdAt;
    // Only visible (sample) test cases are exposed to non-admin users
    private List<TestCaseResponse> visibleTestCases;
}
