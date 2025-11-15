package com.tms.Controller;


import com.tms.modal.Task;
import com.tms.service.TaskService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
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

