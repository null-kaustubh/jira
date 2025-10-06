
package com.example.service;

import com.example.model.entity.Project;
import com.example.repository.ProjectRepository;
import com.example.security.JwtUtil;

import io.jsonwebtoken.Jwts;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

public interface ProjectService {

    List<Project> getAllProjects();

    Optional<Project> getProjectById(Long id);

    Project createProject(Project project, String token);

    Optional<Project> updateProject(Long id, Project updatedProject);

    boolean deleteProject(Long id);

    String getProjectStatus(Long projectId);
}

@Service
class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final JwtUtil jwtUtil;

    public ProjectServiceImpl(ProjectRepository projectRepository,JwtUtil jwtUtil) {
        this.projectRepository = projectRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }
    
    @Override
    public Project createProject(Project project, String token) {
        if (project.getName() == null || project.getName().isEmpty()) {
            throw new IllegalArgumentException("Project name is required");
        }

        String role = Jwts.parserBuilder()
                          .setSigningKey( jwtUtil.getKey())
                          .build()
                          .parseClaimsJws(token)
                          .getBody()
                          .get("role", String.class);

        if (!"MANAGER".equalsIgnoreCase(role) && !"ADMIN".equalsIgnoreCase(role)) {
            throw new SecurityException("Access denied: Only MANAGER or ADMIN can create projects");
        }

        return projectRepository.save(project);
    }

    @Override
    public Optional<Project> updateProject(Long id, Project updatedProject) {
        return projectRepository.findById(id).map(existingProject -> {
            existingProject.setName(updatedProject.getName());
            existingProject.setDescription(updatedProject.getDescription());
            existingProject.setCreatedAt(updatedProject.getCreatedAt());
            existingProject.setCreatedBy(updatedProject.getCreatedBy());
            existingProject.setManager(updatedProject.getManager());
            existingProject.setStatus(updatedProject.getStatus());
            return projectRepository.save(existingProject);
        });
    }

    @Override
    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public String getProjectStatus(Long projectId) {
        return  projectRepository.findById(projectId)
                .map(project -> project.getStatus() != null ? project.getStatus() : "UNKNOWN")
                .orElse(null);
    }
}