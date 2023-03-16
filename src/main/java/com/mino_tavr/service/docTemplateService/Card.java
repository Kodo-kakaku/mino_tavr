package com.mino_tavr.service.docTemplateService;

import com.mino_tavr.dto.SingleModelResponseDto;
import lombok.Getter;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.xmlbeans.XmlException;
import org.springframework.core.io.ClassPathResource;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Getter
public abstract class Card {
    private final SingleModelResponseDto docData;
    private final XWPFDocument doc;
    private final List<XWPFTable> tables;
    private final String[] deviceType = {"Аудио", "Фото", "Видео", "Иное"};
    private final String[] reasonType = {"Служебная записка", "Журнал", "Иное"};

    public void writeField(XWPFTableCell cell, String val, int frontSize) {
        cell.removeParagraph(0);
        var paragraph = cell.addParagraph();
        paragraph.setAlignment(ParagraphAlignment.CENTER);

        var runner = paragraph.createRun();
        runner.setFontFamily("Arial");
        runner.setFontSize(frontSize);
        runner.setText(val);
    }
    protected Card(SingleModelResponseDto docData, DocumentPath documentPath) throws IOException {
        if (docData == null)
            throw new IllegalArgumentException("ManufacturingDoc cannot be null");

        this.docData = docData;
        try (InputStream inputStream = new ClassPathResource(documentPath.getDocPath()).getInputStream()) {
            this.doc = new XWPFDocument(inputStream);
            this.tables = doc.getTables();
        }
    }
    public abstract ByteArrayInputStream crateDocument() throws IOException, InvalidFormatException, XmlException;
}
