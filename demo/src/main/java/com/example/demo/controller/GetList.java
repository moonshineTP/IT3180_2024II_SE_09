package com.example.demo.controller;

import com.example.demo.model.Account;
import com.example.demo.repository.AccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.model.DTO.AccountDTO;
import com.example.demo.model.DTO.ResidentDTO;
import com.example.demo.model.DTO.VehicleDTO;
import com.example.demo.model.Resident;
import com.example.demo.model.Vehicle;
import com.example.demo.repository.ResidentRepository;
import com.example.demo.repository.VehicleRepository;
import com.example.demo.service.MapService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/GetList")
public class GetList {

    private AccountRepository accountRepository;
    private ResidentRepository residentRepository;
    private VehicleRepository vehicleRepository;
    private MapService mapService;
    // Constructor injection for AccountRepository
    public GetList(AccountRepository accountRepository, ResidentRepository residentRepository, VehicleRepository vehicleRepository, MapService mapService) {
        this.vehicleRepository = vehicleRepository;
        this.residentRepository = residentRepository;
        this.accountRepository = accountRepository;
        this.mapService = mapService;
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<AccountDTO>> getAllAccounts(Authentication authentication) {
        // Get the currently authenticated user's role and email
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");
        String currentEmail = authentication.getName();
        // Fetch all accounts
        List<Account> accounts = accountRepository.findAll();

        // Filter and map accounts based on the user's role
        List<AccountDTO> accountDTOs = accounts.stream()
                .map(account -> {
                    boolean includeEmail = "admin".equals(currentUserRole) || account.getEmail().equals(currentEmail);
                    return mapService.mapToAccountDTO(account, includeEmail);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(accountDTOs);
    }
    @GetMapping("/residents")
    public ResponseEntity<List<ResidentDTO>> getAllResidents(Authentication authentication) {
        // Get the currently authenticated user's role and username
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        String currentEmail = authentication.getName();

        // Fetch all residents
        List<Resident> residents = residentRepository.findAll();

        // Map residents to DTOs based on the user's role
        List<ResidentDTO> residentDTOs = residents.stream()
                .map(resident -> {
                    boolean full = "admin".equals(currentUserRole) || resident.getAccount().getEmail().equals(currentEmail);
                    return mapService.mapToResidentDTO(resident, full);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(residentDTOs);
    }
    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        // Fetch all vehicles
        List<Vehicle> vehicles = vehicleRepository.findAll();

        // Map vehicles to DTOs
        List<VehicleDTO> vehicleDTOs = vehicles.stream()
                .map(vehicle->mapService.mapToVehicleDTO(vehicle))
                .collect(Collectors.toList());

        return ResponseEntity.ok(vehicleDTOs);
    }
}