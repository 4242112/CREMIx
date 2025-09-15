package com.example.CREMIx.repository;

import com.example.CREMIx.dto.QuotationDTO;
import com.example.CREMIx.model.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Quotation entity
 */
@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    
    @Query("""
            SELECT new com.example.CREMIx.dto.QuotationDTO(q)
            FROM Opportunity o
            JOIN o.quotation q
            WHERE o.id = :opportunityId
            """)
    Optional<QuotationDTO> findByOpportunityId(Long opportunityId);
    
    /**
     * Find all quotations for a specific customer that are not in a specific stage
     * This query checks both opportunity-linked quotations and direct customer quotations
     * 
     * @param customerId The ID of the customer
     * @return List of quotations for the customer that are not in the specified stage
     */
    @Query("""
            SELECT q
            FROM Quotation q
            WHERE (
                (q.customer.id = :customerId) OR 
                (q IN (SELECT o.quotation FROM Opportunity o WHERE o.customer.id = :customerId AND o.quotation IS NOT NULL))
            )
            AND q.stage IN (
                'SENT', 
                'ACCEPTED', 
                'REJECTED'
            )
            """)
    List<Quotation> findByCustomerId(Long customerId);
    
    /**
     * Find all quotations for a customer by their email address and only include SENT, ACCEPTED, or REJECTED stages
     * This query checks both opportunity-linked quotations and direct customer quotations
     * (hide DRAFT quotations from customers)
     * 
     * @param email The email address of the customer
     * @return List of non-draft quotations for the customer with the specified email
     */
    @Query("""
            SELECT q
            FROM Quotation q
            WHERE (
                (q.customer.email = :email) OR 
                (q IN (SELECT o.quotation FROM Opportunity o WHERE o.customer.email = :email AND o.quotation IS NOT NULL))
            )
            AND q.stage IN (
                'SENT', 
                'ACCEPTED', 
                'REJECTED'
            )
            """)
    List<Quotation> findByCustomerEmail(String email);
}
