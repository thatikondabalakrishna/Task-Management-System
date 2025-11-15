package com.tms.modal;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Users {
	
	@Id
	private String username;
	private String password;

	
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


}
