package com.example.CREMIx.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.CREMIx.dto.LeadDTO;
import com.example.CREMIx.model.Lead;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByStatus(String status);

    @Query("""
        SELECT new com.example.CREMIx.dto.LeadDTO(l)
        FROM Lead l
        JOIN l.customer c
        JOIN l.employee e
        WHERE l.status = 'ACTIVE'
        """)
    List<LeadDTO> getAllLeadDetails();

    @Query("""
        SELECT new com.example.CREMIx.dto.LeadDTO(l)
        FROM Lead l
        JOIN l.customer c
        JOIN l.employee e
        WHERE l.id = :id
        """)
    LeadDTO getLeadDetailsById(Long id); // Use the correct type for the ID field in your Lead entity

    @Query("""
        SELECT new com.example.CREMIx.dto.LeadDTO(l)
        FROM Lead l
        JOIN l.customer c
        JOIN l.employee e
        WHERE l.status = 'DELETED'
        """)
    List<LeadDTO> getDeletedLeadDetails();

    @Query("""
        SELECT l
        FROM Lead l
        JOIN l.employee e
        WHERE e.id = :employeeId
        """)
    List<Lead> findByEmployeeId(Long employeeId);
}
