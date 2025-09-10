package com.example.CREMIx.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.CREMIx.dto.LoginRequestDTO;
import com.example.CREMIx.dto.LoginResponseDTO;
import com.example.CREMIx.dto.CustomerRegistrationDTO;
import com.example.CREMIx.model.Customer;
import com.example.CREMIx.repository.CustomerRepository;
import com.example.CREMIx.service.EmployeeService;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private EmployeeService employeeService;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register/customer")
    public ResponseEntity<?> registerCustomer(@RequestBody CustomerRegistrationDTO registrationDTO) {
        if (registrationDTO.getFirstName() == null || registrationDTO.getFirstName().isBlank() ||
            registrationDTO.getLastName() == null || registrationDTO.getLastName().isBlank() ||
            registrationDTO.getEmail() == null || registrationDTO.getEmail().isBlank() ||
            registrationDTO.getPassword() == null || registrationDTO.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Missing required fields");
        }
        // Check if email already exists
        Optional<Customer> existingCustomer = customerRepository.findByEmail(registrationDTO.getEmail());
        
        Customer customer;
        if (existingCustomer.isPresent()) {
            customer = existingCustomer.get();
            
            // If customer already has a password, don't allow re-registration
            if (customer.getHasPassword() != null && customer.getHasPassword()) {
                return ResponseEntity.badRequest().body("Email already registered with password. Please use login instead.");
            }
            
            // Update existing customer with password and registration details
            String fullName = registrationDTO.getFirstName() + " " + registrationDTO.getLastName();
            customer.setName(fullName);
            if (registrationDTO.getPhoneNumber() != null && !registrationDTO.getPhoneNumber().isBlank()) {
                customer.setPhoneNumber(registrationDTO.getPhoneNumber());
            }
            customer.setPasswordHash(passwordEncoder.encode(registrationDTO.getPassword()));
            customer.setHasPassword(true);
        } else {
            // Create new customer
            customer = new Customer();
            String fullName = registrationDTO.getFirstName() + " " + registrationDTO.getLastName();
            customer.setName(fullName);
            customer.setEmail(registrationDTO.getEmail());
            customer.setPhoneNumber(registrationDTO.getPhoneNumber());
            customer.setPasswordHash(passwordEncoder.encode(registrationDTO.getPassword()));
            customer.setHasPassword(true);
        }

        // Save customer
        Customer savedCustomer = customerRepository.save(customer);

        return ResponseEntity.ok().body("Registration successful");
    }
    
    @PostMapping("/login/employee")
    public ResponseEntity<LoginResponseDTO> employeeLogin(@RequestBody LoginRequestDTO loginRequest) {
        boolean isAuthenticated = employeeService.validateCredentials(
                loginRequest.getEmail(), 
                loginRequest.getPassword());
        
        if (isAuthenticated) {
            var employee = employeeService.findByEmail(loginRequest.getEmail());
            LoginResponseDTO response = new LoginResponseDTO(
                true,
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                "EMPLOYEE"
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(new LoginResponseDTO(false, null, null, null, null));
        }
    }
    
    @PostMapping("/login/customer")
    public ResponseEntity<LoginResponseDTO> customerLogin(@RequestBody LoginRequestDTO loginRequest) {
        // Find customer by email
        Optional<Customer> customerOpt = customerRepository.findByEmail(loginRequest.getEmail());
        
        if (customerOpt.isEmpty()) {
            // Customer not found
            return ResponseEntity.status(404).body(new LoginResponseDTO(false, null, null, null, null));
        }
        
        Customer customer = customerOpt.get();
        
        // Check if customer has a password set
        if (customer.getPasswordHash() == null || !customer.getHasPassword()) {
            // Password not set for this customer
            return ResponseEntity.status(403).body(new LoginResponseDTO(false, null, null, null, null));
        }
        
        // Validate password
        boolean isAuthenticated = passwordEncoder.matches(loginRequest.getPassword(), customer.getPasswordHash());
        
        if (isAuthenticated) {
            LoginResponseDTO response = new LoginResponseDTO(
                true,
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                "CUSTOMER"
            );
            response.setCustomerId(customer.getId());
            response.setCustomerName(customer.getName());
            return ResponseEntity.ok(response);
        } else {
            // Invalid password
            return ResponseEntity.status(401).body(new LoginResponseDTO(false, null, null, null, null));
        }
    }
}
