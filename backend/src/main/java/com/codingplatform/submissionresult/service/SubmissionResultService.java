package com.codingplatform.submissionresult.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.codingplatform.submissionresult.dto.SubmissionResultResponse;
import com.codingplatform.submissionresult.entity.SubmissionResult;
import com.codingplatform.submissionresult.repository.SubmissionResultRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubmissionResultService {

    private final SubmissionResultRepository submissionResultRepository;

    public List<SubmissionResultResponse> getResultsBySubmissionId(Long submissionId) {
        return submissionResultRepository.findBySubmissionIdOrderByIdAsc(submissionId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private SubmissionResultResponse convertToResponse(SubmissionResult result) {
        return new SubmissionResultResponse(
                result.getId(),
                result.getTestCase() != null ? result.getTestCase().getId() : null,
                result.getStatus(),
                result.getActualOutput(),
                result.getExecutionTimeMs(),
                result.getMemoryUsedKb(),
                result.getErrorMessage()
        );
    }
}
