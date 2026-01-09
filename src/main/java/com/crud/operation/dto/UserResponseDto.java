package com.crud.operation.dto;

import jdk.jshell.Snippet;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserResponseDto {

    private String id;
    private String name;
    private String email;
    private String contactNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}
