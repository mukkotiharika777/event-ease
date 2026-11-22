package com.eventease.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * Administrator entity inheriting from User.
 * Demonstrates OOP Inheritance and Administrative Privileges.
 */
@Entity
@Table(name = "administrators")
public class Admin extends User {

    @Column(length = 100)
    private String administrativeDesignation;

    private boolean superAdmin;

    public Admin() {
        super();
        setRole("ADMIN");
    }

    public Admin(String fullName, String email, String passwordHash, String department, String designation) {
        super(fullName, email, passwordHash, "ADMIN", department);
        this.administrativeDesignation = designation;
        this.superAdmin = true;
    }

    public String getAdministrativeDesignation() { return administrativeDesignation; }
    public void setAdministrativeDesignation(String administrativeDesignation) { this.administrativeDesignation = administrativeDesignation; }

    public boolean isSuperAdmin() { return superAdmin; }
    public void setSuperAdmin(boolean superAdmin) { this.superAdmin = superAdmin; }
}
