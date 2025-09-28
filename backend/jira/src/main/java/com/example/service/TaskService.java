package com.example.service;

import com.example.model.entity.Task;

import java.util.List;
import java.util.Optional;

public interface TaskService {

    List<Task> getAllTasks(Long projectId, Long assigneeId);

    Optional<Task> getTaskById(Long id);

    Task createTask(Task task);

    Optional<Task> updateTask(Long id, Task updatedTask);

    boolean deleteTask(Long id);
}



// To be implemented here.