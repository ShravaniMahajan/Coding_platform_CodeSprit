package com.codingplatform.submission.service;

import com.codingplatform.common.ProgrammingLanguage;
import com.codingplatform.problem.entity.Problem;
import com.codingplatform.problem.repository.ProblemRepository;
import com.codingplatform.submission.dto.SubmissionRequest;
import com.codingplatform.submission.dto.SubmissionResponse;
import com.codingplatform.submission.entity.Submission;
import com.codingplatform.submission.entity.SubmissionStatus;
import com.codingplatform.submission.repository.SubmissionRepository;
import com.codingplatform.user.entity.User;
import com.codingplatform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final SubmissionRateLimiter submissionRateLimiter;
    private final SubmissionProcessorService submissionProcessorService;

    @Transactional
    public SubmissionResponse submitCode(String userEmail, SubmissionRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        if (!submissionRateLimiter.isAllowed(user.getId())) {
            throw new RuntimeException("Rate limit exceeded. Maximum 5 submissions per minute allowed.");
        }

        Problem problem = problemRepository.findById(request.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + request.getProblemId()));

        Submission submission = new Submission();
        submission.setUser(user);
        submission.setProblem(problem);
        submission.setCode(request.getCode());
        submission.setLanguage(ProgrammingLanguage.fromString(request.getLanguage()));
        submission.setStatus(SubmissionStatus.PENDING);

        Submission saved = submissionRepository.save(submission);

        // Trigger async execution engine
        submissionProcessorService.processSubmissionAsync(saved.getId());

        return convertToResponse(saved);
    }

    public SubmissionResponse getSubmissionById(Long id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found with id: " + id));
        return convertToResponse(submission);
    }

    public List<SubmissionResponse> getUserSubmissions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        return submissionRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<SubmissionResponse> getSubmissionsByProblem(Long problemId) {
        return submissionRepository.findByProblemIdOrderByCreatedAtDesc(problemId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<SubmissionResponse> getAllSubmissions() {
        return submissionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public SubmissionResponse convertToResponse(Submission submission) {
        return new SubmissionResponse(
                submission.getId(),
                submission.getUser() != null ? submission.getUser().getId() : null,
                submission.getUser() != null ? submission.getUser().getUsername() : null,
                submission.getProblem() != null ? submission.getProblem().getId() : null,
                submission.getProblem() != null ? submission.getProblem().getTitle() : null,
                submission.getCode(),
                submission.getLanguage(),
                submission.getStatus(),
                submission.getExecutionTime(),
                submission.getMemoryUsed(),
                submission.getCreatedAt()
        );
    }
}
