package com.crud.operation.entity;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Document(collection = "activity_details")
public class ActivityDetails {

    @Id
    private String id;

    @Field("activityDetailsId")
    private String activityDetailsId;

    private String activityName;
    private String activityDescription;
    private LocalDateTime activityTimestamp;
}

