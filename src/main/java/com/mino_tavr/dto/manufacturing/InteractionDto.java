package com.mino_tavr.dto.manufacturing;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InteractionDto {
    private String date;
    private EmployeeDto dealer;
    private EmployeeDto member;
}
