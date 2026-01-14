package com.crud.operation.service;

import com.crud.operation.dto.UserActivityResponse;
import com.crud.operation.dto.UserResponseDto;
import com.crud.operation.dto.UserWithActivitiesResponse;
import com.crud.operation.entity.ActivityDetails;
import com.crud.operation.entity.UserActivity;
import com.crud.operation.entity.UserEntity;
import com.crud.operation.repository.ActivityDetailsRepository;
import com.crud.operation.repository.UserActivityRepository;
import com.crud.operation.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserAggregationService {

    private final UserRepository userRepository;
    private final UserActivityRepository userActivityRepository;
    private final ActivityDetailsRepository activityDetailsRepository;

    public UserWithActivitiesResponse getUserWithActivities(String userId) {

        log.info("Fetching user with activities for userId: {}", userId);

        // Fetch user from Postgres
        UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        UserResponseDto userDto = UserResponseDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .contactNumber(user.getContactNumber())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

        //  Fetch activities from Mongo
        List<UserActivity> activities = userActivityRepository.findByUserId(userId);
        log.info("Found {} activities for userId {}", activities.size(), userId);

        List<UserActivityResponse> activityResponses = new ArrayList<>();

        for (UserActivity activity : activities) {

            if (activity.getActivityId() == null) {
                log.warn("ActivityId missing for activity record {}", activity.getId());
                continue;
            }

            // Fetch activity details using activityId
            ActivityDetails details = activityDetailsRepository.findByActivityDetailsId(activity.getActivityId()).orElse(null);
            if (details == null) {
                log.warn("No activity details found for activityId: {}", activity.getActivityId());
                continue;
            }

            UserActivityResponse activityDto = UserActivityResponse.builder()
                    .userId(activity.getUserId())
                    .activityType(activity.getActivityType())
                    .activityName(details.getActivityName())
                    .activityDescription(details.getActivityDescription())
                    .activityTimestamp(details.getActivityTimestamp())
                    .build();

            activityResponses.add(activityDto);
        }

        return UserWithActivitiesResponse.builder()
                .user(userDto)
                .activities(activityResponses)
                .build();
    }
}
