package com.mino_tavr.broker;

import lombok.Getter;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;


@Getter
@Component
public class ImageBroker {
    private final byte[] dummyImageModelPreview;
    public ImageBroker() throws IOException {
        BufferedImage bImage = ImageIO.read(new ClassPathResource("images/dummy_model.png").getInputStream());
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(bImage, "png", bos);
        this.dummyImageModelPreview = bos.toByteArray();
    }

    public byte[] resizeImage(byte[] originalImage, int targetWidth, int targetHeight) throws IOException {
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics2D = resizedImage.createGraphics();
        BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(originalImage));
        graphics2D.drawImage(bufferedImage, 0, 0, targetWidth, targetHeight, null);
        graphics2D.dispose();
        ByteArrayOutputStream imageToSave = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "jpg", imageToSave);
        return imageToSave.toByteArray();
    }
}
