package com.example.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jira_task_history")
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @Column(name = "from_status")
    private String fromStatus;

    @Column(name = "to_status")
    private String toStatus;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    public History() {
    }

    public History(Long id, Task task, String fromStatus, String toStatus, LocalDateTime submittedAt) {
        this.id = id;
        this.task = task;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.submittedAt = submittedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public String getFromStatus() {
        return fromStatus;
    }

    public void setFromStatus(String fromStatus) {
        this.fromStatus = fromStatus;
    }

    public String getToStatus() {
        return toStatus;
    }

    public void setToStatus(String toStatus) {
        this.toStatus = toStatus;
    }

    public LocalDateTime getPerformedAt() {
        return submittedAt;
    }

    public void setPerformedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}