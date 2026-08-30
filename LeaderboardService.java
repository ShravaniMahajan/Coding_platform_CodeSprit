package com.platform.service;

import com.platform.dto.leaderboard.LeaderboardResponse;
import com.platform.entity.Leaderboard;
import com.platform.entity.User;
import com.platform.exception.ResourceNotFoundException;
import com.platform.repository.LeaderboardRepository;
import com.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;
    private final UserRepository userRepository;

    @Transactional
    public void recordAcceptedSolve(Long userId, int scoreGained) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setSolvedProblems(user.getSolvedProblems() + 1);
        user.setTotalScore(user.getTotalScore() + scoreGained);
        userRepository.save(user);

        Leaderboard entry = leaderboardRepository.findByUser_UserId(userId)
                .orElseGet(() -> Leaderboard.builder().user(user).totalScore(0).build());
        entry.setTotalScore(entry.getTotalScore() + scoreGained);
        leaderboardRepository.save(entry);

        recalculateRanks();
    }

    @Transactional
    public void recalculateRanks() {
        List<Leaderboard> entries = leaderboardRepository.findAllByOrderByTotalScoreDesc();
        int rank = 1;
        for (Leaderboard entry : entries) {
            entry.setRank(rank++);
        }
        leaderboardRepository.saveAll(entries);
    }

    @Transactional(readOnly = true)
    public List<LeaderboardResponse> getGlobalLeaderboard() {
        return leaderboardRepository.findAllByOrderByTotalScoreDesc().stream()
                .map(entry -> LeaderboardResponse.builder()
                        .rank(entry.getRank())
                        .userId(entry.getUser().getUserId())
                        .fullName(entry.getUser().getFullName())
                        .totalScore(entry.getTotalScore())
                        .solvedProblems(entry.getUser().getSolvedProblems())
                        .lastUpdated(entry.getLastUpdated())
                        .build())
                .toList();
    }
}
