package com.codingplatform.common;

import lombok.Getter;

@Getter
public enum ProgrammingLanguage {
    C("C", "c"),
    CPP("C++", "cpp"),
    JAVA("Java", "java"),
    PYTHON("Python", "py"),
    JAVASCRIPT("JavaScript", "js"),
    SQL("SQL", "sql");

    private final String displayName;
    private final String extension;

    ProgrammingLanguage(String displayName, String extension) {
        this.displayName = displayName;
        this.extension = extension;
    }

    public static ProgrammingLanguage fromString(String value) {
        if (value == null) return null;
        for (ProgrammingLanguage lang : ProgrammingLanguage.values()) {
            if (lang.name().equalsIgnoreCase(value) || lang.displayName.equalsIgnoreCase(value)) {
                return lang;
            }
        }
        throw new IllegalArgumentException("Unsupported programming language: " + value);
    }
}
