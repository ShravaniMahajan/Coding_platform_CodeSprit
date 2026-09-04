package com.codingplatform.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LanguageUsageResponse {
    private String language;
    private Long submissionCount;
}
