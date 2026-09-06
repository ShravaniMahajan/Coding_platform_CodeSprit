package com.codingplatform.hint.dto;

public record EditorialResponse(
        Long problemId,
        boolean unlocked,
        String editorial,
        long failedAttempts,
        int requiredAttempts
) {}
