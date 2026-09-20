package com.codingplatform.dashboard.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.codingplatform.dashboard.dto.DashboardResponse;
import com.codingplatform.dashboard.dto.LanguageUsageResponse;
import com.codingplatform.dashboard.dto.RecentSubmissionResponse;
import com.codingplatform.dashboard.dto.SubmissionHeatmapResponse;
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
public class DashboardService {

    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;
    private final LeaderboardRepository leaderboardRepository;


    public DashboardResponse getDashboard() {

        User user = getCurrentUser();

        List<Submission> submissions =
                submissionRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                user.getId()
                        );


        List<Submission> acceptedSubmissions =
                submissions.stream()
                        .filter(submission ->
                                submission.getStatus()
                                        == SubmissionStatus.ACCEPTED
                        )
                        .toList();


        // TOTAL UNIQUE PROBLEMS SOLVED
        Set<Long> solvedProblemIds =
                acceptedSubmissions.stream()
                        .map(submission ->
                                submission.getProblem().getId()
                        )
                        .collect(Collectors.toSet());


        long totalProblemsSolved =
                solvedProblemIds.size();


        // EASY SOLVED
        long easyProblemsSolved =
                getSolvedCountByDifficulty(
                        acceptedSubmissions,
                        Difficulty.EASY
                );


        // MEDIUM SOLVED
        long mediumProblemsSolved =
                getSolvedCountByDifficulty(
                        acceptedSubmissions,
                        Difficulty.MEDIUM
                );


        // HARD SOLVED
        long hardProblemsSolved =
                getSolvedCountByDifficulty(
                        acceptedSubmissions,
                        Difficulty.HARD
                );


        long totalSubmissions =
                submissions.size();


        long acceptedSubmissionCount =
                acceptedSubmissions.size();
     // SUCCESS RATE
        double successRate = totalSubmissions == 0
                ? 0.0
                : ((double) acceptedSubmissionCount
                        / totalSubmissions) * 100;


        List<LanguageUsageResponse> languageUsage =
                getLanguageUsage(submissions);


        List<RecentSubmissionResponse> recentSubmissions =
                getRecentSubmissions(submissions);


        List<SubmissionHeatmapResponse> heatmap =
                getSubmissionHeatmap(submissions);


        Integer currentRank =
                getCurrentRank(user.getId());


        return new DashboardResponse(

                totalProblemsSolved,

                easyProblemsSolved,

                mediumProblemsSolved,

                hardProblemsSolved,

                totalSubmissions,

                acceptedSubmissionCount,

                Math.round(successRate * 100.0) / 100.0,

                languageUsage,

                recentSubmissions,

                heatmap,

                currentRank
        );
    }


    private long getSolvedCountByDifficulty(
            List<Submission> acceptedSubmissions,
            Difficulty difficulty) {

        return acceptedSubmissions.stream()

                .filter(submission ->
                        submission.getProblem()
                                .getDifficulty()
                                == difficulty
                )

                .map(submission ->
                        submission.getProblem().getId()
                )

                .distinct()

                .count();
    }


    private List<LanguageUsageResponse>
            getLanguageUsage(
                    List<Submission> submissions) {

        Map<String, Long> languageCount =
                submissions.stream()

                        .collect(
                                Collectors.groupingBy(

                                        submission ->
                                                submission
                                                        .getLanguage()
                                                        .name(),

                                        Collectors.counting()
                                )
                        );


        return languageCount.entrySet()

                .stream()

                .sorted(
                        Map.Entry
                                .<String, Long>comparingByValue()
                                .reversed()
                )

                .map(entry ->
                        new LanguageUsageResponse(

                                entry.getKey(),

                                entry.getValue()
                        )
                )

                .toList();
    }


    private List<RecentSubmissionResponse>
            getRecentSubmissions(
                    List<Submission> submissions) {

        return submissions.stream()

                .sorted(
                        Comparator.comparing(
                                Submission::getCreatedAt
                        ).reversed()
                )

                .limit(10)

                .map(submission ->
                        new RecentSubmissionResponse(

                                submission.getId(),

                                submission.getProblem().getId(),

                                submission.getProblem().getTitle(),

                                submission.getLanguage().name(),

                                submission.getStatus(),

                                submission.getExecutionTime() != null ? submission.getExecutionTime().longValue() : null,

                                submission.getCreatedAt()
                        )
                )

                .toList();
    }


    private List<SubmissionHeatmapResponse>
            getSubmissionHeatmap(
                    List<Submission> submissions) {

        Map<LocalDate, Long> submissionByDate =
                submissions.stream()
                .filter(submission ->
                submission.getCreatedAt() != null
        )

        .collect(
                Collectors.groupingBy(

                        submission ->
                                submission
                                        .getCreatedAt()
                                        .toLocalDate(),

                        Collectors.counting()
                )
        );


return submissionByDate.entrySet()

.stream()

.sorted(
        Map.Entry.comparingByKey()
)

.map(entry ->
        new SubmissionHeatmapResponse(

                entry.getKey(),

                entry.getValue()
        )
)

.toList();
}


private Integer getCurrentRank(
Long userId) {

List<LeaderboardEntry> entries =
leaderboardRepository
        .findAllByUserRoleOrderByTotalScoreDescProblemsSolvedDesc(
                com.codingplatform.common.Role.USER);


for (int i = 0; i < entries.size(); i++) {

if (entries.get(i)
    .getUser()
    .getId()
    .equals(userId)) {

return i + 1;
}
}


return null;
}


private User getCurrentUser() {

Authentication authentication =
SecurityContextHolder
        .getContext()
        .getAuthentication();


String email =
authentication.getName();


return userRepository
.findByEmail(email)

.orElseThrow(
        () -> new RuntimeException(
                "User not found"
        )
);
}
}
