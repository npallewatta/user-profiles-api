package com.project.userapi.controller;

import com.project.userapi.dto.UserResponse;
import com.project.userapi.model.User;
import com.project.userapi.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal Object principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String email = principal.toString();
        User user = userService.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(new UserResponse(user.getId(), user.getEmail(), user.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        User user = userService.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(new UserResponse(user.getId(), user.getEmail(), user.getName()));
    }
}
