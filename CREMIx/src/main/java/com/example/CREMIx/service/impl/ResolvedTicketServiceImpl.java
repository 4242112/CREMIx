package com.example.CREMIx.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.CREMIx.dto.ResolvedTicketDTO;
import com.example.CREMIx.model.Employee;
import com.example.CREMIx.model.ResolvedTicket;
import com.example.CREMIx.model.Ticket;
import com.example.CREMIx.repository.EmployeeRepository;
import com.example.CREMIx.repository.ResolvedTicketRepository;
import com.example.CREMIx.repository.TicketRepository;
import com.example.CREMIx.service.ResolvedTicketService;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class ResolvedTicketServiceImpl implements ResolvedTicketService {
    
    @Autowired
    private ResolvedTicketRepository resolvedTicketRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Override
    public ResolvedTicketDTO createResolvedTicket(ResolvedTicketDTO resolvedTicketDTO) {
        // Get the original ticket
        Ticket originalTicket = ticketRepository.findById(resolvedTicketDTO.getOriginalTicketId())
            .orElseThrow(() -> new EntityNotFoundException("Ticket not found with id: " + resolvedTicketDTO.getOriginalTicketId()));
        
        // Get employee if provided
        Employee employee = null;
        if (resolvedTicketDTO.getEmployeeId() != null) {
            employee = employeeRepository.findById(resolvedTicketDTO.getEmployeeId())
                .orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + resolvedTicketDTO.getEmployeeId()));
        }
        
        // Get admin if provided
        Employee admin = null;
        if (resolvedTicketDTO.getAdminId() != null) {
            admin = employeeRepository.findById(resolvedTicketDTO.getAdminId())
                .orElseThrow(() -> new EntityNotFoundException("Admin not found with id: " + resolvedTicketDTO.getAdminId()));
        }
        
        // Create ResolvedTicket entity
        ResolvedTicket resolvedTicket = new ResolvedTicket(
            resolvedTicketDTO.getTitle(),
            resolvedTicketDTO.getTicketDescription(),
            resolvedTicketDTO.getResolveDescription(),
            originalTicket,
            employee,
            admin
        );
        
        // Save the resolved ticket
        ResolvedTicket savedResolvedTicket = resolvedTicketRepository.save(resolvedTicket);
        
        // Update original ticket status to RESOLVED
        originalTicket.setStatus(Ticket.TicketStatus.RESOLVED);
        ticketRepository.save(originalTicket);
        
        return new ResolvedTicketDTO(savedResolvedTicket);
    }
    
    @Override
    public List<ResolvedTicketDTO> getAllResolvedTickets() {
        return resolvedTicketRepository.findAllByOrderByResolvedAtDesc()
            .stream()
            .map(ResolvedTicketDTO::new)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ResolvedTicketDTO> getResolvedTicketsByEmployee(Long employeeId) {
        return resolvedTicketRepository.findByEmployeeIdOrderByResolvedAtDesc(employeeId)
            .stream()
            .map(ResolvedTicketDTO::new)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<ResolvedTicketDTO> getResolvedTicketsByAdmin(Long adminId) {
        return resolvedTicketRepository.findByAdminIdOrderByResolvedAtDesc(adminId)
            .stream()
            .map(ResolvedTicketDTO::new)
            .collect(Collectors.toList());
    }
    
    @Override
    public ResolvedTicketDTO getResolvedTicketByOriginalTicketId(Long ticketId) {
        ResolvedTicket resolvedTicket = resolvedTicketRepository.findByOriginalTicketId(ticketId);
        return resolvedTicket != null ? new ResolvedTicketDTO(resolvedTicket) : null;
    }
    
    @Override
    public ResolvedTicketDTO getResolvedTicketById(Long id) {
        ResolvedTicket resolvedTicket = resolvedTicketRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Resolved ticket not found with id: " + id));
        return new ResolvedTicketDTO(resolvedTicket);
    }
}