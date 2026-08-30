package com.platform.service.execution;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * Local, ProcessBuilder-based code execution engine.
 * Supports: JAVA, PYTHON, CPP (C++), JAVASCRIPT.
 *
 * This is a functional reference implementation intended for local development
 * and demos. It is NOT a hardened sandbox (see interface javadoc) — do not expose
 * it directly to untrusted users in production without adding container-based
 * isolation (Docker), a strict memory cap and a dedicated non-privileged OS user.
 */
@Slf4j
@Service
public class LocalProcessCodeExecutionService implements CodeExecutionService {

    private static final int COMPILE_TIMEOUT_MS = 15_000;

    @Override
    public ExecutionResult execute(String language, String sourceCode, String stdin, int timeLimitMs) {
        Path workDir = null;
        try {
            workDir = Files.createTempDirectory("submission-" + UUID.randomUUID());
            return switch (language.trim().toUpperCase()) {
                case "JAVA" -> runJava(workDir, sourceCode, stdin, timeLimitMs);
                case "PYTHON", "PYTHON3" -> runPython(workDir, sourceCode, stdin, timeLimitMs);
                case "CPP", "C++" -> runCpp(workDir, sourceCode, stdin, timeLimitMs);
                case "JAVASCRIPT", "JS", "NODE" -> runJavaScript(workDir, sourceCode, stdin, timeLimitMs);
                default -> ExecutionResult.builder()
                        .outcome(ExecutionOutcome.COMPILATION_ERROR)
                        .stderr("Unsupported language: " + language)
                        .stdout("")
                        .executionTimeMs(0)
                        .build();
            };
        } catch (Exception e) {
            log.error("Execution failed", e);
            return ExecutionResult.builder()
                    .outcome(ExecutionOutcome.RUNTIME_ERROR)
                    .stderr("Execution engine error: " + e.getMessage())
                    .stdout("")
                    .executionTimeMs(0)
                    .build();
        } finally {
            cleanup(workDir);
        }
    }

    private ExecutionResult runJava(Path workDir, String sourceCode, String stdin, int timeLimitMs) throws IOException, InterruptedException {
        String className = extractPublicClassName(sourceCode).orElse("Main");
        Path srcFile = workDir.resolve(className + ".java");
        Files.writeString(srcFile, sourceCode);

        ProcessResult compile = runProcess(workDir, COMPILE_TIMEOUT_MS, null,
                List.of("javac", srcFile.getFileName().toString()));
        if (compile.timedOut() || compile.exitCode() != 0) {
            return compileError(compile.stderr());
        }

        ProcessResult run = runProcess(workDir, timeLimitMs, stdin,
                List.of("java", "-Xmx512m", className));
        return toExecutionResult(run);
    }

    private ExecutionResult runPython(Path workDir, String sourceCode, String stdin, int timeLimitMs) throws IOException, InterruptedException {
        Path srcFile = workDir.resolve("main.py");
        Files.writeString(srcFile, sourceCode);

        ProcessResult run = runProcess(workDir, timeLimitMs, stdin,
                List.of("python3", srcFile.getFileName().toString()));
        return toExecutionResult(run);
    }

    private ExecutionResult runCpp(Path workDir, String sourceCode, String stdin, int timeLimitMs) throws IOException, InterruptedException {
        Path srcFile = workDir.resolve("main.cpp");
        Files.writeString(srcFile, sourceCode);

        ProcessResult compile = runProcess(workDir, COMPILE_TIMEOUT_MS, null,
                List.of("g++", "-O2", "-o", "main", srcFile.getFileName().toString()));
        if (compile.timedOut() || compile.exitCode() != 0) {
            return compileError(compile.stderr());
        }

        ProcessResult run = runProcess(workDir, timeLimitMs, stdin, List.of("./main"));
        return toExecutionResult(run);
    }

    private ExecutionResult runJavaScript(Path workDir, String sourceCode, String stdin, int timeLimitMs) throws IOException, InterruptedException {
        Path srcFile = workDir.resolve("main.js");
        Files.writeString(srcFile, sourceCode);

        ProcessResult run = runProcess(workDir, timeLimitMs, stdin,
                List.of("node", srcFile.getFileName().toString()));
        return toExecutionResult(run);
    }

    private ExecutionResult compileError(String stderr) {
        return ExecutionResult.builder()
                .outcome(ExecutionOutcome.COMPILATION_ERROR)
                .stdout("")
                .stderr(stderr)
                .executionTimeMs(0)
                .build();
    }

    private ExecutionResult toExecutionResult(ProcessResult result) {
        if (result.timedOut()) {
            return ExecutionResult.builder()
                    .outcome(ExecutionOutcome.TIME_LIMIT_EXCEEDED)
                    .stdout(result.stdout())
                    .stderr(result.stderr())
                    .executionTimeMs(result.elapsedMs())
                    .build();
        }
        if (result.exitCode() != 0) {
            return ExecutionResult.builder()
                    .outcome(ExecutionOutcome.RUNTIME_ERROR)
                    .stdout(result.stdout())
                    .stderr(result.stderr())
                    .executionTimeMs(result.elapsedMs())
                    .build();
        }
        return ExecutionResult.builder()
                .outcome(ExecutionOutcome.SUCCESS)
                .stdout(result.stdout())
                .stderr(result.stderr())
                .executionTimeMs(result.elapsedMs())
                .build();
    }

    private ProcessResult runProcess(Path workDir, int timeoutMs, String stdin, List<String> command)
            throws IOException, InterruptedException {

        ProcessBuilder builder = new ProcessBuilder(command)
                .directory(workDir.toFile())
                .redirectErrorStream(false);

        long start = System.currentTimeMillis();
        Process process = builder.start();

        if (stdin != null) {
            try (var os = process.getOutputStream()) {
                os.write(stdin.getBytes(StandardCharsets.UTF_8));
                os.flush();
            } catch (IOException ignored) {
                // process may have already exited / closed stdin
            }
        } else {
            process.getOutputStream().close();
        }

        boolean finished = process.waitFor(timeoutMs, TimeUnit.MILLISECONDS);
        long elapsed = System.currentTimeMillis() - start;

        if (!finished) {
            process.destroyForcibly();
            return new ProcessResult(true, -1, "", "Time limit exceeded", elapsed);
        }

        String stdout = readStream(process.getInputStream());
        String stderr = readStream(process.getErrorStream());
        return new ProcessResult(false, process.exitValue(), stdout, stderr, elapsed);
    }

    private String readStream(InputStream inputStream) throws IOException {
        return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    }

    private java.util.Optional<String> extractPublicClassName(String sourceCode) {
        var matcher = java.util.regex.Pattern
                .compile("public\\s+(final\\s+)?class\\s+(\\w+)")
                .matcher(sourceCode);
        return matcher.find() ? java.util.Optional.of(matcher.group(2)) : java.util.Optional.empty();
    }

    private void cleanup(Path workDir) {
        if (workDir == null) return;
        try (var walk = Files.walk(workDir)) {
            walk.sorted(java.util.Comparator.reverseOrder())
                    .forEach(p -> {
                        try {
                            Files.deleteIfExists(p);
                        } catch (IOException ignored) {
                        }
                    });
        } catch (IOException e) {
            log.warn("Failed to clean up temp dir {}", workDir, e);
        }
    }

    private record ProcessResult(boolean timedOut, int exitCode, String stdout, String stderr, long elapsedMs) {
    }
}
