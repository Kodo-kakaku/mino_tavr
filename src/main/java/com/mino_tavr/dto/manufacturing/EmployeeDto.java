package com.mino_tavr.dto.manufacturing;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeDto {
    private String name;
    private String subdivision;
    private String department;
}
