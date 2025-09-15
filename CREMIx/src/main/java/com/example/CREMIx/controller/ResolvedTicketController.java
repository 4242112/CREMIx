package com.example.CREMIx.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.CREMIx.dto.ResolvedTicketDTO;
import com.example.CREMIx.service.ResolvedTicketService;

@RestController
@RequestMapping("/api/resolved-tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class ResolvedTicketController {
    
    @Autowired
    private ResolvedTicketService resolvedTicketService;
    
    // Create a new resolved ticket
    @PostMapping
    public ResponseEntity<ResolvedTicketDTO> createResolvedTicket(@RequestBody ResolvedTicketDTO resolvedTicketDTO) {
        try {
            System.out.println("Creating resolved ticket for original ticket ID: " + resolvedTicketDTO.getOriginalTicketId());
            ResolvedTicketDTO createdResolvedTicket = resolvedTicketService.createResolvedTicket(resolvedTicketDTO);
            System.out.println("Successfully created resolved ticket with ID: " + createdResolvedTicket.getId());
            return new ResponseEntity<>(createdResolvedTicket, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("Error creating resolved ticket: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Get all resolved tickets
    @GetMapping
    public ResponseEntity<List<ResolvedTicketDTO>> getAllResolvedTickets() {
        try {
            List<ResolvedTicketDTO> resolvedTickets = resolvedTicketService.getAllResolvedTickets();
            return ResponseEntity.ok(resolvedTickets);
        } catch (Exception e) {
            System.out.println("Error fetching resolved tickets: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Get resolved ticket by ID
    @GetMapping("/{id}")
    public ResponseEntity<ResolvedTicketDTO> getResolvedTicketById(@PathVariable Long id) {
        try {
            ResolvedTicketDTO resolvedTicket = resolvedTicketService.getResolvedTicketById(id);
            return ResponseEntity.ok(resolvedTicket);
        } catch (Exception e) {
            System.out.println("Error fetching resolved ticket: " + e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    // Get resolved tickets by employee
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ResolvedTicketDTO>> getResolvedTicketsByEmployee(@PathVariable Long employeeId) {
        try {
            List<ResolvedTicketDTO> resolvedTickets = resolvedTicketService.getResolvedTicketsByEmployee(employeeId);
            return ResponseEntity.ok(resolvedTickets);
        } catch (Exception e) {
            System.out.println("Error fetching resolved tickets by employee: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Get resolved tickets by admin
    @GetMapping("/admin/{adminId}")
    public ResponseEntity<List<ResolvedTicketDTO>> getResolvedTicketsByAdmin(@PathVariable Long adminId) {
        try {
            List<ResolvedTicketDTO> resolvedTickets = resolvedTicketService.getResolvedTicketsByAdmin(adminId);
            return ResponseEntity.ok(resolvedTickets);
        } catch (Exception e) {
            System.out.println("Error fetching resolved tickets by admin: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    // Get resolved ticket by original ticket ID
    @GetMapping("/original-ticket/{ticketId}")
    public ResponseEntity<ResolvedTicketDTO> getResolvedTicketByOriginalTicketId(@PathVariable Long ticketId) {
        try {
            ResolvedTicketDTO resolvedTicket = resolvedTicketService.getResolvedTicketByOriginalTicketId(ticketId);
            if (resolvedTicket != null) {
                return ResponseEntity.ok(resolvedTicket);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.out.println("Error fetching resolved ticket by original ticket ID: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}