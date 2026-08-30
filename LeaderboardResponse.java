package com.platform.dto.leaderboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardResponse {
    private Integer rank;
    private Long userId;
    private String fullName;
    private Integer totalScore;
    private Integer solvedProblems;
    private LocalDateTime lastUpdated;
}
