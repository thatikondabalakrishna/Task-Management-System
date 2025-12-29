package com.tms.modal;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Users {
	
	@Id
	private String username;
	private String password;
	private String role;
	
	@ManyToOne
	@JsonIgnore
    @JoinColumn(name = "manager_username")
    private Users manager;

	
	public Users() {
	
	}

	public String getUserName() {
		return username;
	}

	public void setUserName(String userName) {
		this.username = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Users getManager() {
		return manager;
	}

	public void setManager(Users manager) {
		this.manager = manager;
	}
	


}
