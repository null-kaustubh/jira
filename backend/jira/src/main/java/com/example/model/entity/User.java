package com.example.model.entity;

import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "jira_users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long user_id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @NotBlank
    @Column(name = "password", nullable = false)
    private String password;

    @Email
    @NotBlank
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "role", nullable = false)
    private String role;

    @ManyToMany(mappedBy = "employees")
    private Set<Project> projects = new HashSet<>();
    
    public User() {
    }

    public User(Long user_id, String username, String password, String email, String role) {
        this.user_id = user_id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public Long getUser_id() {
		return user_id;
	}

	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}