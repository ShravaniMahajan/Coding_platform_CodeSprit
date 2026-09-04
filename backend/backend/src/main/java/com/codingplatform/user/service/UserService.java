package com.codingplatform.user.service;

import com.codingplatform.user.dto.UserDto;
import com.codingplatform.user.entity.User;
import com.codingplatform.user.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users
    public List<UserDto> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .toList();
    }

    // Get user by ID
    public UserDto getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return convertToDto(user);
    }

    // Update user
    public UserDto updateUser(Long id, UserDto request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        User updatedUser = userRepository.save(user);

        return convertToDto(updatedUser);
    }

    // Delete user
    public void deleteUser(Long id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);
    }

    // Convert Entity to DTO
    private UserDto convertToDto(User user) {

        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole()
        );
    }
}