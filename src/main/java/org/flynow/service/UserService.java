package org.flynow.service;


import org.flynow.dto.LoginDTO;
import org.flynow.dto.RegistrationDTO;
import org.flynow.dto.UserDTO;

public interface UserService {
    UserDTO registerUser(RegistrationDTO registrationDTO);
    UserDTO loginUser(LoginDTO loginDTO);
}
