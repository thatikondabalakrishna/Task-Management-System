package com.tms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tms.modal.Users;

public interface UserRepository extends JpaRepository<Users, String> {

	Users findByUsernameAndPassword(String username, String password);
	  Optional<Users> findByUsername(String username);

}
