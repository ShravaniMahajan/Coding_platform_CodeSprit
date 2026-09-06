package com.codingplatform.submission.service;

import com.codingplatform.execution.dto.ExecutionRequest;
import com.codingplatform.execution.dto.ExecutionResponse;
import com.codingplatform.execution.service.DockerExecutionService;
import com.codingplatform.submission.entity.Submission;
import com.codingplatform.submission.entity.SubmissionStatus;
import com.codingplatform.submission.repository.SubmissionRepository;
import com.codingplatform.submissionresult.entity.SubmissionResult;
import com.codingplatform.submissionresult.entity.TestCaseStatus;
import com.codingplatform.submissionresult.repository.SubmissionResultRepository;
import com.codingplatform.testcase.entity.TestCase;
import com.codingplatform.testcase.repository.TestCaseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionProcessorService {

    private final SubmissionRepository submissionRepository;
    private final TestCaseRepository testCaseRepository;
    private final SubmissionResultRepository submissionResultRepository;
    private final DockerExecutionService dockerExecutionService;

    @Transactional
    public void processSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId).orElse(null);
        if (submission == null) {
            log.error("Submission not found for ID: {}", submissionId);
            return;
        }

        List<TestCase> testCases = testCaseRepository.findByProblemId(submission.getProblem().getId());
        if (testCases.isEmpty()) {
            submission.setStatus(SubmissionStatus.ACCEPTED);
            submissionRepository.save(submission);
            return;
        }

        boolean allPassed = true;
        SubmissionStatus finalStatus = SubmissionStatus.ACCEPTED;
        long totalExecutionTime = 0;
        long maxExecutionTime = 0;

        for (TestCase tc : testCases) {
            ExecutionRequest execRequest = ExecutionRequest.builder()
                    .code(submission.getCode())
                    .language(submission.getLanguage())
                    .stdinInput(tc.getInput())
                    .timeLimitSeconds(5)
                    .memoryLimitMb(256)
                    .build();

            ExecutionResponse execResponse = dockerExecutionService.executeCode(execRequest);
            totalExecutionTime += execResponse.getExecutionTimeMs();
            maxExecutionTime = Math.max(maxExecutionTime, execResponse.getExecutionTimeMs());

            TestCaseStatus testCaseStatus;
            String errorMessage = null;
            String actualOutput = execResponse.getStdout() != null ? execResponse.getStdout().trim() : "";
            String expectedOutput = tc.getExpectedOutput() != null ? tc.getExpectedOutput().trim() : "";

            if (execResponse.isTimedOut()) {
                testCaseStatus = TestCaseStatus.TIME_LIMIT_EXCEEDED;
                errorMessage = "Time limit exceeded (5s)";
                allPassed = false;
                if (finalStatus == SubmissionStatus.ACCEPTED) {
                    finalStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
                }
            } else if (!execResponse.isCompiledSuccessfully()) {
                testCaseStatus = TestCaseStatus.FAILED;
                errorMessage = execResponse.getCompileError();
                allPassed = false;
                if (finalStatus == SubmissionStatus.ACCEPTED) {
                    finalStatus = SubmissionStatus.COMPILATION_ERROR;
                }
            } else if (execResponse.getExitCode() != 0) {
                testCaseStatus = TestCaseStatus.RUNTIME_ERROR;
                errorMessage = execResponse.getStderr();
                allPassed = false;
                if (finalStatus == SubmissionStatus.ACCEPTED) {
                    finalStatus = SubmissionStatus.RUNTIME_ERROR;
                }
            } else if (actualOutput.equals(expectedOutput)) {
                testCaseStatus = TestCaseStatus.PASSED;
            } else {
                testCaseStatus = TestCaseStatus.FAILED;
                errorMessage = "Output mismatch. Expected: [" + expectedOutput + "] but got: [" + actualOutput + "]";
                allPassed = false;
                if (finalStatus == SubmissionStatus.ACCEPTED) {
                    finalStatus = SubmissionStatus.WRONG_ANSWER;
                }
            }

            SubmissionResult result = new SubmissionResult();
            result.setSubmissionId(submission.getId());
            result.setTestCase(tc);
            result.setStatus(testCaseStatus);
            result.setActualOutput(actualOutput);
            result.setExecutionTimeMs(execResponse.getExecutionTimeMs());
            result.setMemoryUsedKb(execResponse.getMemoryUsedKb());
            result.setErrorMessage(errorMessage);

            submissionResultRepository.save(result);
        }

        submission.setStatus(allPassed ? SubmissionStatus.ACCEPTED : finalStatus);
        submission.setExecutionTime((double) maxExecutionTime);
        submissionRepository.save(submission);
        log.info("Finished processing submission ID: {} with status: {}", submissionId, submission.getStatus());
    }
}
