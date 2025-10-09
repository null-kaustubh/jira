package com.example.service;

import com.example.model.entity.Project;
import com.example.model.entity.User;
import com.example.repository.ProjectRepository;
import com.example.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

public interface ProjectService {
	List<Project> getAllProjects(User currentUser);
	void deleteProject(Long id);
	Project updateProject(Long id, Map<String, Object> request, User currentUser);
	Project createProject(Map<String, Object> request, User createdBy);
	Project getProjectById(Long id, User currentUser);	
}

@Service
class ProjectServiceImpl implements ProjectService {

    private ProjectRepository projectRepository;
    private UserRepository userRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository, UserRepository userRepository) {
		this.projectRepository = projectRepository;
		this.userRepository = userRepository;
	}

	public List<Project> getAllProjects(User currentUser) {
        String role = currentUser.getRole();

        if ("ADMIN".equals(role)) {
            return projectRepository.findAll();
        } else {
            Set<Project> projects = new HashSet<>(projectRepository.findByEmployeesContaining(currentUser));

            if ("MANAGER".equals(role)) {
                projects.addAll(projectRepository.findByManager(currentUser));
            }
            return new ArrayList<>(projects);
        }
    }

    public Project getProjectById(Long id, User currentUser) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if ("ADMIN".equals(currentUser.getRole())) {
            return project;
        }

        boolean isManager = project.getManager() != null && 
                            project.getManager().getUser_id().equals(currentUser.getUser_id());
        boolean isEmployee = project.getEmployees().contains(currentUser);

        if (isManager || isEmployee) {
            return project;
        }

        throw new RuntimeException("Access Denied: You are not part of this project");
    }

    public Project createProject(Map<String, Object> request, User createdBy) {
        Project project = new Project();

        project.setName((String) request.get("name"));
        project.setDescription((String) request.get("description"));
        project.setStatus((String) request.getOrDefault("status", "Pending"));
        project.setCreatedAt(LocalDateTime.now());
        project.setCreatedBy(createdBy.getEmail());

        Integer managerId = (Integer) request.get("manager_id");
        if (managerId != null) {
            User manager = userRepository.findById(Long.valueOf(managerId))
                    .orElseThrow(() -> new RuntimeException("Manager not found"));
            project.setManager(manager);
        }

        List<Integer> employeeIds = (List<Integer>) request.get("employeeIds");
        System.out.println(employeeIds+" - "+ employeeIds != null+" - " + !employeeIds.isEmpty() );
        if (employeeIds != null && !employeeIds.isEmpty()) {
            Set<User> employees = employeeIds.stream()
                    .map(id -> userRepository.findById(Long.valueOf(id))
                            .orElseThrow(() -> new RuntimeException("Employee not found: " + id)))
                    .collect(Collectors.toSet());
            project.setEmployees(employees);
        }

        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Map<String, Object> request, User currentUser) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        String role = currentUser.getRole();

        if ("ADMIN".equals(role)) {
            if (request.get("name") != null)
                existingProject.setName((String) request.get("name"));
        }
        if ("ADMIN".equals(role) || "MANAGER".equals(role)) {
            boolean isManager = existingProject.getManager() != null &&
                                existingProject.getManager().getUser_id().equals(currentUser.getUser_id());

            if ("MANAGER".equals(role) && !isManager) {
                throw new RuntimeException("Access Denied: You are not managing this project");
            }

            if (request.get("description") != null)
                existingProject.setDescription((String) request.get("description"));

            if (request.get("status") != null)
                existingProject.setStatus((String) request.get("status"));
        } else {
            throw new RuntimeException("Access Denied: Only Admin or Manager can update projects");
        }

        return projectRepository.save(existingProject);
    }
    
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}