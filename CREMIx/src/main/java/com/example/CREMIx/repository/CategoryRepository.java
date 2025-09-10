package com.example.CREMIx.repository;

import com.example.CREMIx.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByNameContainingIgnoreCase(String name);
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
}
