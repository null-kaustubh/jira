package com.example.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "HISTORY")
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "TASK_ID")
    private Task task;

    @Column(name = "FROM_STATUS")
    private String fromStatus;

    @Column(name = "TO_STATUS")
    private String toStatus;

    @Column(name = "PERFORMED_AT")
    private LocalDateTime performedAt;

    public History() {}

    public History(Long id, Task task, String fromStatus, String toStatus, LocalDateTime performedAt) {
        this.id = id;
        this.task = task;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.performedAt = performedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Task getTask() { return task; }
    public void setTask(Task task) { this.task = task; }

    public String getFromStatus() { return fromStatus; }
    public void setFromStatus(String fromStatus) { this.fromStatus = fromStatus; }

    public String getToStatus() { return toStatus; }
    public void setToStatus(String toStatus) { this.toStatus = toStatus; }

    public LocalDateTime getPerformedAt() { return performedAt; }
    public void setPerformedAt(LocalDateTime performedAt) { this.performedAt = performedAt; }
}