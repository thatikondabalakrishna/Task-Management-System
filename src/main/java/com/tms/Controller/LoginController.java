package com.tms.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.reactive.ClientHttpResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.tms.modal.Users;
import com.tms.repository.UserRepository;

@Controller
public class LoginController {
	
	@Autowired
	UserRepository userrepo;
	
	@GetMapping("/login")
	public String loginPage() {
		return "login"; 
	}
	
	@GetMapping("/Register")
	public String register() {
		return "Register"; 
	}

	@PostMapping("/loginAccount")
	public String loginAccount(@RequestParam("userName") String userName,@RequestParam("Password") String Password,
			Model model) {
		Users user=userrepo.findByUsernameAndPassword(userName, Password);
		 if (user != null) {
				return "TaskManagement"; 
		    } else {
		        model.addAttribute("error", "Invalid Credentials");
		        return "login"; // stay on login page
		    }
		
	}
	
	@PostMapping("/Logout")
	public String Logout() {
		return "login"; 
	}
	
	
	@PostMapping("/registration")
	public String registration(@RequestParam("userName") String username,@RequestParam("Password") String Password,
			Model model) {
		
		 if (userrepo.existsById(username)) {
	            model.addAttribute("error", "Username already exists");
	            return "register";
	        }
		 
		    Users newUser = new Users();
	        newUser.setUserName(username);
	        newUser.setPassword(Password); // NOTE: store encrypted password in real apps
	       if(userrepo.save(newUser)!=null) {
	        
	        model.addAttribute("Status", "Successfully User Registered");
	       }else {
	            model.addAttribute("error", "Error occured while registration");
	       }
		return "login"; 
	}

	
}
