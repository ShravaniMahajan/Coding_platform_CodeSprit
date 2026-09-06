package com.codingplatform.submissionresult.entity;

import com.codingplatform.testcase.entity.TestCase;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "submission_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Using Long directly to avoid dependency on the Submission entity which hasn't been created yet.
    // This maps perfectly to your repository's findBySubmissionIdOrderByIdAsc method.
    @Column(name = "submission_id", nullable = false)
    private Long submissionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_case_id", nullable = false)
    private TestCase testCase;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TestCaseStatus status;

    @Column(name = "actual_output", columnDefinition = "TEXT")
    private String actualOutput;

    @Column(name = "execution_time_ms")
    private Long executionTimeMs;

    @Column(name = "memory_used_kb")
    private Long memoryUsedKb;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;
}
