package com.mino_tavr.repository;

import com.mino_tavr.entity.Interaction;

public interface PreviewModels {
    Integer getId();
    byte[] getImage();
    Interaction getInteractionBegin();
}
