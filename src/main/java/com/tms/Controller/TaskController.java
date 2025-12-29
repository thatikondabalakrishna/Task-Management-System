package com.tms.Controller;


import com.tms.modal.Task;
import com.tms.modal.Users;
import com.tms.repository.UserRepository;
import com.tms.service.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;
    
    @Autowired
    private UserRepository userRepo;

   /* @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }*/
    
    @GetMapping
    public List<Task> getTasks(Authentication authentication) {

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        Users loggedInUser = userRepo.findById(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return taskService.getTasksBasedOnRole(loggedInUser);
    }
    
    @PostMapping("/createTask")
    public List<Task> createTask(@RequestBody List<Task> task) {
        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable int id, @RequestBody Task task) {
        task.setId(id);
        return taskService.updateTask(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable int id) {
        taskService.deleteTask(id);
    }
}

