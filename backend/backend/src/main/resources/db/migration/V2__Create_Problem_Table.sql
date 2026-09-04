CREATE TABLE problems (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    difficulty VARCHAR(50),
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    topic VARCHAR(100),
    starter_code_java TEXT,
    starter_code_python TEXT,
    starter_code_cpp TEXT,
    starter_code_javascript TEXT,
    editorial TEXT,
    hints TEXT,
    editorial_unlock_attempts INT
);
