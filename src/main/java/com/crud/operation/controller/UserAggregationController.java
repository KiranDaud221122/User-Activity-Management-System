package com.crud.operation.controller;

import com.crud.operation.dto.UserWithActivitiesResponse;
import com.crud.operation.service.UserAggregationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-dashboard")
@RequiredArgsConstructor
@Slf4j
public class UserAggregationController {

    private final UserAggregationService userAggregationService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserWithActivitiesResponse> getUserDashboard(@PathVariable String userId) {
        log.info("Received request to fetch dashboard for userId: {}", userId);

        UserWithActivitiesResponse response = userAggregationService.getUserWithActivities(userId);

        log.info("Returning dashboard for userId: {} with {} activities",
                userId, response.getActivities().size());

        return ResponseEntity.ok(response);
    }
}
