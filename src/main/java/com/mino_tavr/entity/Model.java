package com.mino_tavr.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "model")
public class Model {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "done")
    private boolean done;
    @Column(name = "note")
    private String note;
    @Column(name = "notification")
    private Date notification;
    @Lob
    @Column(name = "image", columnDefinition = "BLOB")
    private byte[] image;
    @Column(name = "device_type")
    private int deviceType;
    @OneToOne(cascade=CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "interaction_begin_id")
    private Interaction interactionBegin;
    @OneToOne(cascade=CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "interaction_end_id")
    private Interaction interactionEnd;
    @OneToOne(cascade=CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "reason_id")
    private Reason reason;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "description_id")
    private List<Description> descriptions;
}
