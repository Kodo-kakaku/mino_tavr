package com.mino_tavr.service.manufactureService;

import com.mino_tavr.dto.manufacturing.*;

import java.io.IOException;
import java.util.List;

public interface ManufactureService {
    ModelIdResponseDto addModel(AddModelRequestDto dataOfNewModel);
    SingleModelResponseDto getModelById(Integer modelId);
    List<PreviewModelsResponseDto> getModelsByDeviceType(Integer type);
    NumberOfEntriesResponseDto getRecordsCount();
    void updateModel(SingleModelResponseDto modelData) throws IOException;
}

