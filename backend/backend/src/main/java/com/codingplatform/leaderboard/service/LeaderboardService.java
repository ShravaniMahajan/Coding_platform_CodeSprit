package com.codingplatform.leaderboard.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.codingplatform.leaderboard.dto.LeaderboardResponse;
import com.codingplatform.leaderboard.entity.LeaderboardEntry;
import com.codingplatform.leaderboard.repository.LeaderboardRepository;
import com.codingplatform.problem.entity.Difficulty;
import com.codingplatform.submission.entity.Submission;
import com.codingplatform.submission.entity.SubmissionStatus;
import com.codingplatform.submission.repository.SubmissionRepository;
import com.codingplatform.user.entity.User;
import com.codingplatform.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;


    // GET GLOBAL LEADERBOARD
    public List<LeaderboardResponse> getGlobalLeaderboard() {

        refreshLeaderboard();

        List<LeaderboardEntry> entries =
                leaderboardRepository
                        .findAllByOrderByTotalScoreDescProblemsSolvedDesc();

        return convertToResponse(entries);
    }


    // REFRESH ALL LEADERBOARD DATA
    public void refreshLeaderboard() {

        List<User> users = userRepository.findAll();

        for (User user : users) {
            updateLeaderboardForUser(user);
        }
    }


    // UPDATE ONE USER
    public void updateLeaderboardForUser(User user) {

        List<Submission> allSubmissions =
                submissionRepository
                        .findByUserIdOrderByCreatedAtDesc(user.getId());

        List<Submission> acceptedSubmissions =
                submissionRepository
                        .findByUserIdAndStatus(user.getId(), SubmissionStatus.ACCEPTED);


        // Find unique solved problems
        Set<Long> solvedProblemIds =
                acceptedSubmissions.stream()
                        .map(s -> s.getProblem().getId())
                        .collect(Collectors.toSet());

        int problemsSolved = solvedProblemIds.size();

        // Calculate score
        int totalScore = calculateScore(acceptedSubmissions);

        // Calculate acceptance rate
        double acceptanceRate =
                calculateAcceptanceRate(allSubmissions.size(), acceptedSubmissions.size());

        // Find fastest accepted submission — executionTime is in seconds (Double),
        // convert to milliseconds (Long) to match the DB column
        Long fastestSubmissionTime =
                acceptedSubmissions.stream()
                        .map(Submission::getExecutionTime)
                        .filter(t -> t != null)
                        .min(Double::compareTo)
                        .map(t -> (long) (t * 1000))
                        .orElse(null);


        LeaderboardEntry entry =
                leaderboardRepository
                        .findByUserId(user.getId())
                        .orElseGet(LeaderboardEntry::new);

        entry.setUser(user);
        entry.setProblemsSolved(problemsSolved);
        entry.setTotalScore(totalScore);
        entry.setAcceptanceRate(acceptanceRate);
        entry.setFastestSubmissionTimeMs(fastestSubmissionTime);

        leaderboardRepository.save(entry);
    }


    // CALCULATE SCORE (first accepted submission per problem only)
    private int calculateScore(List<Submission> acceptedSubmissions) {

        Map<Long, Submission> firstAccepted = new HashMap<>();

        for (Submission submission : acceptedSubmissions) {
            Long problemId = submission.getProblem().getId();
            firstAccepted.putIfAbsent(problemId, submission);
        }

        int totalScore = 0;

        for (Submission submission : firstAccepted.values()) {
            Difficulty difficulty = submission.getProblem().getDifficulty();
            totalScore += getDifficultyScore(difficulty);
        }

        return totalScore;
    }


    // DIFFICULTY SCORE
    private int getDifficultyScore(Difficulty difficulty) {

        if (difficulty == null) {
            return 0;
        }

        return switch (difficulty) {
            case EASY   -> 10;
            case MEDIUM -> 20;
            case HARD   -> 30;
        };
    }


    // ACCEPTANCE RATE
    private double calculateAcceptanceRate(int totalSubmissions, int acceptedSubmissions) {

        if (totalSubmissions == 0) {
            return 0.0;
        }

        return ((double) acceptedSubmissions / totalSubmissions) * 100;
    }


    // CONVERT ENTITY TO DTO
    private List<LeaderboardResponse> convertToResponse(List<LeaderboardEntry> entries) {

        List<LeaderboardResponse> result = new java.util.ArrayList<>();

        for (int i = 0; i < entries.size(); i++) {
            LeaderboardEntry entry = entries.get(i);
            result.add(new LeaderboardResponse(
                    i + 1,
                    entry.getUser().getId(),
                    entry.getUser().getUsername(),
                    entry.getProblemsSolved(),
                    entry.getTotalScore(),
                    entry.getAcceptanceRate(),
                    entry.getFastestSubmissionTimeMs()
            ));
        }

        return result;
    }
}
