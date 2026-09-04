package com.codingplatform.problem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.codingplatform.problem.entity.Difficulty;
import com.codingplatform.problem.entity.Problem;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findByDifficulty(Difficulty difficulty);

    List<Problem> findByTopicIgnoreCase(String topic);

    List<Problem> findByTitleContainingIgnoreCase(String title);
}