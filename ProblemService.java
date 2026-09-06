package com.platform.service;

import com.platform.dto.problem.ProblemRequest;
import com.platform.dto.problem.ProblemResponse;
import com.platform.dto.problem.TestCaseRequest;
import com.platform.entity.Difficulty;
import com.platform.entity.Problem;
import com.platform.entity.TestCase;
import com.platform.exception.ResourceNotFoundException;
import com.platform.mapper.ProblemMapper;
import com.platform.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final ProblemMapper problemMapper;

    @Transactional(readOnly = true)
    public List<ProblemResponse> getAllProblems(boolean isAdmin) {
        return problemRepository.findAll().stream()
                .map(p -> problemMapper.toResponse(p, isAdmin))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProblemResponse getProblemById(Long id, boolean isAdmin) {
        Problem problem = findProblemOrThrow(id);
        return problemMapper.toResponse(problem, isAdmin);
    }

    @Transactional(readOnly = true)
    public List<ProblemResponse> getProblemsByDifficulty(Difficulty difficulty, boolean isAdmin) {
        return problemRepository.findByDifficulty(difficulty).stream()
                .map(p -> problemMapper.toResponse(p, isAdmin))
                .toList();
    }

    @Transactional
    public ProblemResponse createProblem(ProblemRequest request) {
        Problem problem = Problem.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .difficulty(request.getDifficulty())
                .category(request.getCategory())
                .topicTags(request.getTopicTags())
                .inputFormat(request.getInputFormat())
                .outputFormat(request.getOutputFormat())
                .constraints(request.getConstraints())
                .sampleInput(request.getSampleInput())
                .sampleOutput(request.getSampleOutput())
                .starterCode(request.getStarterCode())
                .timeLimitMs(request.getTimeLimitMs() != null ? request.getTimeLimitMs() : 5000)
                .memoryLimitMb(request.getMemoryLimitMb() != null ? request.getMemoryLimitMb() : 512)
                .marks(request.getMarks() != null ? request.getMarks() : 100)
                .build();

        attachTestCases(problem, request.getTestCases());

        Problem saved = problemRepository.save(problem);
        return problemMapper.toResponse(saved, true);
    }

    @Transactional
    public ProblemResponse updateProblem(Long id, ProblemRequest request) {
        Problem problem = findProblemOrThrow(id);

        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());
        problem.setCategory(request.getCategory());
        problem.setTopicTags(request.getTopicTags());
        problem.setInputFormat(request.getInputFormat());
        problem.setOutputFormat(request.getOutputFormat());
        problem.setConstraints(request.getConstraints());
        problem.setSampleInput(request.getSampleInput());
        problem.setSampleOutput(request.getSampleOutput());
        problem.setStarterCode(request.getStarterCode());
        if (request.getTimeLimitMs() != null) problem.setTimeLimitMs(request.getTimeLimitMs());
        if (request.getMemoryLimitMb() != null) problem.setMemoryLimitMb(request.getMemoryLimitMb());
        if (request.getMarks() != null) problem.setMarks(request.getMarks());

        if (request.getTestCases() != null) {
            problem.getTestCases().clear();
            attachTestCases(problem, request.getTestCases());
        }

        Problem saved = problemRepository.save(problem);
        return problemMapper.toResponse(saved, true);
    }

    @Transactional
    public void deleteProblem(Long id) {
        Problem problem = findProblemOrThrow(id);
        problemRepository.delete(problem);
    }

    private void attachTestCases(Problem problem, List<TestCaseRequest> testCaseRequests) {
        if (testCaseRequests == null) {
            return;
        }
        for (TestCaseRequest tcRequest : testCaseRequests) {
            TestCase testCase = TestCase.builder()
                    .problem(problem)
                    .input(tcRequest.getInput())
                    .expectedOutput(tcRequest.getExpectedOutput())
                    .isSample(Boolean.TRUE.equals(tcRequest.getIsSample()))
                    .build();
            problem.getTestCases().add(testCase);
        }
    }

    private Problem findProblemOrThrow(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + id));
    }
}
