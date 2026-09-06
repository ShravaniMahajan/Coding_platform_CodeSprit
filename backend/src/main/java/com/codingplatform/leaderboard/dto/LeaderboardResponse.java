package com.codingplatform.leaderboard.dto;

public record LeaderboardResponse(
        int rank,
        Long userId,
        String username,
        int problemsSolved,
        int totalScore,
        double acceptanceRate,
        Long fastestSubmissionTimeMs
) {}
