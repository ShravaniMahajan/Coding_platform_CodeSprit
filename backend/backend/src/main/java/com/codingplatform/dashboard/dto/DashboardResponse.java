package com.codingplatform.dashboard.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardResponse {
    private Long totalProblemsSolved;
    private Long easyProblemsSolved;
    private Long mediumProblemsSolved;
    private Long hardProblemsSolved;
    private Long totalSubmissions;
    private Long acceptedSubmissions;
    private Double successRate;
    private List<LanguageUsageResponse> languageUsage;
    private List<RecentSubmissionResponse> recentSubmissions;
    private List<SubmissionHeatmapResponse> submissionHeatmap;
    private Integer currentRank;
}
