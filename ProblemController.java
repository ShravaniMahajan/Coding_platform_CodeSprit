package com.platform.controller;

import com.platform.dto.problem.ProblemRequest;
import com.platform.dto.problem.ProblemResponse;
import com.platform.entity.Difficulty;
import com.platform.security.UserPrincipal;
import com.platform.service.ProblemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
@Tag(name = "problem-controller", description = "Problem bank browsing and admin management")
public class ProblemController {

    private final ProblemService problemService;

    @GetMapping
    @Operation(summary = "Get all problems")
    public ResponseEntity<List<ProblemResponse>> getAllProblems(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(problemService.getAllProblems(isAdmin(principal)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get problem by ID")
    public ResponseEntity<ProblemResponse> getProblemById(
            @PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(problemService.getProblemById(id, isAdmin(principal)));
    }

    @GetMapping("/difficulty/{difficulty}")
    @Operation(summary = "Get problems by difficulty")
    public ResponseEntity<List<ProblemResponse>> getByDifficulty(
            @PathVariable Difficulty difficulty, @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(problemService.getProblemsByDifficulty(difficulty, isAdmin(principal)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create problem", description = "Admin only")
    public ResponseEntity<ProblemResponse> createProblem(@Valid @RequestBody ProblemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(problemService.createProblem(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update problem", description = "Admin only")
    public ResponseEntity<ProblemResponse> updateProblem(
            @PathVariable Long id, @Valid @RequestBody ProblemRequest request) {
        return ResponseEntity.ok(problemService.updateProblem(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete problem", description = "Admin only")
    public ResponseEntity<Void> deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isAdmin(UserPrincipal principal) {
        return principal != null && principal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
