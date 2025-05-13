package com.example.demo.controller;

import com.example.demo.model.DTO.AccountDTO;
import com.example.demo.model.DTO.ResidentDTO;
import com.example.demo.model.DTO.VehicleDTO;
import com.example.demo.model.Account;
import com.example.demo.model.Resident;
import com.example.demo.model.Vehicle;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.ResidentRepository;
import com.example.demo.repository.VehicleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/update")
public class updateTarget {


    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @PutMapping("/changeaccount")
    public ResponseEntity<?> updateAccount(
            @RequestBody AccountDTO accountDTO,
            Authentication authentication) {

        // Get the currently authenticated user's role and username
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        String currentEmail = authentication.getName();

        // Find the account to update
        Account account = accountRepository.findByEmail(accountDTO.getEmail());
        if (account==null) {
            return ResponseEntity.badRequest().body("Account not found");
        }

        // Check if the user has permission to update the account
        if (!"admin".equals(currentUserRole) && !account.getEmail().equals(currentEmail)) {
            return ResponseEntity.status(403).body("You do not have permission to update this account");
        }

        // Admin can update all fields
        if ("admin".equals(currentUserRole)) {
            if (accountDTO.getUsername() != null) {
                if(accountRepository.findByUsername(accountDTO.getUsername()) != null) {
                    return ResponseEntity.badRequest().body("Username already exists");
                }
                account.setUsername(accountDTO.getUsername());
            }
            if (accountDTO.getRole() != null) {
                account.setRole(accountDTO.getRole());
            }
            if (accountDTO.getResident_id() != null) {
                Resident resident = residentRepository.findByResident_id(accountDTO.getResident_id());
                if (resident!=null) {
                    // Check if the resident is already linked to another account
                    if (resident.getAccount() != null) {
                        return ResponseEntity.badRequest().body("Resident is already linked to another account");
                    }
                    account.getResident().setAccount(null); // Unlink the current account from the resident
                    account.setResident(resident);
                    resident.setAccount(account); // Set the linking email for the resident
                } else {
                    return ResponseEntity.badRequest().body("Invalid resident_id");
                }
            }
        } else {
            // Resident or guest can only update their own account
            if (accountDTO.getUsername() != null) {
                if(accountRepository.findByUsername(accountDTO.getUsername()) != null) {
                    return ResponseEntity.badRequest().body("Username already exists");
                }
                account.setUsername(accountDTO.getUsername());
            }
        }

        // Save the updated account
        accountRepository.save(account);

        return ResponseEntity.ok("Account updated successfully");
    }
    @DeleteMapping("/deleteaccount")
    public ResponseEntity<?> deleteAccountByEmail(@RequestBody AccountDTO accountDTO, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to delete accounts by email
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to delete accounts");
        }

        // Validate the email in the DTO
        if (accountDTO.getEmail() == null || accountDTO.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required to delete an account");
        }

        // Find the account by email
        Account account = accountRepository.findByEmail(accountDTO.getEmail());
        if (account==null) {
            return ResponseEntity.badRequest().body("Account not found");
        }
        // Delete the account
        accountRepository.delete(account);

        return ResponseEntity.ok("Account deleted successfully");
    }
    @PutMapping("/changeresident")
    public ResponseEntity<?> changeResident(@RequestBody ResidentDTO residentDTO, Authentication authentication) {

        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to update residents
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to update residents");
        }

        // Validate the resident_id in the DTO
        if (residentDTO.getResident_id() == null || residentDTO.getResident_id().isEmpty()) {
            return ResponseEntity.badRequest().body("Resident ID is required");
        }

        // Find the resident by resident_id
        Resident resident = residentRepository.findByResident_id(residentDTO.getResident_id());
        if (resident == null) {
            return ResponseEntity.badRequest().body("Resident not found");
        }
        // Update fields if they are not null in the DTO
        if (residentDTO.getFullName() != null) {
            resident.setFullName(residentDTO.getFullName());
        }
        if (residentDTO.getGender() != null) {
            resident.setGender(residentDTO.getGender());
        }
        if (residentDTO.getDateOfBirth() != null) {
            resident.setDateOfBirth(residentDTO.getDateOfBirth());
        }
        if (residentDTO.getPlaceOfBirth() != null) {
            resident.setPlaceOfBirth(residentDTO.getPlaceOfBirth());
        }
        if (residentDTO.getIdentityNumber() != null) {
            // Ensure identityNumber is unique
            if (residentRepository.existsByIdentityNumberAndResident_idNot(residentDTO.getIdentityNumber(), resident.getResident_id())) {
                return ResponseEntity.badRequest().body("Identity number must be unique");
            }
            resident.setIdentityNumber(residentDTO.getIdentityNumber());
        }
        if (residentDTO.getCccdIssueDate() != null) {
            resident.setCccdIssueDate(residentDTO.getCccdIssueDate());
        }
        if (residentDTO.getCccdExpiryDate() != null) {
            resident.setCccdExpiryDate(residentDTO.getCccdExpiryDate());
        }
        if (residentDTO.getPhoneNumber() != null) {
            // Ensure phoneNumber is unique
            if (residentRepository.existsByPhoneNumberAndResident_idNot(residentDTO.getPhoneNumber(), resident.getResident_id())) {
                return ResponseEntity.badRequest().body("Phone number must be unique");
            }
            resident.setPhoneNumber(residentDTO.getPhoneNumber());
        }
        if (residentDTO.getEmail() != null) {
            // Ensure email is unique
            if (residentRepository.existsByEmailAndResident_idNot(residentDTO.getEmail(), resident.getResident_id())) {
                return ResponseEntity.badRequest().body("Email must be unique");
            }
            resident.setEmail(residentDTO.getEmail());
        }
        if (residentDTO.getOccupation() != null) {
            resident.setOccupation(residentDTO.getOccupation());
        }
        if (residentDTO.getApartmentNumber() != null) {
            resident.setApartmentNumber(residentDTO.getApartmentNumber());
        }
        if (residentDTO.getIsHouseholdOwner() != null) {
            // Ensure there is only one household owner in the apartment
            if (residentDTO.getIsHouseholdOwner() && residentRepository.existsByApartmentNumberAndIsHouseholdOwnerTrueAndResident_idNot(resident.getApartmentNumber(), resident.getResident_id())) {
                return ResponseEntity.badRequest().body("There can only be one household owner in an apartment");
            }
            resident.setIsHouseholdOwner(residentDTO.getIsHouseholdOwner());
        }
        if (residentDTO.getRelationshipWithOwner() != null) {
            resident.setRelationshipWithOwner(residentDTO.getRelationshipWithOwner());
        }
        if (residentDTO.getMoveInDate() != null) {
            resident.setMoveInDate(residentDTO.getMoveInDate());
        }
        if (residentDTO.getMoveOutDate() != null) {
            resident.setMoveOutDate(residentDTO.getMoveOutDate());
        }
        // Save the updated resident
        residentRepository.save(resident);

        return ResponseEntity.ok("Resident updated successfully");
    }
    @DeleteMapping("/deleteresident")
    public ResponseEntity<?> deleteResidentById(@RequestParam String residentId, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to delete residents
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to delete residents");
        }

        // Validate the resident_id
        if (residentId == null || residentId.isEmpty()) {
            return ResponseEntity.badRequest().body("Resident ID is required");
        }

        // Find the resident by resident_id
        Resident resident = residentRepository.findByResident_id(residentId);
        if (resident == null) {
            return ResponseEntity.badRequest().body("Resident not found");
        }

        // Find and delete all vehicles associated with the resident
        List<Vehicle> vehicles = vehicleRepository.findAllByResident(resident);
        if (!vehicles.isEmpty()) {
            vehicleRepository.deleteAll(vehicles);
        }

        // Delete the resident
        residentRepository.delete(resident);

        return ResponseEntity.ok("Resident and associated vehicles deleted successfully");
    }
    @PutMapping("/changevehicle")
    public ResponseEntity<?> updateVehicle(@RequestBody VehicleDTO vehicleDTO, Authentication authentication) {
        // Check if the user is authenticated
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to update vehicles
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to update vehicles");
        }

        // Validate the licensePlate in the DTO
        if (vehicleDTO.getLicensePlate() == null || vehicleDTO.getLicensePlate().isEmpty()) {
            return ResponseEntity.badRequest().body("License plate is required");
        }

        // Find the vehicle by licensePlate
        Vehicle vehicle = vehicleRepository.findByLicensePlate(vehicleDTO.getLicensePlate());
        if (vehicle == null) {
            return ResponseEntity.badRequest().body("Vehicle not found");
        }

        // Update fields if they are not null in the DTO
        if (vehicleDTO.getVehicleType() != null) {
            vehicle.setVehicleType(vehicleDTO.getVehicleType());
        }
        if (vehicleDTO.getBrand() != null) {
            vehicle.setBrand(vehicleDTO.getBrand());
        }
        if (vehicleDTO.getModel() != null) {
            vehicle.setModel(vehicleDTO.getModel());
        }
        if (vehicleDTO.getColor() != null) {
            vehicle.setColor(vehicleDTO.getColor());
        }
        if (vehicleDTO.getRegistrationDate() != null) {
            vehicle.setRegistrationDate(vehicleDTO.getRegistrationDate());
        }
        if (vehicleDTO.getParkingSlot() != null) {
            // Ensure parkingSlot is unique
            if (vehicleRepository.existsByParkingSlotAndLicensePlateNot(vehicleDTO.getParkingSlot(), vehicle.getLicensePlate())) {
                return ResponseEntity.badRequest().body("Parking slot must be unique");
            }
            vehicle.setParkingSlot(vehicleDTO.getParkingSlot());
        }
        if (vehicleDTO.getNote() != null) {
            vehicle.setNote(vehicleDTO.getNote());
        }

        if (vehicleDTO.getImage() != null) {
            vehicle.setImage(vehicleDTO.getImage());
        }
        // Check if the resident_id is provided and find the resident
        if (vehicleDTO.getResidentId() != null) {
            Resident resident = residentRepository.findByResident_id(vehicleDTO.getResidentId());
            if (resident == null) {
                return ResponseEntity.badRequest().body("Resident not found");
            }
            vehicle.setResident(resident);
        }
        // Save the updated vehicle
        vehicleRepository.save(vehicle);

        return ResponseEntity.ok("Vehicle updated successfully");
    }
    @DeleteMapping("/deletevehicle")
    public ResponseEntity<?> deleteVehicleByLicensePlate(@RequestBody VehicleDTO vehicleDTO, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");
        // Only admins are allowed to delete vehicles
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to delete vehicles");
        }
        // Validate the license plate in the DTO
        if (vehicleDTO.getLicensePlate() == null || vehicleDTO.getLicensePlate().isEmpty()) {
            return ResponseEntity.badRequest().body("License plate is required");
        }
        // Find the vehicle by license plate
        Vehicle vehicle = vehicleRepository.findByLicensePlate(vehicleDTO.getLicensePlate());
        if (vehicle == null) {
            return ResponseEntity.badRequest().body("Vehicle not found");
        }
        // Delete the vehicle
        vehicleRepository.delete(vehicle);

        return ResponseEntity.ok("Vehicle deleted successfully");
    }
    @PostMapping("/createresident")
    public ResponseEntity<?> createResident(@RequestBody ResidentDTO residentDTO, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to create residents
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to create residents");
        }

        // Validate the resident_id in the DTO
        if (residentDTO.getResident_id() == null || residentDTO.getResident_id().isEmpty()) {
            return ResponseEntity.badRequest().body("Resident ID is required");
        }

        // Check if a resident with the same ID already exists
        if (residentRepository.findByResident_id(residentDTO.getResident_id()) != null) {
            return ResponseEntity.badRequest().body("Resident with the given ID already exists");
        }

        // Create a new resident with default values
        Resident resident = new Resident();
        resident.setResident_id(residentDTO.getResident_id());
        resident.setFullName(null);
        resident.setGender(null);
        resident.setDateOfBirth(null);
        resident.setPlaceOfBirth(null);
        resident.setIdentityNumber(null);
        resident.setCccdIssueDate(null);
        resident.setCccdExpiryDate(null);
        resident.setPhoneNumber(null);
        resident.setEmail(null);
        resident.setOccupation(null);
        resident.setApartmentNumber(null);
        resident.setIsHouseholdOwner(false);
        resident.setRelationshipWithOwner(null);
        resident.setMoveInDate(null);
        resident.setMoveOutDate(null);
        resident.setAvatar(null);

        // Save the new resident
        residentRepository.save(resident);

        return ResponseEntity.ok("Resident created successfully");
    }
    @PostMapping("/createvehicle")
    public ResponseEntity<?> createVehicle(@RequestBody VehicleDTO vehicleDTO, Authentication authentication) {

        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to create vehicles
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to create vehicles");
        }

        // Validate the licensePlate and resident_id in the DTO
        if (vehicleDTO.getLicensePlate() == null || vehicleDTO.getLicensePlate().isEmpty()) {
            return ResponseEntity.badRequest().body("License plate is required");
        }
        if (vehicleDTO.getResidentId() == null || vehicleDTO.getResidentId().isEmpty()) {
            return ResponseEntity.badRequest().body("Resident ID is required");
        }

        // Check if a vehicle with the same license plate already exists
        if (vehicleRepository.findByLicensePlate(vehicleDTO.getLicensePlate()) != null) {
            return ResponseEntity.badRequest().body("Vehicle with the given license plate already exists");
        }

        // Create a new vehicle with default values
        Vehicle vehicle = new Vehicle();
        vehicle.setLicensePlate(vehicleDTO.getLicensePlate());
        vehicle.setResident(null);
        vehicle.setVehicleType(null);
        vehicle.setBrand(null);
        vehicle.setModel(null);
        vehicle.setColor(null);
        vehicle.setRegistrationDate(null);
        vehicle.setParkingSlot(null);
        vehicle.setImage(null);
        vehicle.setNote(null);

        // Save the new vehicle
        vehicleRepository.save(vehicle);

        return ResponseEntity.ok("Vehicle created successfully");
    }
}
