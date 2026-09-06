package com.codingplatform.leaderboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codingplatform.leaderboard.entity.LeaderboardEntry;

@Repository
public interface LeaderboardRepository
        extends JpaRepository<LeaderboardEntry, Long> {

    Optional<LeaderboardEntry> findByUserId(Long userId);

    List<LeaderboardEntry> findAllByOrderByTotalScoreDescProblemsSolvedDesc();
}
