package com.codingplatform.testcase.controller;

import com.codingplatform.testcase.dto.TestCaseRequest;
import com.codingplatform.testcase.dto.TestCaseResponse;
import com.codingplatform.testcase.service.TestCaseService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testcases")
public class TestCaseController {

    private final TestCaseService testCaseService;

    public TestCaseController(TestCaseService testCaseService) {
        this.testCaseService = testCaseService;
    }

    // Create Test Case (Admin Only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestCaseResponse> createTestCase(
            @RequestBody TestCaseRequest request) {

        return ResponseEntity.ok(
                testCaseService.createTestCase(request)
        );
    }

    // Get Test Case By ID
    @GetMapping("/{id}")
    public ResponseEntity<TestCaseResponse> getTestCaseById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                testCaseService.getTestCaseById(id)
        );
    }

    // Get Test Cases By Problem
    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<TestCaseResponse>> getTestCasesByProblem(
            @PathVariable Long problemId) {

        return ResponseEntity.ok(
                testCaseService.getTestCasesByProblem(problemId)
        );
    }

    // Update Test Case (Admin Only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TestCaseResponse> updateTestCase(
            @PathVariable Long id,
            @RequestBody TestCaseRequest request) {

        return ResponseEntity.ok(
                testCaseService.updateTestCase(id, request)
        );
    }

    // Delete Test Case (Admin Only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteTestCase(
            @PathVariable Long id) {

        testCaseService.deleteTestCase(id);

        return ResponseEntity.ok(
                "Test case deleted successfully"
        );
    }
}

