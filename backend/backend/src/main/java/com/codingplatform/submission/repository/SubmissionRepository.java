package com.codingplatform.submission.repository;

import com.codingplatform.submission.entity.Submission;
import com.codingplatform.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.codingplatform.problem.entity.Problem;

import com.codingplatform.submission.entity.SubmissionStatus;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUser(User user);
    List<Submission> findByUserAndProblem(User user, Problem problem);
    
    List<Submission> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Submission> findByProblemIdOrderByCreatedAtDesc(Long problemId);
    List<Submission> findByUserIdAndStatus(Long userId, SubmissionStatus status);
    
    long countByUserIdAndProblemIdAndStatus(Long userId, Long problemId, SubmissionStatus status);
    long countByUserId(Long userId);
    List<Submission> findAllByOrderByCreatedAtDesc();
}
