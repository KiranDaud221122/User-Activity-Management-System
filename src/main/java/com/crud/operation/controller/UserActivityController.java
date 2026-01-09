package com.crud.operation.controller;

import com.crud.operation.entity.UserActivity;
import com.crud.operation.service.UserActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-activities")
@RequiredArgsConstructor
@Slf4j
public class UserActivityController {

    private final UserActivityService userActivityService;

    @PostMapping
    public ResponseEntity<UserActivity> create(@RequestBody UserActivity userActivity) {
        log.info("Received request to create activity for userId: {}", userActivity.getUserId());
        UserActivity created = userActivityService.create(userActivity);
        log.info("Activity created successfully with id: {}", created.getId());
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<UserActivity>> getAll() {
        log.info("Received request to fetch all user activities");
        List<UserActivity> activities = userActivityService.getAll();
        log.info("Returning {} activities", activities.size());
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserActivity>> getByUserId(@PathVariable String userId) {
        log.info("Received request to fetch activities for userId: {}", userId);
        List<UserActivity> activities = userActivityService.getByUserId(userId);
        log.info("Found {} activities for userId: {}", activities.size(), userId);
        return ResponseEntity.ok(activities);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        log.info("Received request to delete activity with id: {}", id);
        userActivityService.delete(id);
        log.info("Activity deleted successfully with id: {}", id);
        return ResponseEntity.ok("Activity deleted successfully with id: " + id);
    }
}
