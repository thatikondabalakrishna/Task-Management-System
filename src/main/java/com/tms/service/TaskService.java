package com.tms.service;


import com.tms.modal.Task;
import com.tms.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepo;

    public List<Task> getAllTasks() {
        return taskRepo.findAll();
    }

    public List<Task> createTask(List<Task> task) {
        return taskRepo.saveAll(task);
    }

    public void deleteTask(int id) {
        taskRepo.deleteById(id);
    }

    public Task updateTask(Task task) {
        return taskRepo.save(task);
    }
}
