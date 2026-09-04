package com.codingplatform.leaderboard.entity;

import com.codingplatform.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "leaderboard_entries")
@Getter
@Setter
@NoArgsConstructor
public class LeaderboardEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private int problemsSolved = 0;

    @Column(nullable = false)
    private int totalScore = 0;

    @Column(nullable = false)
    private double acceptanceRate = 0.0;

    @Column(name = "fastest_submission_time_ms")
    private Long fastestSubmissionTimeMs;
}
