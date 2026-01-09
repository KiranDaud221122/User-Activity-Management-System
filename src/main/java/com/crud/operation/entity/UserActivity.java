package com.crud.operation.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "user_activities")
public class UserActivity {

    @Id
    private String id;

    private String userId;          // Postgres User ID
    private String activityId;      // Mongo ActivityDetails ID
    private String activityType;
    private LocalDateTime createdAt;
}
