package com.crud.operation.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class UserRequestDto {
    private String name;
    private String email;
    private String contactNumber;
}
