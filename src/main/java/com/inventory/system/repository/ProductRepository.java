package com.inventory.system.repository;

import com.inventory.system.model.Product;
import com.inventory.system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCreatedBy(User user);

    List<Product> findByCategory(String category);
}