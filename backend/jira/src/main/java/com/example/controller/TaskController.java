package com.example.controller;

import com.example.model.entity.Task;
import com.example.security.JwtUtil;
import com.example.service.TaskService;
import com.example.service.TaskUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/project/{projectId}/tasks")
public class TaskController {

	private TaskUtils taskUtils;
    private final TaskService taskService;
    private final JwtUtil jwtUtil;

    public TaskController(TaskService taskService, JwtUtil jwtUtil, TaskUtils taskUtils) {
        this.taskService = taskService;
        this.jwtUtil = jwtUtil;
        this.taskUtils = taskUtils;
    }

    @GetMapping
    public ResponseEntity<?> getTasksByProjectId(
        @PathVariable Long projectId, @RequestHeader("Authorization") String authHeader
    ) {
        if (!jwtUtil.isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        try {
            String token = authHeader.substring(7);
            String role = jwtUtil.extractRole(token);
            String email = jwtUtil.extractEmail(token);
            List<Task> tasks;
            if ("admin".equalsIgnoreCase(role) || "manager".equalsIgnoreCase(role)) {
                tasks = taskService.getTasksByProjectId(projectId);
            } else {
                tasks = taskService.getTasksByProjectIdAndAssigneeEmail(projectId, email);
            }
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PostMapping
    public ResponseEntity<?> createTask(
        @PathVariable Long projectId, @RequestBody Task task, 
        @RequestHeader("Authorization") String authHeader
    ) {
        if (!jwtUtil.isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        try {
            String token = authHeader.substring(7);
            String role = jwtUtil.extractRole(token);
            if (!"admin".equalsIgnoreCase(role) && !"manager".equalsIgnoreCase(role)) {
                return ResponseEntity.status(403).body(Map.of("error", "Not authorized to create task"));
            }
            
            if (task.getAssignee() == null || task.getAssignee().getUser_id() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Assignee is required"));
            }
            
            Task createdTask = taskService.createTask(projectId, task);
            return ResponseEntity.ok(createdTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        if (!jwtUtil.isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        try {
            Task task = taskService.getTaskById(id);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(
            @PathVariable Long id, @RequestBody Task updatedTask, @RequestHeader("Authorization") String authHeader
    ) {
        if (!jwtUtil.isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        String token = authHeader.substring(7);
        String role = jwtUtil.extractRole(token);
        String email = jwtUtil.extractEmail(token);
        try {
            Task existingTask = taskService.getTaskById(id);

            if ("employee".equalsIgnoreCase(role)) {
            	taskUtils.validateUpdatedTaskStatus(existingTask.getStatus() , updatedTask.getStatus());
            	
                existingTask.setDescription(updatedTask.getDescription());
                existingTask.setType(updatedTask.getType());
                
                if (updatedTask.getStatus() != null && !updatedTask.getStatus().equals(existingTask.getStatus())) existingTask.setStatus(updatedTask.getStatus());
                
                Task savedTask = taskService.save(existingTask);
                return ResponseEntity.ok(savedTask);
            } else {
                taskUtils.isStepSkipAllowed( existingTask.getStatus() , updatedTask.getStatus() , true);

                Task task = taskService.updateTask(id, updatedTask);
                return ResponseEntity.ok(task);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(
            @PathVariable Long id, @RequestHeader("Authorization") String authHeader
    ) {
        if (!jwtUtil.isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        String token = authHeader.substring(7);
        String role = jwtUtil.extractRole(token);
        if (!"admin".equalsIgnoreCase(role) && !"manager".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).body(Map.of("error", "Not authorized to delete task"));
        }
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}