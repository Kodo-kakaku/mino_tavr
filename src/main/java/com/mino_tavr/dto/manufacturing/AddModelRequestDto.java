package com.mino_tavr.dto.manufacturing;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.sql.Date;
import java.util.List;

@Data
@AllArgsConstructor
public class AddModelRequestDto {
    private int deviceType;
    private int reason;
    private String reasonNumber;
    private Date notification;
    private InteractionDto interactionBegin;
    private InteractionDto interactionEnd;
    private List<DescriptionDto> descriptions;
}
