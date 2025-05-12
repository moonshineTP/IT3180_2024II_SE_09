package com.example.demo.controller;

import com.example.demo.model.DTO.AccountDTO;
import com.example.demo.model.DTO.VehicleDTO;
import com.example.demo.model.Account;
import com.example.demo.model.Vehicle;
import com.example.demo.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.demo.repository.VehicleRepository;
import com.example.demo.service.MapService;

import com.example.demo.model.DTO.ResidentDTO;
import com.example.demo.model.Resident;
import com.example.demo.repository.ResidentRepository;


@RestController
@RequestMapping("/api/gettarget")
public class getTarget {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private MapService mapService;
    @Autowired
    private ResidentRepository residentRepository;

    @PostMapping("/account")
    public ResponseEntity<?> getAccount(@RequestBody AccountDTO requestDTO, Authentication authentication) {
        // Get the currently authenticated user's role and username
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        String currentEmail = authentication.getName();
        if (requestDTO.getUsername() != null) {
            Account account = accountRepository.findByUsername(requestDTO.getUsername());
            if (account==null) {
                return ResponseEntity.badRequest().body("Account not found");
            }
            // Check if the username belongs to the current user
            boolean includeEmail = account.getEmail().equals(currentEmail)||"admin".equals(currentUserRole);

            return ResponseEntity.ok(mapService.mapToAccountDTO(account, includeEmail));
        }

        return ResponseEntity.badRequest().body("Invalid request");
    }
    @PostMapping("/getResident")
    public ResponseEntity<?> getResident(@RequestBody ResidentDTO requestDTO, Authentication authentication) {
        // Get the currently authenticated user's role and username
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");
        String currentEmail = authentication.getName();
        if(requestDTO.getResident_id() != null) {
            Resident resident = residentRepository.findByResident_id(requestDTO.getResident_id());
            if (resident==null) {
                return ResponseEntity.badRequest().body("Resident not found");
            }
            // Check if the resident belongs to the current user
            boolean full = "admin".equals(currentUserRole) || resident.getAccount().getEmail().equals(currentEmail);
            ResidentDTO responseDTO = mapService.mapToResidentDTO(resident, full);
            return ResponseEntity.ok(responseDTO);
        }
        return ResponseEntity.badRequest().body("Invalid request");
    }

    @PostMapping("/getVehicle")
    public ResponseEntity<?> getVehicleByLicensePlate(@RequestBody VehicleDTO vehicleDTO) {
        // Validate the license plate in the DTO
        if (vehicleDTO.getLicensePlate() == null || vehicleDTO.getLicensePlate().isEmpty()) {
            return ResponseEntity.badRequest().body("License plate is required");
        }

        // Find the vehicle by license plate
        Vehicle vehicle = vehicleRepository.findByLicensePlate(vehicleDTO.getLicensePlate());
        if (vehicle==null) {
            return ResponseEntity.badRequest().body("Vehicle with the provided license plate not found");
        }
        // Map the vehicle entity to DTO
        VehicleDTO responseDTO = mapService.mapToVehicleDTO(vehicle);
        return ResponseEntity.ok(responseDTO);
    }

}