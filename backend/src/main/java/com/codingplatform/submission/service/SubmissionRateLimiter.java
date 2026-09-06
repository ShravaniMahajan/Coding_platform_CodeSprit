package com.codingplatform.submission.service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class SubmissionRateLimiter {

    private static final int MAX_SUBMISSIONS = 5;
    private static final long WINDOW_SECONDS = 60;

    private final Map<Long, SubmissionWindow> userSubmissions =
            new ConcurrentHashMap<>();

    public boolean isAllowed(Long userId) {

        Instant now = Instant.now();

        SubmissionWindow window =
                userSubmissions.computeIfAbsent(
                        userId,
                        id -> new SubmissionWindow(now)
                );

        synchronized (window) {

            if (now.getEpochSecond()
                    - window.startTime.getEpochSecond()
                    >= WINDOW_SECONDS) {

                window.startTime = now;
                window.count = 0;
            }

            if (window.count >= MAX_SUBMISSIONS) {
                return false;
            }

            window.count++;

            return true;
        }
    }

    private static class SubmissionWindow {

        private Instant startTime;

        private int count;

        SubmissionWindow(Instant startTime) {
            this.startTime = startTime;
            this.count = 0;
        }
    }
}
