package com.platform.controller;

import com.platform.dto.submission.SubmissionRequest;
import com.platform.dto.submission.SubmissionResponse;
import com.platform.security.UserPrincipal;
import com.platform.service.SubmissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Tag(name = "submission-controller", description = "Code submission and evaluation")
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    @Operation(summary = "Submit code for evaluation")
    public ResponseEntity<SubmissionResponse> submit(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SubmissionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(submissionService.submit(principal.getUserId(), request));
    }

    @GetMapping("/me")
    @Operation(summary = "Get my submission history")
    public ResponseEntity<List<SubmissionResponse>> getMySubmissions(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(submissionService.getSubmissionsForUser(principal.getUserId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a submission's result by ID")
    public ResponseEntity<SubmissionResponse> getSubmission(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmission(id));
    }
}
