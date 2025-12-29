package com.tms.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tms.modal.Task;

public interface TaskRepository extends JpaRepository<Task,Integer> {
	
    List<Task> findByAssignedUser_Username(String username);

    List<Task> findByAssignedUser_Manager_Username(String managerUsername);
}
