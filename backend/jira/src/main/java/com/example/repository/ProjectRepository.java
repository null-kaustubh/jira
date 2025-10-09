package com.example.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.entity.Project;
import com.example.model.entity.User;

public interface ProjectRepository extends JpaRepository<Project, Long> {	
	List<Project> findByManager(User manager);
    List<Project> findByEmployeesContaining(User employee);
}