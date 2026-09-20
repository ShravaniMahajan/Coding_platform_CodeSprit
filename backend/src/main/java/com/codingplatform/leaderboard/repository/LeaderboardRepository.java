package com.codingplatform.leaderboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.codingplatform.common.Role;
import com.codingplatform.leaderboard.entity.LeaderboardEntry;

@Repository
public interface LeaderboardRepository
        extends JpaRepository<LeaderboardEntry, Long> {

    Optional<LeaderboardEntry> findByUserId(Long userId);

    // Only return entries for regular USER accounts (excludes ADMIN/test accounts)
    @Query("SELECT e FROM LeaderboardEntry e WHERE e.user.role = :role " +
           "ORDER BY e.totalScore DESC, e.problemsSolved DESC")
    List<LeaderboardEntry> findAllByUserRoleOrderByTotalScoreDescProblemsSolvedDesc(Role role);
}
