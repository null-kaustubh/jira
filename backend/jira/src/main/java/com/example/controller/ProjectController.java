package com.example.controller;

import com.example.model.entity.User;
import com.example.service.ProjectService;
import com.example.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:4200")
public class ProjectController {

    private ProjectService projectService;
    private UserService userService;

    public ProjectController(ProjectService projectService, UserService userService) {
		this.projectService = projectService;
		this.userService = userService;
	}

	@GetMapping
    public ResponseEntity<?> getAllProjects(@RequestHeader("Authorization") String token) {
        try{
            User currentUser = userService.getUserFromToken(token);
            return ResponseEntity.ok(projectService.getAllProjects(currentUser));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try{
            User currentUser = userService.getUserFromToken(token);
            return ResponseEntity.ok(projectService.getProjectById(id, currentUser));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Map<String, Object> request,@RequestHeader("Authorization") String token) {
        try{
            User currentUser = userService.getUserFromToken(token);
            if (!"ADMIN".equals(currentUser.getRole())) {
                return ResponseEntity.status(403).body("Access Denied: Only Admin can create projects");
            }
            return ResponseEntity.ok(projectService.createProject(request, currentUser));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id,@RequestBody Map<String, Object> request,@RequestHeader("Authorization") String token) {
        try{
            User currentUser = userService.getUserFromToken(token);
            return ResponseEntity.ok(projectService.updateProject(id, request, currentUser));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        try{
            User currentUser = userService.getUserFromToken(token);
            if (!"ADMIN".equals(currentUser.getRole())) {
                return ResponseEntity.status(403).body("Access Denied: Only Admin can delete projects");
            }
            projectService.deleteProject(id);
            return ResponseEntity.ok("Project deleted successfully");
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    java.util.Map.of("error", e.getMessage()));
        }
    }
}