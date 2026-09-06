package com.platform.dto.submission;

import com.platform.entity.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResponse {
    private Long submissionId;
    private Long problemId;
    private String problemTitle;
    private String language;
    private LocalDateTime submittedAt;
    private SubmissionStatus status;
    private Integer passedTestcases;
    private Integer totalTestcases;
    private BigDecimal executionTimeMs;
    private BigDecimal memoryUsedMb;
    private Integer score;
}
