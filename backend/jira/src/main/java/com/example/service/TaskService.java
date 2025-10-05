package com.example.service;

import com.example.model.entity.Project;
import com.example.model.entity.Task;
import com.example.model.entity.User;
import java.util.List;
import com.example.repository.ProjectRepository;
import com.example.repository.TaskRepository;
import com.example.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

public interface TaskService {
    Task createTask(Long projectId, Task task);
    Task getTaskById(Long id);
    List<Task> getTasksByProjectId(Long projectId);
    List<Task> getAllTasks();
    Task updateTask(Long id, Task updatedTask);
    void deleteTask(Long id);
    Task save(Task task);
	List<Task> getTasksByProjectIdAndAssigneeEmail(Long projectId, String email);
}

@Service
class TaskServiceImpl implements TaskService {

	private ProjectRepository projectRepository;
	private UserRepository userRepository;
    private final TaskRepository taskRepository;

	public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public Task createTask(Long projectId, Task task) {
        if (task.getTitle() == null || task.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Task title is required");
        }
        
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        task.setProject(project);

        User assignee = userRepository.findById(task.getAssignee().getUser_id())
                .orElseThrow(() -> new RuntimeException("Assignee not found with id: " + task.getAssignee().getUser_id()));
        task.setAssignee(assignee);
        
        if (task.getProject() == null) {
            throw new IllegalArgumentException("Project is required for the task");
        }
        
        task.setCreatedAt(LocalDateTime.now());
        
        if (task.getStatus() == null) {
            task.setStatus("TO_DO");
        }
        return taskRepository.save(task);
    }

    @Override
    public Task save(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    @Override
    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProject_ProjectId(projectId);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task updateTask(Long id, Task updatedTask) {
        Task existingTask = getTaskById(id);
        if (updatedTask.getTitle() != null) {
            existingTask.setTitle(updatedTask.getTitle());
        }
        if (updatedTask.getDescription() != null) {
            existingTask.setDescription(updatedTask.getDescription());
        }
        if (updatedTask.getType() != null) {
            existingTask.setType(updatedTask.getType());
        }
        if (updatedTask.getPriority() != null) {
            existingTask.setPriority(updatedTask.getPriority());
        }
        if (updatedTask.getStatus() != null) {
            existingTask.setStatus(updatedTask.getStatus());
        }
        if (updatedTask.getAssignee() != null) {
            existingTask.setAssignee(updatedTask.getAssignee());
        }
        if (updatedTask.getDueDate() != null) {
            existingTask.setDueDate(updatedTask.getDueDate());
        }
        if (updatedTask.getProject() != null) {
            existingTask.setProject(updatedTask.getProject());
        }
        return taskRepository.save(existingTask);
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Task not found with id: " + id);
        }
        taskRepository.deleteById(id);
    }

	@Override
	public List<Task> getTasksByProjectIdAndAssigneeEmail(Long projectId, String email) {
		return taskRepository.findByProject_ProjectIdAndAssignee_Email(projectId, email);
	}
}