package org.flynow.dto;

public record UserDTO(String username, String email,
                      String phoneNumber, String country,
                      String firstName, String lastName, String city, String postalCode) {
}
