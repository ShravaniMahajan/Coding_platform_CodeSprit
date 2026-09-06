-- ====================================================================
-- Coding Platform - Initial Schema (Flyway V1)
-- ====================================================================

CREATE TABLE users (
    user_id         BIGSERIAL PRIMARY KEY,
    full_name       VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    role            VARCHAR(20)  NOT NULL DEFAULT 'USER'
                        CHECK (role IN ('ADMIN', 'USER')),
    total_score     INTEGER NOT NULL DEFAULT 0,
    solved_problems INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE problems (
    problem_id      BIGSERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    difficulty      VARCHAR(20) NOT NULL
                        CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    category        VARCHAR(100),
    topic_tags      VARCHAR(500),
    input_format    TEXT,
    output_format   TEXT,
    constraints     TEXT,
    sample_input    TEXT,
    sample_output   TEXT,
    starter_code    TEXT,
    time_limit_ms   INTEGER NOT NULL DEFAULT 5000,
    memory_limit_mb INTEGER NOT NULL DEFAULT 512,
    marks           INTEGER NOT NULL DEFAULT 100,
    created_by      BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_cases (
    testcase_id     BIGSERIAL PRIMARY KEY,
    problem_id      BIGINT NOT NULL REFERENCES problems(problem_id) ON DELETE CASCADE,
    input           TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample       BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE submissions (
    submission_id   BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    problem_id      BIGINT NOT NULL REFERENCES problems(problem_id) ON DELETE CASCADE,
    language        VARCHAR(30) NOT NULL,
    source_code     TEXT NOT NULL,
    submitted_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submission_results (
    result_id         BIGSERIAL PRIMARY KEY,
    submission_id     BIGINT NOT NULL UNIQUE REFERENCES submissions(submission_id) ON DELETE CASCADE,
    status            VARCHAR(30) NOT NULL DEFAULT 'PENDING'
                          CHECK (status IN (
                              'PENDING', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER',
                              'COMPILATION_ERROR', 'RUNTIME_ERROR',
                              'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED'
                          )),
    passed_testcases  INTEGER NOT NULL DEFAULT 0,
    total_testcases   INTEGER NOT NULL DEFAULT 0,
    execution_time_ms NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    memory_used_mb    NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    score             INTEGER NOT NULL DEFAULT 0,
    evaluated_at      TIMESTAMP
);

CREATE TABLE leaderboard (
    leaderboard_id  BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    total_score     INTEGER NOT NULL DEFAULT 0,
    rank            INTEGER NOT NULL DEFAULT 0,
    last_updated    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_problem ON submissions(problem_id);
CREATE INDEX idx_test_cases_problem ON test_cases(problem_id);
CREATE INDEX idx_leaderboard_total_score ON leaderboard(total_score DESC);
