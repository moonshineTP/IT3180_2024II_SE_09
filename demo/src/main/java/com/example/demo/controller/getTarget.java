package com.example.demo.controller;

import com.example.demo.model.DTO.AccountDTO;
import com.example.demo.model.DTO.ComplaintsDTO;
import com.example.demo.model.DTO.DonationDTO;
import com.example.demo.model.DTO.FeeDTO;
import com.example.demo.model.DTO.NotificationDTO;
import com.example.demo.model.DTO.VehicleDTO;
import com.example.demo.model.Account;
import com.example.demo.model.Complaints;
import com.example.demo.model.Donation;
import com.example.demo.model.Fee;
import com.example.demo.model.Vehicle;
import com.example.demo.model.Notification;
import com.example.demo.model.Resident;
import com.example.demo.repository.AccountRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.demo.repository.VehicleRepository;
import com.example.demo.service.MapService;

import com.example.demo.model.DTO.ResidentDTO;
import com.example.demo.repository.ResidentRepository;
import com.example.demo.repository.FeeRepository;
import com.example.demo.repository.DonationRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.ComplaintRepository;



@RestController
@RequestMapping("/api/gettarget")
public class getTarget {

    @Autowired
    private FeeRepository feeRepository;
    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private MapService mapService;
    @Autowired
    private ResidentRepository residentRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private ComplaintRepository complaintsRepository;

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
    @PostMapping("/getResidentsByApartment")
    public ResponseEntity<?> getResidentsByApartment(@RequestBody ResidentDTO residentDTO) {
        // Validate the apartmentNumber in the DTO
        if (residentDTO.getApartmentNumber() == null || residentDTO.getApartmentNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Apartment number is required");
        }

        // Find residents by apartmentNumber
        List<Resident> residents = residentRepository.findByApartmentNumber(residentDTO.getApartmentNumber());
        if (residents.isEmpty()) {
            return ResponseEntity.ok("No residents found for the given apartment number");
        }

        // Map residents to ResidentDTO
        List<ResidentDTO> residentDTOs = residents.stream()
                .map(resident -> {
                    ResidentDTO dto = new ResidentDTO();
                    dto.setResident_id(resident.getResident_id());
                    dto.setFullName(resident.getFullName());
                    dto.setAvatar(resident.getAvatar());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(residentDTOs);
    }
    @PostMapping("/getFee")
    public ResponseEntity<?> getFee(@RequestBody FeeDTO feeDTO) {
        // Validate the feeId in the DTO
        if (feeDTO.getFeeId() == null || feeDTO.getFeeId().isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }

        // Find the fee by feeId
        Fee fee = feeRepository.findByFeeId(feeDTO.getFeeId());
        if (fee == null) {
            return ResponseEntity.badRequest().body("Fee not found");
        }

        return ResponseEntity.ok(mapService.mapToFeeDTO(fee,true));
    }
    @PostMapping("/getDonation")
    public ResponseEntity<?> getDonation(@RequestBody DonationDTO donationDTO) {
        // Validate the donationId in the DTO
        if (donationDTO.getId() == null || donationDTO.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("Donation ID is required");
        }

        // Find the donation by donationId
        Donation donation = donationRepository.findDonationById(donationDTO.getId());
        if (donation == null) {
            return ResponseEntity.badRequest().body("Donation not found");
        }

        return ResponseEntity.ok(mapService.mapToDonationDTO(donation, true));
    }
    @PostMapping("/getNotification")
    public ResponseEntity<?> getNotification(@RequestBody NotificationDTO notificationDTO) {
        // Validate the notificationId in the DTO
        if (notificationDTO.getAnnouncementId() == null || notificationDTO.getAnnouncementId().isEmpty()) {
            return ResponseEntity.badRequest().body("Notification ID is required");
        }

        // Find the notification by ID
        Notification notification = notificationRepository.findById(notificationDTO.getAnnouncementId()).orElse(null);
        if (notification == null) {
            return ResponseEntity.badRequest().body("Notification not found");
        }

        return ResponseEntity.ok(mapService.mapToNotificationDTO(notification, true));
    }
    
    @PostMapping("/getComplaint")
    public ResponseEntity<?> getComplaint(@RequestBody ComplaintsDTO complaintsDTO) {
        // Validate the complaintId in the DTO
        if (complaintsDTO.getComplaintId() == null || complaintsDTO.getComplaintId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }

        // Find the complaint by ID
        Complaints complaint = complaintsRepository.findById(complaintsDTO.getComplaintId()).orElse(null);
        if (complaint == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }
        return ResponseEntity.ok(mapService.mapToComplaintsDTO(complaint, true));
    }
    
}