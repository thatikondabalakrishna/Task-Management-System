package com.tms.service;


import com.tms.modal.Task;
import com.tms.modal.Users;
import com.tms.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepo;

   /* public List<Task> getAllTasks() {
        return taskRepo.findAll();
    }*/
  
    public List<Task> getTasksBasedOnRole(Users loggedInUser) {

        String role = loggedInUser.getRole();

        if ("ADMIN".equalsIgnoreCase(role)) {
            return taskRepo.findAll();
        }

        if ("A2".equalsIgnoreCase(role)) {
            return taskRepo
                   .findByAssignedUser_Manager_Username(
                       loggedInUser.getUserName());
        }

        return taskRepo
               .findByAssignedUser_Username(
                   loggedInUser.getUserName());
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
