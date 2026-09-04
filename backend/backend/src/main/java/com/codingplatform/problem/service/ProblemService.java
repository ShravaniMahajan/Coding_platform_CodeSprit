package com.codingplatform.problem.service;

import com.codingplatform.problem.dto.ProblemRequest;
import com.codingplatform.problem.dto.ProblemResponse;
import com.codingplatform.problem.entity.Problem;
import com.codingplatform.problem.repository.ProblemRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    // Create Problem
    public ProblemResponse createProblem(ProblemRequest request) {

        Problem problem = new Problem();
        mapRequestToProblem(request, problem);
        Problem savedProblem = problemRepository.save(problem);
        return convertToResponse(savedProblem);
    }

    // Get All Problems
    public List<ProblemResponse> getAllProblems() {

        return problemRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get Problem By ID
    public ProblemResponse getProblemById(Long id) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Problem not found"));

        return convertToResponse(problem);
    }

    // Update Problem
    public ProblemResponse updateProblem(Long id, ProblemRequest request) {

        Problem problem = problemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Problem not found"));

        mapRequestToProblem(request, problem);
        Problem updatedProblem = problemRepository.save(problem);
        return convertToResponse(updatedProblem);
    }

    // Delete Problem
    public void deleteProblem(Long id) {

        if (!problemRepository.existsById(id)) {
            throw new RuntimeException("Problem not found");
        }

        problemRepository.deleteById(id);
    }

    // Find Problems By Difficulty
    public List<ProblemResponse> getByDifficulty(
            com.codingplatform.problem.entity.Difficulty difficulty) {

        return problemRepository.findByDifficulty(difficulty)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Find Problems By Topic
    public List<ProblemResponse> getByTopic(String topic) {

        return problemRepository.findByTopicIgnoreCase(topic)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Search Problems By Title
    public List<ProblemResponse> searchByTitle(String title) {

        return problemRepository
                .findByTitleContainingIgnoreCase(title)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Map request fields to problem entity
    private void mapRequestToProblem(ProblemRequest request, Problem problem) {
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());
        problem.setInputFormat(request.getInputFormat());
        problem.setOutputFormat(request.getOutputFormat());
        problem.setConstraints(request.getConstraints());
        problem.setTopic(request.getTopic());
        problem.setStarterCodeJava(request.getStarterCodeJava());
        problem.setStarterCodePython(request.getStarterCodePython());
        problem.setStarterCodeCpp(request.getStarterCodeCpp());
        problem.setStarterCodeJavascript(request.getStarterCodeJavascript());
        problem.setEditorial(request.getEditorial());
        problem.setHints(request.getHints());
        problem.setEditorialUnlockAttempts(request.getEditorialUnlockAttempts());
    }

    // Convert Entity → Response DTO
    private ProblemResponse convertToResponse(Problem problem) {

        return new ProblemResponse(
                problem.getId(),
                problem.getTitle(),
                problem.getDescription(),
                problem.getDifficulty(),
                problem.getInputFormat(),
                problem.getOutputFormat(),
                problem.getConstraints(),
                problem.getTopic(),
                problem.getStarterCodeJava(),
                problem.getStarterCodePython(),
                problem.getStarterCodeCpp(),
                problem.getStarterCodeJavascript(),
                problem.getEditorial(),
                problem.getHints(),
                problem.getEditorialUnlockAttempts()
        );
    }
}