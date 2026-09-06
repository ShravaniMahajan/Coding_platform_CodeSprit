package com.platform.config;

import com.platform.entity.*;
import com.platform.repository.ProblemRepository;
import com.platform.repository.TestCaseRepository;
import com.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds an initial admin account and a handful of sample problems on first boot,
 * matching the seed data described in web_coding_platform_setup.sql — but with
 * properly BCrypt-hashed passwords generated through the real PasswordEncoder
 * bean instead of hardcoded hash literals.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;
    private final TestCaseRepository testCaseRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Data already present — skipping seed.");
            return;
        }

        User admin = userRepository.save(User.builder()
                .fullName("Admin User")
                .email("admin@codingplatform.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .build());

        userRepository.save(User.builder()
                .fullName("Alex Morgan")
                .email("alex@example.com")
                .password(passwordEncoder.encode("User@123"))
                .role(Role.USER)
                .build());

        seedProblem(admin, "Two Sum", Difficulty.EASY, "Arrays & Hashing",
                "Given an array of integers nums and an integer target, return indices of the "
                        + "two numbers such that they add up to target.",
                "2 7 11 15\n9", "0 1", 100);

        seedProblem(admin, "Valid Palindrome", Difficulty.EASY, "Two Pointers",
                "Given a string s, return true if it is a palindrome after removing "
                        + "non-alphanumeric characters and ignoring case, or false otherwise.",
                "A man, a plan, a canal: Panama", "true", 100);

        seedProblem(admin, "Longest Substring Without Repeating Characters", Difficulty.MEDIUM, "Sliding Window",
                "Given a string s, find the length of the longest substring without repeating characters.",
                "abcabcbb", "3", 150);

        seedProblem(admin, "Merge K Sorted Lists", Difficulty.HARD, "Heap & Linked List",
                "You are given an array of k linked lists, each sorted in ascending order. "
                        + "Merge all the linked lists into one sorted linked list and return it.",
                "3\n1 4 5\n1 3 4\n2 6", "1 1 2 3 4 4 5 6", 200);

        log.info("Seed data created: 2 users, 4 problems.");
    }

    private void seedProblem(User admin, String title, Difficulty difficulty, String category,
                              String description, String sampleInput, String sampleOutput, int marks) {
        Problem problem = Problem.builder()
                .title(title)
                .description(description)
                .difficulty(difficulty)
                .category(category)
                .sampleInput(sampleInput)
                .sampleOutput(sampleOutput)
                .marks(marks)
                .createdBy(admin)
                .build();
        problem = problemRepository.save(problem);

        testCaseRepository.save(TestCase.builder()
                .problem(problem)
                .input(sampleInput)
                .expectedOutput(sampleOutput)
                .isSample(true)
                .build());
    }
}
