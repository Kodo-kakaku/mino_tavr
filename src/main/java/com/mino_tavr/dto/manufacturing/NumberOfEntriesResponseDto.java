package com.mino_tavr.dto.manufacturing;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NumberOfEntriesResponseDto {
    private Long all;
    private Long models;
    private Long repair;
}
