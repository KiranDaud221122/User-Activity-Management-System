package com.crud.operation.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserWithActivitiesResponse {

    private UserResponseDto user;
    private List<UserActivityResponse> activities;
}
