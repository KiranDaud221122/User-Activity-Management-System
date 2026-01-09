package com.crud.operation.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
@Builder
public class UserActivityResponse {

    private String userId;

    private String activityType;
    private String activityName;
    private String activityDescription;
    private LocalDateTime activityTimestamp;

}
