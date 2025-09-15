package com.example.CREMIx.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.example.CREMIx.model.ResolvedTicket;

import lombok.Data;

@Data
public class ResolvedTicketDTO {
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yy HH:mm");
    
    private Long id;
    private String title;
    private String ticketDescription;
    private String resolveDescription;
    private Long originalTicketId;
    private Long employeeId;
    private String employeeName;
    private Long adminId;
    private String adminName;
    private String resolvedAt;
    
    // Default constructor
    public ResolvedTicketDTO() {}
    
    // Constructor from ResolvedTicket entity
    public ResolvedTicketDTO(ResolvedTicket resolvedTicket) {
        this.id = resolvedTicket.getId();
        this.title = resolvedTicket.getTitle();
        this.ticketDescription = resolvedTicket.getTicketDescription();
        this.resolveDescription = resolvedTicket.getResolveDescription();
        
        if (resolvedTicket.getOriginalTicket() != null) {
            this.originalTicketId = resolvedTicket.getOriginalTicket().getId();
        }
        
        if (resolvedTicket.getEmployee() != null) {
            this.employeeId = resolvedTicket.getEmployee().getId();
            this.employeeName = resolvedTicket.getEmployee().getName();
        }
        
        if (resolvedTicket.getAdmin() != null) {
            this.adminId = resolvedTicket.getAdmin().getId();
            this.adminName = resolvedTicket.getAdmin().getName();
        }
        
        if (resolvedTicket.getResolvedAt() != null) {
            this.resolvedAt = resolvedTicket.getResolvedAt().format(DATE_FORMATTER);
        }
    }
}