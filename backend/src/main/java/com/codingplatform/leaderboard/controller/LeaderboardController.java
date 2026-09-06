package com.codingplatform.leaderboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codingplatform.leaderboard.dto.LeaderboardResponse;
import com.codingplatform.leaderboard.service.LeaderboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;


    @GetMapping("/global")
    public ResponseEntity<List<LeaderboardResponse>> getGlobalLeaderboard() {

        return ResponseEntity.ok(
                leaderboardService.getGlobalLeaderboard()
        );
    }


    // Optional admin/manual refresh
    @GetMapping("/refresh")
    public ResponseEntity<String> refreshLeaderboard() {

        leaderboardService.refreshLeaderboard();

        return ResponseEntity.ok("Leaderboard refreshed successfully");
    }
}
