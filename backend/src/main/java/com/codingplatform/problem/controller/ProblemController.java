package com.codingplatform.problem.controller;

import com.codingplatform.problem.dto.ProblemRequest;
import com.codingplatform.problem.dto.ProblemResponse;
import com.codingplatform.problem.service.ProblemService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    // Create Problem (Admin Only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProblemResponse> createProblem(
            @RequestBody ProblemRequest request) {

        return ResponseEntity.ok(
                problemService.createProblem(request)
        );
    }

    // Get All Problems
    @GetMapping
    public ResponseEntity<List<ProblemResponse>> getAllProblems() {

        return ResponseEntity.ok(
                problemService.getAllProblems()
        );
    }

    // Get Problem By ID
    @GetMapping("/{id}")
    public ResponseEntity<ProblemResponse> getProblemById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                problemService.getProblemById(id)
        );
    }

    // Update Problem (Admin Only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProblemResponse> updateProblem(
            @PathVariable Long id,
            @RequestBody ProblemRequest request) {

        return ResponseEntity.ok(
                problemService.updateProblem(id, request)
        );
    }

    // Delete Problem (Admin Only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteProblem(
            @PathVariable Long id) {

        problemService.deleteProblem(id);

        return ResponseEntity.ok("Problem deleted successfully");
    }
}