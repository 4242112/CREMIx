package com.example.CREMIx.dto;

import com.example.CREMIx.misc.ActivityStatus;
import com.example.CREMIx.model.Customer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private Long id;
    private String name;
    private String phoneNumber;
    private String email;
    private String address;
    private String city;
    private String state;
    private Integer zipCode;
    private String country;
    private String website;
    private Customer.CustomerType type;
    private Boolean hasPassword;
    private ActivityStatus status;
    
    public static CustomerDTO fromEntity(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setPhoneNumber(customer.getPhoneNumber());
        dto.setEmail(customer.getEmail());
        dto.setAddress(customer.getAddress());
        dto.setCity(customer.getCity());
        dto.setState(customer.getState());
        dto.setZipCode(customer.getZipCode());
        dto.setCountry(customer.getCountry());
        dto.setWebsite(customer.getWebsite());
        dto.setType(customer.getType());
        dto.setHasPassword(customer.getHasPassword());
        dto.setStatus(customer.getStatus());
        return dto;
    }
}
