package com.codingplatform.testcase.service;

import com.codingplatform.problem.entity.Problem;
import com.codingplatform.problem.repository.ProblemRepository;
import com.codingplatform.testcase.dto.TestCaseRequest;
import com.codingplatform.testcase.dto.TestCaseResponse;
import com.codingplatform.testcase.entity.TestCase;
import com.codingplatform.testcase.repository.TestCaseRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestCaseService {

    private final TestCaseRepository testCaseRepository;
    private final ProblemRepository problemRepository;

    public TestCaseService(
            TestCaseRepository testCaseRepository,
            ProblemRepository problemRepository) {

        this.testCaseRepository = testCaseRepository;
        this.problemRepository = problemRepository;
    }

    // Create Test Case
    public TestCaseResponse createTestCase(TestCaseRequest request) {

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() ->
                        new RuntimeException("Problem not found"));

        TestCase testCase = new TestCase();

        testCase.setProblem(problem);
        testCase.setInput(request.getInput());
        testCase.setExpectedOutput(request.getExpectedOutput());
        testCase.setIsHidden(request.isHidden());

        TestCase savedTestCase = testCaseRepository.save(testCase);

        return convertToResponse(savedTestCase);
    }

    // Get Test Case By ID
    public TestCaseResponse getTestCaseById(Long id) {

        TestCase testCase = testCaseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Test case not found"));

        return convertToResponse(testCase);
    }

    // Get Test Cases By Problem
    public List<TestCaseResponse> getTestCasesByProblem(Long problemId) {

        return testCaseRepository.findByProblemId(problemId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Update Test Case
    public TestCaseResponse updateTestCase(
            Long id,
            TestCaseRequest request) {

        TestCase testCase = testCaseRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Test case not found"));

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() ->
                        new RuntimeException("Problem not found"));

        testCase.setProblem(problem);
        testCase.setInput(request.getInput());
        testCase.setExpectedOutput(request.getExpectedOutput());
        testCase.setIsHidden(request.isHidden());

        TestCase updatedTestCase = testCaseRepository.save(testCase);

        return convertToResponse(updatedTestCase);
    }

    // Delete Test Case
    public void deleteTestCase(Long id) {

        if (!testCaseRepository.existsById(id)) {
            throw new RuntimeException("Test case not found");
        }

        testCaseRepository.deleteById(id);
    }

    // Convert Entity to Response DTO
    private TestCaseResponse convertToResponse(TestCase testCase) {

        return new TestCaseResponse(
                testCase.getId(),
                testCase.getProblem().getId(),
                testCase.getInput(),
                testCase.getExpectedOutput(),
                testCase.getIsHidden()
        );
    }
}
