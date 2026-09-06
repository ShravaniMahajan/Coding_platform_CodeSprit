package com.codingplatform;

import com.codingplatform.common.Role;
import com.codingplatform.user.entity.User;
import com.codingplatform.user.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Ensure default admin exists with correct encoded password
        User admin = userRepository.findByUsername("admin")
                .orElseGet(() -> userRepository.findByEmail("admin@codesphere.com")
                        .orElseGet(User::new));

        admin.setUsername("admin");
        admin.setEmail("admin@codesphere.com");
        admin.setPassword(passwordEncoder.encode("admin@123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
        System.out.println("✅ Admin user initialized: admin / admin@123 (email: admin@codesphere.com)");
    }
}
