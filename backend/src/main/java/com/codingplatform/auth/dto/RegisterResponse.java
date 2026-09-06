package com.codingplatform.auth.dto;

import com.codingplatform.common.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {

    private String message;
    private Long id;
    private String username;
    private String email;
    private Role role;

    public RegisterResponse(String message, Long id, String username, String email) {
        this.message = message;
        this.id = id;
        this.username = username;
        this.email = email;
    }
}