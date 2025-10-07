package com.example.service;

import java.util.List;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.model.entity.User;
import com.example.repository.UserRepository;
import com.example.security.JwtUtil;

public interface UserService {
    User registerUser(User user);
    User loginUser(String email, String password);
    User updateUser(Long id, User updates);
    void deleteUser(Long id);
	User getUserById(Long id);
	List<User> findAllUsers();
	User getUserFromToken(String token);
	String getEmailFromToken(String token);
}

@Service
class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtService;

    public UserServiceImpl(UserRepository userRepository, JwtUtil jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = new Argon2PasswordEncoder(16, 32, 1, 1 << 12, 3);
        this.jwtService = jwtService;
    }

    @Override
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            user.setRole("USER");
        }
        return userRepository.save(user);
    }

    @Override
    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    @Override
    public User updateUser(Long id, User updates) {
        User existing = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (updates.getEmail() != null && !updates.getEmail().equals(existing.getEmail())) {
            if (userRepository.existsByEmail(updates.getEmail())) throw new RuntimeException("Email already in use");
            
            existing.setEmail(updates.getEmail());
        }

        if (updates.getPassword() != null && !updates.getPassword().isBlank()) existing.setPassword(passwordEncoder.encode(updates.getPassword())); 

        if (updates.getRole() != null && !updates.getRole().isBlank()) existing.setRole(updates.getRole());

        if (updates.getUsername() != null) existing.setUsername(updates.getUsername() );

        return userRepository.save(existing);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) throw new RuntimeException("User not found with id: " + id);
        
        userRepository.deleteById(id);
    }

	@Override
	public User getUserById(Long id) {
		return userRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
	}

	@Override
	public List<User> findAllUsers() {
		return userRepository.findAll();
	}
    
	public User getUserFromToken(String token) {
	    String email = getEmailFromToken(token);
	    return userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));
	}

	public String getEmailFromToken(String token) {
	    if (token.startsWith("Bearer ")) token = token.substring(7);
	    return jwtService.extractEmail(token);
	}

}