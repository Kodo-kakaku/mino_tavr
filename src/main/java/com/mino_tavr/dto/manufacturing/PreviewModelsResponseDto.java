package com.mino_tavr.dto.manufacturing;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
public class PreviewModelsResponseDto {
    private Integer id;
    private Date date;
    private byte[] image;
}
