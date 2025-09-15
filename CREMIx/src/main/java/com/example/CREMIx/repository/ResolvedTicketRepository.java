package com.example.CREMIx.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.CREMIx.model.ResolvedTicket;

@Repository
public interface ResolvedTicketRepository extends JpaRepository<ResolvedTicket, Long> {
    
    // Find resolved tickets by employee
    @Query("SELECT rt FROM ResolvedTicket rt WHERE rt.employee.id = :employeeId ORDER BY rt.resolvedAt DESC")
    List<ResolvedTicket> findByEmployeeIdOrderByResolvedAtDesc(@Param("employeeId") Long employeeId);
    
    // Find resolved tickets by admin
    @Query("SELECT rt FROM ResolvedTicket rt WHERE rt.admin.id = :adminId ORDER BY rt.resolvedAt DESC")
    List<ResolvedTicket> findByAdminIdOrderByResolvedAtDesc(@Param("adminId") Long adminId);
    
    // Find resolved ticket by original ticket ID
    @Query("SELECT rt FROM ResolvedTicket rt WHERE rt.originalTicket.id = :ticketId")
    ResolvedTicket findByOriginalTicketId(@Param("ticketId") Long ticketId);
    
    // Get all resolved tickets ordered by resolved date
    List<ResolvedTicket> findAllByOrderByResolvedAtDesc();
}