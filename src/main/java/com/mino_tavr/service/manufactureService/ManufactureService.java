package com.mino_tavr.service.manufactureService;

import com.mino_tavr.dto.*;

import java.util.List;

public interface ManufactureService {
    ModelIdResponseDto addModel(AddModelRequestDto dataOfNewModel);
    SingleModelResponseDto getModelById(Integer modelId);
    List<PreviewModelsResponseDto> getModelsByDeviceType(Integer type);
    NumberOfEntriesResponseDto getRecordsCount();

    // TODO


    // List<AllCardNumberResponseDto> getAllCardNumber();

   //  SingleCardNumberResponseDto getCardNumberById(Integer id);
}

