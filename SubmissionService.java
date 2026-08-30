package com.platform.service;

import com.platform.dto.submission.SubmissionRequest;
import com.platform.dto.submission.SubmissionResponse;
import com.platform.entity.*;
import com.platform.exception.RateLimitExceededException;
import com.platform.exception.ResourceNotFoundException;
import com.platform.mapper.SubmissionMapper;
import com.platform.repository.*;
import com.platform.service.execution.CodeExecutionService;
import com.platform.service.execution.ExecutionOutcome;
import com.platform.service.execution.ExecutionResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionResultRepository submissionResultRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;
    private final CodeExecutionService codeExecutionService;
    private final SubmissionMapper submissionMapper;

    @Value("${app.submission.rate-limit.max-per-minute:5}")
    private int maxSubmissionsPerMinute;

    @Transactional
    public SubmissionResponse submit(Long userId, SubmissionRequest request) {
        enforceRateLimit(userId, request.getProblemId());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + request.getProblemId()));

        Submission submission = Submission.builder()
                .user(user)
                .problem(problem)
                .language(request.getLanguage())
                .sourceCode(request.getSourceCode())
                .build();
        submission = submissionRepository.save(submission);

        SubmissionResult pendingResult = SubmissionResult.builder()
                .submission(submission)
                .status(SubmissionStatus.PENDING)
                .totalTestcases(testCaseRepository.findByProblem_ProblemId(problem.getProblemId()).size())
                .build();
        submissionResultRepository.save(pendingResult);
        submission.setResult(pendingResult);

        // Evaluate synchronously so the caller gets a final verdict in the response.
        // For higher throughput, swap this call for evaluateAsync(...) and poll
        // GET /api/submissions/{id} for the result.
        evaluate(submission.getSubmissionId());

        Submission evaluated = submissionRepository.findById(submission.getSubmissionId())
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        return submissionMapper.toResponse(evaluated);
    }

    @Transactional
    public void evaluate(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        SubmissionResult result = submissionResultRepository.findBySubmission_SubmissionId(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission result not found"));

        result.setStatus(SubmissionStatus.RUNNING);
        submissionResultRepository.save(result);

        Problem problem = submission.getProblem();
        List<TestCase> testCases = testCaseRepository.findByProblem_ProblemId(problem.getProblemId());

        int passed = 0;
        SubmissionStatus finalStatus = SubmissionStatus.ACCEPTED;
        BigDecimal maxExecTime = BigDecimal.ZERO;

        for (TestCase testCase : testCases) {
            ExecutionResult execResult = codeExecutionService.execute(
                    submission.getLanguage(),
                    submission.getSourceCode(),
                    testCase.getInput(),
                    problem.getTimeLimitMs()
            );

            maxExecTime = maxExecTime.max(BigDecimal.valueOf(execResult.getExecutionTimeMs()));

            if (execResult.getOutcome() == ExecutionOutcome.COMPILATION_ERROR) {
                finalStatus = SubmissionStatus.COMPILATION_ERROR;
                break;
            }
            if (execResult.getOutcome() == ExecutionOutcome.TIME_LIMIT_EXCEEDED) {
                finalStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
                break;
            }
            if (execResult.getOutcome() == ExecutionOutcome.RUNTIME_ERROR) {
                finalStatus = SubmissionStatus.RUNTIME_ERROR;
                break;
            }
            if (normalize(execResult.getStdout()).equals(normalize(testCase.getExpectedOutput()))) {
                passed++;
            } else if (finalStatus == SubmissionStatus.ACCEPTED) {
                finalStatus = SubmissionStatus.WRONG_ANSWER;
            }
        }

        if (testCases.isEmpty()) {
            finalStatus = SubmissionStatus.WRONG_ANSWER;
        }

        int score = finalStatus == SubmissionStatus.ACCEPTED ? problem.getMarks() : 0;

        result.setStatus(finalStatus);
        result.setPassedTestcases(passed);
        result.setTotalTestcases(testCases.size());
        result.setExecutionTimeMs(maxExecTime);
        result.setScore(score);
        result.setEvaluatedAt(LocalDateTime.now());
        submissionResultRepository.save(result);

        if (finalStatus == SubmissionStatus.ACCEPTED) {
            leaderboardService.recordAcceptedSolve(submission.getUser().getUserId(), score);
        }
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getSubmissionsForUser(Long userId) {
        return submissionRepository.findByUser_UserIdOrderBySubmittedAtDesc(userId).stream()
                .map(submissionMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SubmissionResponse getSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionId));
        return submissionMapper.toResponse(submission);
    }

    private void enforceRateLimit(Long userId, Long problemId) {
        LocalDateTime oneMinuteAgo = LocalDateTime.now().minusMinutes(1);
        long recentCount = submissionRepository
                .countByUser_UserIdAndProblem_ProblemIdAndSubmittedAtAfter(userId, problemId, oneMinuteAgo);
        if (recentCount >= maxSubmissionsPerMinute) {
            throw new RateLimitExceededException(
                    "Submission rate limit exceeded: max " + maxSubmissionsPerMinute + " submissions per problem per minute");
        }
    }

    private String normalize(String text) {
        if (text == null) return "";
        return text.strip().replaceAll("\\s+", " ");
    }
}
