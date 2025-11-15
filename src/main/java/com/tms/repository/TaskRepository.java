package com.tms.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.tms.modal.Task;

public interface TaskRepository extends JpaRepository<Task,Integer> {
}
