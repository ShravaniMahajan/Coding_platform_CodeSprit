package com.codingplatform.submission.controller;

import com.codingplatform.submission.dto.SubmissionRequest;
import com.codingplatform.submission.dto.SubmissionResponse;
import com.codingplatform.submission.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    // Submit code for a problem
    @PostMapping
    public ResponseEntity<SubmissionResponse> submitCode(
            @Valid @RequestBody SubmissionRequest request,
            Authentication authentication) {

        String userEmail = authentication.getName();
        return ResponseEntity.ok(submissionService.submitCode(userEmail, request));
    }

    // Get submission by ID
    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponse> getSubmissionById(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmissionById(id));
    }

    // Get all submissions of the logged-in user
    @GetMapping("/user")
    public ResponseEntity<List<SubmissionResponse>> getUserSubmissions(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(submissionService.getUserSubmissions(userEmail));
    }

    // Get all submissions for a specific problem
    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByProblem(@PathVariable Long problemId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByProblem(problemId));
    }

    // Get all submissions
    @GetMapping
    public ResponseEntity<List<SubmissionResponse>> getAllSubmissions() {
        return ResponseEntity.ok(submissionService.getAllSubmissions());
    }
}
