package com.example.repository;

import com.example.model.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
	List<Task> findByProject_ProjectId(Long project_id);
	List<Task> findByProject_ProjectIdAndAssignee_Email(Long project_id, String email);
	
}