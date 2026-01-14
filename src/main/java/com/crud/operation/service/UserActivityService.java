package com.crud.operation.service;

import com.crud.operation.entity.UserActivity;
import com.crud.operation.repository.UserActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserActivityService {

    private final UserActivityRepository userActivityRepository;


    public UserActivity create(UserActivity userActivity) {
        userActivity.setCreatedAt(LocalDateTime.now());
        userActivity.setActivityId(UUID.randomUUID().toString());
        return userActivityRepository.save(userActivity);
    }


    public List<UserActivity> getAll() {
        log.info("Fetching all user activities");
        return userActivityRepository.findAll();
    }

    public List<UserActivity> getByUserId(String userId) {
        log.info("Fetching activities for userId: {}", userId);
        return userActivityRepository.findByUserId(userId);
    }

    public void delete(String id) {
        log.info("Deleting user activity with id: {}", id);

        if (!userActivityRepository.existsById(id)) {
            log.error("UserActivity not found with id: {}", id);
            throw new RuntimeException("UserActivity not found with id: " + id);
        }

        userActivityRepository.deleteById(id);
        log.info("UserActivity deleted successfully with id: {}", id);
    }
}
