package com.crud.operation.service;

import com.crud.operation.dto.UserRequestDto;
import com.crud.operation.dto.UserResponseDto;
import com.crud.operation.entity.UserEntity;
import com.crud.operation.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponseDto create(UserRequestDto requestDto) {
        log.info("Creating user with email: {}", requestDto.getEmail());
        if (userRepository.existsByEmail(requestDto.getEmail())) {

            UserEntity existingUser = userRepository.findByEmail(requestDto.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserResponseDto response = new UserResponseDto();
            response.setId(existingUser.getId());
            response.setName(existingUser.getName());
            response.setEmail(existingUser.getEmail());
            response.setContactNumber(existingUser.getContactNumber());
            response.setCreatedAt(existingUser.getCreatedAt());
            response.setUpdatedAt(existingUser.getUpdatedAt());
            return response;
        }

        UserEntity user = new UserEntity();
        user.setName(requestDto.getName());
        user.setEmail(requestDto.getEmail());
        user.setContactNumber(requestDto.getContactNumber());

        UserEntity savedUser = userRepository.save(user);

        UserResponseDto response = new UserResponseDto();
        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setContactNumber(savedUser.getContactNumber());
        response.setCreatedAt(savedUser.getCreatedAt());
        response.setUpdatedAt(savedUser.getUpdatedAt());
        return response;
    }

    public UserResponseDto getUserProfile(String userId) {
        log.info("Fetching user profile for userId: {}", userId);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponseDto response = new UserResponseDto();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setContactNumber(user.getContactNumber());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }

    public UserResponseDto updateUserProfile(String userId, UserRequestDto requestDto) {
        log.info("Updating user profile for userId: {}", userId);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(requestDto.getName());
        user.setEmail(requestDto.getEmail());
        user.setContactNumber(requestDto.getContactNumber());

        UserEntity updatedUser = userRepository.save(user);

        UserResponseDto response = new UserResponseDto();
        response.setId(updatedUser.getId());
        response.setName(updatedUser.getName());
        response.setEmail(updatedUser.getEmail());
        response.setContactNumber(updatedUser.getContactNumber());
        response.setCreatedAt(updatedUser.getCreatedAt());
        response.setUpdatedAt(updatedUser.getUpdatedAt());
        return response;
    }

    public void deleteUserProfile(String userId) {
        log.info("Deleting user profile for userId: {}", userId);

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }

    public List<UserResponseDto> getAllUsers() {
        log.info("Fetching all users");

        List<UserEntity> allUsers = userRepository.findAll();
        List<UserResponseDto> responseList = new ArrayList<>();

        for (UserEntity user : allUsers) {
            UserResponseDto response = new UserResponseDto();
            response.setId(user.getId());
            response.setName(user.getName());
            response.setEmail(user.getEmail());
            response.setContactNumber(user.getContactNumber());
            response.setCreatedAt(user.getCreatedAt());
            response.setUpdatedAt(user.getUpdatedAt());

            responseList.add(response);
        }

        return responseList;
    }

}
