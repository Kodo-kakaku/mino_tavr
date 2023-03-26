package com.mino_tavr.service.docTemplateService;

import com.mino_tavr.dto.manufacturing.SingleModelResponseDto;
import org.apache.poi.xwpf.usermodel.XWPFTable;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class TicketCard extends Card {
    private void writeTitleField(List<XWPFTable> tables, SingleModelResponseDto docData) {
        final int fs = 16;
        var cardNumberCell = tables.get(0).getRow(0).getCell(1);
        writeField(cardNumberCell, docData.getId().toString(), fs);
        cardNumberCell = tables.get(4).getRow(0).getCell(1);
        writeField(cardNumberCell, docData.getId().toString(), fs);
    }
    private void writeDateField(List<XWPFTable> tables, SingleModelResponseDto docData) {
        final var dateBegin = tables.get(1).getRow(2).getCell(0);
        writeField(dateBegin, docData.getInteractionBegin().getDate().toString(), 14);
    }
    private void writeInteractionField(List<XWPFTable> tables, SingleModelResponseDto docData) {
        final int fs = 12;
        int rowPosition = 2;
        for(final var interaction : List.of(docData.getInteractionBegin().getDealer(),
                docData.getInteractionBegin().getMember())) {
            final var nameCell = tables.get(6).getRow(rowPosition).getCell(0);
            writeField(nameCell, interaction.getName(), fs);
            final var managementCell = tables.get(6).getRow(rowPosition).getCell(1);
            writeField(managementCell, interaction.getSubdivision(), fs);
            final var departmentCell = tables.get(6).getRow(rowPosition).getCell(2);
            writeField(departmentCell, interaction.getDepartment(), fs);
            rowPosition = 5;
        }
    }
    public TicketCard(SingleModelResponseDto documentData, DocumentPath documentPath) throws IOException {
        super(documentData, documentPath);
    }
    @Override
    public ByteArrayInputStream crateDocument() throws IOException {
        writeTitleField(this.getTables(), this.getDocData());
        writeDateField(this.getTables(), this.getDocData());
        writeInteractionField(this.getTables(), this.getDocData());

        final ByteArrayOutputStream b = new ByteArrayOutputStream();
        this.getDoc().write(b);
        return new ByteArrayInputStream(b.toByteArray());
    }
}
