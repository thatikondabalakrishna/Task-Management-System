package com.tms.modal;



import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Task {

    @Id
    private int id;
    private String assignee;
    private String name;
    private String description;
    private String duedate;
    private String status;

    // Default constructor
    public Task() {}

    // Constructor with fields
    public Task(int id, String name, String description, String completed) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = completed;
    }

    // Getter and Setter for id
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	

	// Getter and Setter for name
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // Getter and Setter for description
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDuedate() {
		return duedate;
	}

	public void setDuedate(String duedate) {
		this.duedate = duedate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
   
}
