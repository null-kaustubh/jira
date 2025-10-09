package com.example.service;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.model.entity.Task;

@Component
public class TaskUtils {

	private final List<String> STATUS_FLOW = List.of("TO_DO", "IN_PROGRESS", "IN_REVIEW", "DONE");

	public int getStatusIndex(String status) {
		return STATUS_FLOW.indexOf(status);
	}

    public boolean isStepSkipAllowed(String oldStatus, String newStatus, boolean isManager){
        int oldIndex = STATUS_FLOW.indexOf(oldStatus);
        int newIndex = STATUS_FLOW.indexOf(newStatus);

        if(isManager && newIndex==0 && oldIndex==2) return true;
        return Math.abs(newIndex - oldIndex) != 1;
    }

    public void validateUpdatedTaskStatus(String oldStatus, String newStatus) {
        if (isStepSkipAllowed(oldStatus, newStatus, false)) throw new IllegalArgumentException("Invalid status transition. Cannot skip steps.");
        
        if (STATUS_FLOW.indexOf(newStatus) < STATUS_FLOW.indexOf(oldStatus)) throw new IllegalArgumentException("Employees cannot move status backward.");

        if ("IN_REVIEW".equals(oldStatus) && "DONE".equals(newStatus)) throw new IllegalArgumentException("Only admin/manager can mark IN_REVIEW as DONE.");
	}

}
