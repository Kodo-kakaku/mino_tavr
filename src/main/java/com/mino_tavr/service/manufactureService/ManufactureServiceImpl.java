package com.mino_tavr.service.manufactureService;

import com.mino_tavr.broker.ImageBroker;
import com.mino_tavr.dto.*;
import com.mino_tavr.entity.*;
import com.mino_tavr.repository.ModelRepository;
import com.mino_tavr.repository.PreviewModels;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManufactureServiceImpl implements ManufactureService {
    private final ImageBroker imageBroker;
    private final ModelRepository modelRepository;


    private Description getDescriptionFromDescriptionDto(DescriptionDto descriptionData) {
        Description description = new Description();
        description.setDevice(descriptionData.getDevice());
        description.setSerialNumber(descriptionData.getSerialNumber());
        description.setInventoryNumber(descriptionData.getInventoryNumber());
        description.setRemark(descriptionData.getRemark());
        return description;
    }
    private DescriptionDto getDescriptionDtoFromDescription(Description descriptionData) {
        return new DescriptionDto(descriptionData.getDevice(),
                descriptionData.getSerialNumber(),
                descriptionData.getInventoryNumber(),
                descriptionData.getRemark()
        );
    }

    private InteractionDto getInteractionDtoFromInteraction(Interaction interactionData) {
        return new InteractionDto(
                Optional.ofNullable(interactionData.getDate()).map(Date::toString).orElse("-"),
                new EmployeeDto(interactionData.getDealer().getName(),
                        interactionData.getDealer().getSubdivision(),
                        interactionData.getDealer().getDepartment()),
                new EmployeeDto(interactionData.getMember().getName(),
                        interactionData.getMember().getSubdivision(),
                        interactionData.getMember().getDepartment()));
    }

    private SingleModelResponseDto getSingleModel(Model model) {
        var singleModel = new SingleModelResponseDto();

        singleModel.setId(model.getId());
        singleModel.setImage(model.getImage());
        singleModel.setDeviceType(model.getDeviceType());
        singleModel.setDone(model.isDone());
        singleModel.setNote(model.getNote());
        singleModel.setNotification(model.getNotification());
        singleModel.setReason(model.getReason().getReasonType());
        singleModel.setReasonNumber(model.getReason().getReasonNumber());
        singleModel.setInteractionBegin(getInteractionDtoFromInteraction(model.getInteractionBegin()));
        singleModel.setInteractionEnd(getInteractionDtoFromInteraction(model.getInteractionEnd()));

        singleModel.setDescriptions(model.getDescriptions().stream()
                .map(this::getDescriptionDtoFromDescription)
                .collect(Collectors.toList())
        );
        return singleModel;
    }

    private PreviewModelsResponseDto getModelPreview(PreviewModels model) {
        var singleModel = new PreviewModelsResponseDto();
        singleModel.setId(model.getId());
        singleModel.setImage(model.getImage());
        singleModel.setDate(model.getInteractionBegin().getDate());
        return singleModel;
    }

    @Override
    public ModelIdResponseDto addModel(AddModelRequestDto dataOfNewModel) {
        // Create Interaction begin & end field
        var interactionBegin = new Interaction();
        interactionBegin.setDate(dataOfNewModel.getDate());
        interactionBegin.setDealer(new Employee(dataOfNewModel.getDealer().getName(),
                dataOfNewModel.getDealer().getSubdivision(),
                dataOfNewModel.getDealer().getDepartment()));
        interactionBegin.setMember(new Employee(dataOfNewModel.getMemberName(),
                "25",
                "Т"));

        // Date is empty (null)
        var interactionEnd = new Interaction();
        interactionEnd.setDealer(new Employee("-", "-", "-"));
        interactionEnd.setMember(new Employee("-", "-", "-"));

        // Create Reason field
        Reason reason = new Reason();
        reason.setReasonType(dataOfNewModel.getReason());
        reason.setReasonNumber(dataOfNewModel.getReasonNumber());

        // Create Model and save data(Model) to repository(DB)
        Model model = new Model();
        model.setDone(false);
        model.setNotification(dataOfNewModel.getNotification());
        model.setImage(imageBroker.getDummyImageModelPreview());
        model.setDeviceType(dataOfNewModel.getDeviceType());
        model.setInteractionBegin(interactionBegin);
        model.setInteractionEnd(interactionEnd);
        model.setReason(reason);

        /* Create Description fields and set to model */
        model.setDescriptions(dataOfNewModel.getDescriptions().stream()
                .map(this::getDescriptionFromDescriptionDto)
                .collect(Collectors.toList()));

        return new ModelIdResponseDto(modelRepository.save(model).getId());
    }
    @Override
    public SingleModelResponseDto getModelById(Integer modelId) {
        // TODO Create exception 404 Not Found
        var model = modelRepository.findById(modelId).orElseThrow(IllegalArgumentException::new);
        return getSingleModel(model);
    }

    @Override
    public List<PreviewModelsResponseDto> getModelsByDeviceType(Integer type) {
        List<PreviewModels> allModelsByType = modelRepository.findByDeviceType(type);
        return allModelsByType.stream().map(this::getModelPreview).collect(Collectors.toList());
    }

    @Override
    public NumberOfEntriesResponseDto getRecordsCount() {
        Long modelNumberOfEntries = modelRepository.count();
        return new NumberOfEntriesResponseDto(0L, modelNumberOfEntries, 0L);
    }
}