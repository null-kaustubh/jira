package com.example.controller;

import com.example.model.entity.Task;
import com.example.security.JwtUtil;
import com.example.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final JwtUtil jwtUtil;

    public TaskController(TaskService taskService, JwtUtil jwtUtil) {
        this.taskService = taskService;
        this.jwtUtil = jwtUtil;
    }

    private boolean isAuthenticated(String authHeader) {
        try {
            String token = authHeader.substring(7); // Assuming "Bearer " prefix
            return jwtUtil.validateToken(token);
        } catch (Exception e) {
            return false;
        }
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task, @RequestHeader("JWTAuthorization") String authHeader) {
        if (!isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        try {
            Task createdTask = taskService.createTask(task);
            return ResponseEntity.ok(createdTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id, @RequestHeader("JWTAuthorization") String authHeader) {
        if (!isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        try {
            Task task = taskService.getTaskById(id);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<?> getTasksByProjectId(@PathVariable Long projectId, @RequestHeader("JWTAuthorization") String authHeader) {
        if (!isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        try {
            List<Task> tasks = taskService.getTasksByProjectId(projectId);
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllTasks(@RequestHeader("JWTAuthorization") String authHeader) {
        if (!isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        try {
            List<Task> tasks = taskService.getAllTasks();
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task updatedTask, @RequestHeader("JWTAuthorization") String authHeader) {
        if (!isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        try {
            Task task = taskService.updateTask(id, updatedTask);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, @RequestHeader("JWTAuthorization") String authHeader) {
        if (!isAuthenticated(authHeader)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
        }
        try {
            taskService.deleteTask(id);
            return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}