package com.codingplatform.submissionresult.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.codingplatform.submissionresult.dto.SubmissionResultResponse;
import com.codingplatform.submissionresult.service.SubmissionResultService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/submission-results")
@RequiredArgsConstructor
public class SubmissionResultController {

    private final SubmissionResultService submissionResultService;

    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<List<SubmissionResultResponse>>
            getResultsBySubmissionId(
                    @PathVariable Long submissionId) {

        return ResponseEntity.ok(
                submissionResultService
                        .getResultsBySubmissionId(submissionId)
        );
    }
}
