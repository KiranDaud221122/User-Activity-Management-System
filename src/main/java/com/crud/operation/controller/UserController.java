package com.crud.operation.controller;

import com.crud.operation.dto.UserRequestDto;
import com.crud.operation.dto.UserResponseDto;
import com.crud.operation.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(@RequestBody UserRequestDto requestDto) {
        log.info("Received request to create user: {}", requestDto);
        UserResponseDto response = userService.create(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        log.info("Received request to get all users");
        List<UserResponseDto> users = userService.getAllUsers();
        return new ResponseEntity<>(users , HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable String userId) {
        log.info("Received request to get user by ID: {}", userId);
        UserResponseDto response = userService.getUserProfile(userId);
        return new ResponseEntity<>(response , HttpStatus.OK);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponseDto> updateUser(@PathVariable String userId, @RequestBody UserRequestDto requestDto) {
        log.info("Received request to update user with ID: {}", userId);
        UserResponseDto response = userService.updateUserProfile(userId, requestDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable String userId) {
        log.info("Received request to delete user with ID: {}", userId);
        userService.deleteUserProfile(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
}
