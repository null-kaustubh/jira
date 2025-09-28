package com.example.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Integer>{
	
}