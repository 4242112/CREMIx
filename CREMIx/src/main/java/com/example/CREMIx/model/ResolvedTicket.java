package com.example.CREMIx.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "resolved_ticket")
@Data
public class ResolvedTicket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String ticketDescription;
    
    @Column(length = 2000, nullable = false)
    private String resolveDescription;
    
    @ManyToOne
    @JoinColumn(name = "original_ticket_id", nullable = false)
    private Ticket originalTicket;
    
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Employee admin; // Admin who resolved (can be same as employee)
    
    @CreationTimestamp
    private LocalDateTime resolvedAt;
    
    // Constructor
    public ResolvedTicket() {}
    
    public ResolvedTicket(String title, String ticketDescription, String resolveDescription, 
                         Ticket originalTicket, Employee employee, Employee admin) {
        this.title = title;
        this.ticketDescription = ticketDescription;
        this.resolveDescription = resolveDescription;
        this.originalTicket = originalTicket;
        this.employee = employee;
        this.admin = admin;
    }
}