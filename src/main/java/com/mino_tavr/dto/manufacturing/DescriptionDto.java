package com.mino_tavr.dto.manufacturing;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DescriptionDto {
    private String device;
    private String serialNumber;
    private String inventoryNumber;
    private String remark;
}
