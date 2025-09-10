package com.example.CREMIx.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class CustomerRegistrationDTO {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    @Email
    private String email;
    private String phoneNumber;
    @NotBlank
    private String password;
    private String name;
    private String address;
    private String city;
    private String state;
}