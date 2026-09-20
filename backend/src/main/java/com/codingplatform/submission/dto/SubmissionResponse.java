package com.codingplatform.submission.dto;

import com.codingplatform.common.ProgrammingLanguage;
import com.codingplatform.submission.entity.SubmissionStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponse {

    private Long id;
    private Long userId;
    private String username;
    private Long problemId;
    private String problemTitle;
    private String problemDifficulty;
    private String code;
    private ProgrammingLanguage language;
    private SubmissionStatus status;
    private Double executionTime;
    private Long memoryUsed;
    private LocalDateTime createdAt;
}
