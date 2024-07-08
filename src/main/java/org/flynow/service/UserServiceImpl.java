package org.flynow.service;

import org.flynow.dto.LoginDTO;
import org.flynow.dto.RegistrationDTO;
import org.flynow.dto.UserDTO;
import org.flynow.entity.Address;
import org.flynow.entity.User;
import org.flynow.repository.UserRepo;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements  UserService{
    UserRepo userRepo;
    PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }
    public UserDTO userToUserDTO(User user) {
        Address address = user.getAddress();
        return new UserDTO(user.getUsername(), user.getEmail(),
                address.getPhoneNumber(), address.getCountry(), address.getFirstName(), address.getLastName(), address.getCity(), address.getPostalCode());
    }

    @Override
    public UserDTO registerUser(RegistrationDTO registrationDTO) {
        User user = new User(registrationDTO.username(), passwordEncoder.encode(registrationDTO.password()), registrationDTO.email());

        Address address = new Address();
        address.setFirstName(registrationDTO.firstName());
        address.setLastName(registrationDTO.lastName());
        address.setPhoneNumber(registrationDTO.phoneNumber());
        address.setCountry(registrationDTO.country());
        address.setCity(registrationDTO.city());
        address.setPostalCode(registrationDTO.postalCode());

        user.setAddress(address);
        return userToUserDTO(userRepo.save(user));
    }

    @Override
    public UserDTO loginUser(LoginDTO user) {
        return null;
    }
}
