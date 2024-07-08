package org.flynow.dto;

import jakarta.validation.constraints.NotBlank;

public record RegistrationDTO(@NotBlank(message = "Username is required") String username,
                              @NotBlank(message = "Password is required") String password,
                              @NotBlank(message = "Email is required") String email,
                              String phoneNumber, String country, String city,
                              String firstName, String lastName, String postalCode)  {
}
