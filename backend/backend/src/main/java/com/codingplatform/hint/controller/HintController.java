package com.codingplatform.hint.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codingplatform.hint.dto.EditorialResponse;
import com.codingplatform.hint.dto.HintResponse;
import com.codingplatform.hint.service.HintService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/problems/{problemId}")
@RequiredArgsConstructor
public class HintController {

    private final HintService hintService;


    // GET /api/problems/{problemId}/hint
    @GetMapping("/hint")
    public ResponseEntity<HintResponse> getHint(
            @PathVariable Long problemId) {

        return ResponseEntity.ok(
                hintService.getHint(problemId)
        );
    }


    // GET /api/problems/{problemId}/editorial
    @GetMapping("/editorial")
    public ResponseEntity<EditorialResponse> getEditorial(
            @PathVariable Long problemId,
            Principal principal) {

        return ResponseEntity.ok(
                hintService.getEditorial(problemId, principal.getName())
        );
    }
}
