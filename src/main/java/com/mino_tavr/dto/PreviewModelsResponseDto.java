package com.mino_tavr.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
public class PreviewModelsResponseDto {
    private Integer id;
    private byte[] image;
    Date date;
}
