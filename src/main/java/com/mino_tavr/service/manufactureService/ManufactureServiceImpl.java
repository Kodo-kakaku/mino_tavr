package com.mino_tavr.service.manufactureService;

import com.mino_tavr.broker.ImageBroker;
import com.mino_tavr.dto.manufacturing.*;
import com.mino_tavr.entity.*;
import com.mino_tavr.repository.ModelRepository;
import com.mino_tavr.repository.PreviewModels;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Date;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ManufactureServiceImpl implements ManufactureService {
    private final ImageBroker imageBroker;
    private final ModelRepository modelRepository;


    private Reason makeReason(int reasonType, String reasonNumber) {
        Reason reason = new Reason();
        reason.setReasonType(reasonType);
        reason.setReasonNumber(reasonNumber);
        return reason;
    }

    private Employee getEmployeeFromEmployeeDto(EmployeeDto employeeDto) {
        Employee employee = new Employee();
        employee.setName(employeeDto.getName());
        employee.setSubdivision(employeeDto.getSubdivision());
        employee.setDepartment(employeeDto.getDepartment());
        return employee;
    }

    private Interaction getInteractionFromInteractionDto(InteractionDto interactionDto) {
        Interaction interaction = new Interaction();
        if(interactionDto.getDate() != null) {
            interaction.setDate(Date.valueOf(interactionDto.getDate()));
        }
        interaction.setDealer(getEmployeeFromEmployeeDto(interactionDto.getDealer()));
        interaction.setMember(getEmployeeFromEmployeeDto(interactionDto.getMember()));
        return interaction;
    }

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

    private PreviewModelsResponseDto getModelPreview(PreviewModels model) {
        var singleModel = new PreviewModelsResponseDto();
        singleModel.setId(model.getId());
        singleModel.setImage(model.getImage());
        singleModel.setDate(model.getInteractionBegin().getDate());
        return singleModel;
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
        Long repair = 0L;
        Long all = repair + modelNumberOfEntries;
        return new NumberOfEntriesResponseDto(all, modelNumberOfEntries, repair);
    }

    @Override
    public ModelIdResponseDto addModel(AddModelRequestDto dataOfNewModel) {
        // Create Model and save data(Model) to repository(DB)
        Model model = new Model();
        model.setDone(false);
        model.setNotification(dataOfNewModel.getNotification());
        model.setImage(imageBroker.getDummyImageModelPreview());
        model.setDeviceType(dataOfNewModel.getDeviceType());
        model.setInteractionBegin(getInteractionFromInteractionDto(dataOfNewModel.getInteractionBegin()));
        model.setInteractionEnd(getInteractionFromInteractionDto(dataOfNewModel.getInteractionEnd()));
        model.setReason(makeReason(dataOfNewModel.getReason(), dataOfNewModel.getReasonNumber()));

        /* Create Description fields and set to model */
        model.setDescriptions(dataOfNewModel.getDescriptions().stream()
                .map(this::getDescriptionFromDescriptionDto)
                .collect(Collectors.toList()));

        return new ModelIdResponseDto(modelRepository.save(model).getId());
    }

    @Override
    public void updateModel(SingleModelResponseDto modelData) throws IOException {
        var model = modelRepository.findById(modelData.getId()).orElseThrow(IllegalArgumentException::new);
        if (modelData.getImage() != null) {
            model.setImage(imageBroker.resizeImage(modelData.getImage(), 500, 500));
        }
        model.setDeviceType(modelData.getDeviceType());
        model.setDone(modelData.isDone());
        model.setNote(modelData.getNote());
        model.setNotification(modelData.getNotification());
        model.setReason(makeReason(modelData.getReason(), modelData.getReasonNumber()));
        model.setInteractionBegin(getInteractionFromInteractionDto(modelData.getInteractionBegin()));
        model.setInteractionEnd(getInteractionFromInteractionDto(modelData.getInteractionEnd()));
        model.setDescriptions(modelData.getDescriptions().stream()
                .map(this::getDescriptionFromDescriptionDto)
                .collect(Collectors.toList())
        );
        modelRepository.save(model);
    }
}