package com.codingplatform.execution.service;

import com.codingplatform.common.ProgrammingLanguage;
import com.codingplatform.execution.dto.ExecutionRequest;
import com.codingplatform.execution.dto.ExecutionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class DockerExecutionService {

    private static final String DOCKER_JAVA_IMAGE = "openjdk:21-slim";
    private static final String DOCKER_PYTHON_IMAGE = "python:3.11-alpine";
    private static final String DOCKER_CPP_IMAGE = "gcc:latest";
    private static final String DOCKER_JS_IMAGE = "node:18-alpine";

    public ExecutionResponse executeCode(ExecutionRequest request) {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("code_exec_" + UUID.randomUUID());
            String fileName = getSourceFileName(request.getLanguage());
            Path sourceFile = tempDir.resolve(fileName);
            
            String code = request.getCode();
            if (request.getLanguage() == ProgrammingLanguage.JAVA && !code.contains("class Solution") && !code.contains("class Main")) {
                code = "import java.util.*;\npublic class Solution {\n" + code + "\n" +
                       "    public static void main(String[] args) {\n" +
                       "        System.out.println(\"Code executed successfully.\");\n" +
                       "    }\n" +
                       "}\n";
            } else if (request.getLanguage() == ProgrammingLanguage.C && !code.contains("main(")) {
                code = "#include <stdio.h>\n#include <stdlib.h>\n" + code + "\n" +
                       "int main() {\n" +
                       "    printf(\"Code executed successfully.\\n\");\n" +
                       "    return 0;\n" +
                       "}\n";
            } else if (request.getLanguage() == ProgrammingLanguage.CPP && !code.contains("main(")) {
                code = "#include <iostream>\n#include <vector>\nusing namespace std;\n" + code + "\n" +
                       "int main() {\n" +
                       "    cout << \"Code executed successfully.\" << endl;\n" +
                       "    return 0;\n" +
                       "}\n";
            }

            Files.writeString(sourceFile, code, StandardCharsets.UTF_8);

            if (isDockerAvailable()) {
                return executeInDocker(tempDir, fileName, request);
            } else {
                return executeLocally(tempDir, fileName, request);
            }
        } catch (Exception e) {
            log.error("Execution failed: ", e);
            return ExecutionResponse.builder()
                    .stdout("")
                    .stderr(e.getMessage())
                    .exitCode(-1)
                    .compiledSuccessfully(false)
                    .compileError(e.getMessage())
                    .build();
        } finally {
            if (tempDir != null) {
                deleteDirectory(tempDir);
            }
        }
    }

    private boolean isDockerAvailable() {
        try {
            Process process = new ProcessBuilder("docker", "--version").start();
            return process.waitFor() == 0;
        } catch (Exception e) {
            return false;
        }
    }

    private ExecutionResponse executeInDocker(Path tempDir, String fileName, ExecutionRequest request) throws Exception {
        String dockerImage = getDockerImage(request.getLanguage());
        String runCommand = getDockerRunCommand(request.getLanguage(), fileName);

        String hostPath = tempDir.toAbsolutePath().toString().replace("\\", "/");

        ProcessBuilder pb = new ProcessBuilder(
                "docker", "run", "--rm",
                "--network", "none",
                "--memory", request.getMemoryLimitMb() + "m",
                "--cpus", "1.0",
                "-v", hostPath + ":/app",
                "-w", "/app",
                dockerImage,
                "sh", "-c", runCommand
        );

        return runProcessWithTimeout(pb, request);
    }

    private ExecutionResponse executeLocally(Path tempDir, String fileName, ExecutionRequest request) throws Exception {
        ProgrammingLanguage lang = request.getLanguage();

        // Step 1: Compile if necessary
        ProcessBuilder compilePb = null;
        if (lang == ProgrammingLanguage.C) {
            compilePb = new ProcessBuilder("gcc", fileName, "-o", "main");
        } else if (lang == ProgrammingLanguage.CPP) {
            compilePb = new ProcessBuilder("g++", fileName, "-o", "main");
        } else if (lang == ProgrammingLanguage.JAVA) {
            compilePb = new ProcessBuilder("javac", fileName);
        }

        if (compilePb != null) {
            compilePb.directory(tempDir.toFile());
            Process compileProcess = compilePb.start();
            boolean compiled = compileProcess.waitFor(10, TimeUnit.SECONDS);
            if (!compiled) {
                compileProcess.destroyForcibly();
                return ExecutionResponse.builder()
                        .compiledSuccessfully(false)
                        .compileError("Compilation timed out")
                        .build();
            }
            if (compileProcess.exitValue() != 0) {
                String compileError = readStream(compileProcess.getErrorStream());
                return ExecutionResponse.builder()
                        .compiledSuccessfully(false)
                        .compileError(compileError)
                        .build();
            }
        }

        // Step 2: Execute
        ProcessBuilder runPb;
        if (lang == ProgrammingLanguage.C || lang == ProgrammingLanguage.CPP) {
            runPb = new ProcessBuilder(isWindows() ? "main.exe" : "./main");
        } else if (lang == ProgrammingLanguage.JAVA) {
            runPb = new ProcessBuilder("java", "Solution");
        } else if (lang == ProgrammingLanguage.PYTHON) {
            runPb = new ProcessBuilder("python", fileName);
        } else if (lang == ProgrammingLanguage.JAVASCRIPT) {
            runPb = new ProcessBuilder("node", fileName);
        } else if (lang == ProgrammingLanguage.SQL) {
            runPb = new ProcessBuilder("python", "-c", "import sqlite3; conn = sqlite3.connect(':memory:'); conn.executescript(open('" + fileName + "').read())");
        } else {
            throw new IllegalArgumentException("Unsupported language for local execution: " + lang);
        }

        runPb.directory(tempDir.toFile());
        return runProcessWithTimeout(runPb, request);
    }

    private ExecutionResponse runProcessWithTimeout(ProcessBuilder pb, ExecutionRequest request) throws Exception {
        long startTime = System.currentTimeMillis();
        Process process = pb.start();

        // Write stdin input and always close the stream to signal EOF
        try (OutputStream os = process.getOutputStream()) {
            if (request.getStdinInput() != null && !request.getStdinInput().isEmpty()) {
                os.write(request.getStdinInput().getBytes(StandardCharsets.UTF_8));
                os.flush();
            }
        } catch (IOException ignored) {}

        boolean completed = process.waitFor(request.getTimeLimitSeconds(), TimeUnit.SECONDS);
        long executionTimeMs = System.currentTimeMillis() - startTime;

        if (!completed) {
            process.destroyForcibly();
            return ExecutionResponse.builder()
                    .stdout("")
                    .stderr("Time Limit Exceeded")
                    .exitCode(124)
                    .executionTimeMs(executionTimeMs)
                    .timedOut(true)
                    .compiledSuccessfully(true)
                    .build();
        }

        String stdout = readStream(process.getInputStream());
        String stderr = readStream(process.getErrorStream());
        int exitCode = process.exitValue();

        boolean compiled = exitCode == 0 || !stderr.contains("error");

        return ExecutionResponse.builder()
                .stdout(stdout)
                .stderr(stderr)
                .exitCode(exitCode)
                .executionTimeMs(executionTimeMs)
                .timedOut(false)
                .compiledSuccessfully(compiled)
                .compileError(compiled ? null : stderr)
                .build();
    }

    private String getSourceFileName(ProgrammingLanguage language) {
        return switch (language) {
            case C -> "main.c";
            case CPP -> "main.cpp";
            case JAVA -> "Solution.java";
            case PYTHON -> "script.py";
            case JAVASCRIPT -> "script.js";
            case SQL -> "query.sql";
        };
    }

    private String getDockerImage(ProgrammingLanguage language) {
        return switch (language) {
            case C, CPP -> DOCKER_CPP_IMAGE;
            case JAVA -> DOCKER_JAVA_IMAGE;
            case PYTHON, SQL -> DOCKER_PYTHON_IMAGE;
            case JAVASCRIPT -> DOCKER_JS_IMAGE;
        };
    }

    private String getDockerRunCommand(ProgrammingLanguage language, String fileName) {
        return switch (language) {
            case C -> "gcc main.c -o main && ./main";
            case CPP -> "g++ main.cpp -o main && ./main";
            case JAVA -> "javac Solution.java && java Solution";
            case PYTHON -> "python script.py";
            case JAVASCRIPT -> "node script.js";
            case SQL -> "sqlite3 :memory: < query.sql";
        };
    }

    private String readStream(InputStream is) throws IOException {
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length;
        while ((length = is.read(buffer)) != -1) {
            result.write(buffer, 0, length);
        }
        return result.toString(StandardCharsets.UTF_8);
    }

    private boolean isWindows() {
        return System.getProperty("os.name").toLowerCase().contains("win");
    }

    private void deleteDirectory(Path path) {
        try (var stream = Files.walk(path)) {
            stream.sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        } catch (IOException ignored) {}
    }
}
