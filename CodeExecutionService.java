package com.platform.service.execution;

public interface CodeExecutionService {

    /**
     * Compiles (if needed) and runs the given source code against a single stdin input,
     * enforcing a wall-clock time limit.
     *
     * NOTE: This default implementation (see LocalProcessCodeExecutionService) runs code
     * as a local OS process via ProcessBuilder. It applies a CPU/wall-clock timeout but
     * does NOT provide OS-level sandboxing (no filesystem/network isolation, no hard
     * memory cap). For a production deployment, swap this bean out for a Docker-backed
     * implementation (one container per language: openjdk:17, python:3.11, gcc:latest)
     * that runs with --network=none, --memory=512m and a supervised timeout, as described
     * in the project's Weeks 1-2 requirements.
     */
    ExecutionResult execute(String language, String sourceCode, String stdin, int timeLimitMs);
}
