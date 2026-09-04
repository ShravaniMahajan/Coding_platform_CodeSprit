package com.codingplatform.hint.service;

import org.springframework.stereotype.Service;

import com.codingplatform.hint.dto.EditorialResponse;
import com.codingplatform.hint.dto.HintResponse;
import com.codingplatform.problem.entity.Problem;
import com.codingplatform.problem.repository.ProblemRepository;
import com.codingplatform.submission.entity.SubmissionStatus;
import com.codingplatform.submission.repository.SubmissionRepository;
import com.codingplatform.user.entity.User;
import com.codingplatform.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HintService {

    private static final int DEFAULT_REQUIRED_ATTEMPTS = 3;

    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;


    // GET HINT
    public HintResponse getHint(Long problemId) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException(
                        "Problem not found with id: " + problemId));

        return new HintResponse(problemId, problem.getHints());
    }


    // GET EDITORIAL (unlocks after N failed attempts)
    public EditorialResponse getEditorial(Long problemId, String userEmail) {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException(
                        "Problem not found with id: " + problemId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException(
                        "User not found: " + userEmail));

        int requiredAttempts = problem.getEditorialUnlockAttempts() != null
                ? problem.getEditorialUnlockAttempts()
                : DEFAULT_REQUIRED_ATTEMPTS;

        // Count submissions that are NOT accepted (i.e. failed attempts)
        long totalSubmissions = submissionRepository
                .countByUserIdAndProblemIdAndStatus(
                        user.getId(),
                        problemId,
                        SubmissionStatus.ACCEPTED
                );

        // Count all submissions for this user+problem
        long allSubmissions = submissionRepository
                .countByUserId(user.getId());

        // Failed attempts = total - accepted
        long failedAttempts = submissionRepository
                .countByUserIdAndProblemIdAndStatus(
                        user.getId(),
                        problemId,
                        SubmissionStatus.WRONG_ANSWER
                )
                + submissionRepository.countByUserIdAndProblemIdAndStatus(
                        user.getId(),
                        problemId,
                        SubmissionStatus.RUNTIME_ERROR
                )
                + submissionRepository.countByUserIdAndProblemIdAndStatus(
                        user.getId(),
                        problemId,
                        SubmissionStatus.TIME_LIMIT_EXCEEDED
                )
                + submissionRepository.countByUserIdAndProblemIdAndStatus(
                        user.getId(),
                        problemId,
                        SubmissionStatus.COMPILATION_ERROR
                )
                + submissionRepository.countByUserIdAndProblemIdAndStatus(
                        user.getId(),
                        problemId,
                        SubmissionStatus.MEMORY_LIMIT_EXCEEDED
                );

        boolean unlocked = failedAttempts >= requiredAttempts;

        return new EditorialResponse(
                problemId,
                unlocked,
                unlocked ? problem.getEditorial() : null,
                failedAttempts,
                requiredAttempts
        );
    }
}
