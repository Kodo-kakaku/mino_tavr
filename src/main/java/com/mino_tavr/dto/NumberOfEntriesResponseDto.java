package com.mino_tavr.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NumberOfEntriesResponseDto {
    Long all;
    Long models;
    Long repair;
}
