package com.example.CREMIx.service;

import java.util.List;

import com.example.CREMIx.dto.ResolvedTicketDTO;

public interface ResolvedTicketService {
    
    ResolvedTicketDTO createResolvedTicket(ResolvedTicketDTO resolvedTicketDTO);
    
    List<ResolvedTicketDTO> getAllResolvedTickets();
    
    List<ResolvedTicketDTO> getResolvedTicketsByEmployee(Long employeeId);
    
    List<ResolvedTicketDTO> getResolvedTicketsByAdmin(Long adminId);
    
    ResolvedTicketDTO getResolvedTicketByOriginalTicketId(Long ticketId);
    
    ResolvedTicketDTO getResolvedTicketById(Long id);
}