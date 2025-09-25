package com.example.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "PROJECT_MEMBER")
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    private User user;

    @ManyToOne
    @JoinColumn(name = "PROJECT_ID")
    private Project project;

    public ProjectMember() {}

    public ProjectMember(User user, Project project) {
        this.user = user;
        this.project = project;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
}