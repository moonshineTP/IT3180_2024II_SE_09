package com.example.demo.controller;

import com.example.demo.model.Account;
import com.example.demo.model.Complaints;
import com.example.demo.model.Donation;
import com.example.demo.model.Fee;
import com.example.demo.repository.AccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.model.DTO.AccountDTO;
import com.example.demo.model.DTO.ComplaintsDTO;
import com.example.demo.model.DTO.DonationDTO;
import com.example.demo.model.DTO.FeeDTO;
import com.example.demo.model.DTO.NotificationDTO;
import com.example.demo.model.DTO.ResidentDTO;
import com.example.demo.model.DTO.VehicleDTO;
import com.example.demo.model.Resident;
import com.example.demo.model.Vehicle;
import com.example.demo.repository.ResidentRepository;
import com.example.demo.repository.VehicleRepository;
import com.example.demo.service.MapService;
import com.example.demo.repository.FeeRepository;
import com.example.demo.repository.DonationRepository;
import com.example.demo.model.Notification;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.ComplaintRepository;
import com.example.demo.repository.receiveNotificationRepository;
import com.example.demo.repository.interactNotificationRepository;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/GetList")
public class GetList {

    private AccountRepository accountRepository;
    private ResidentRepository residentRepository;
    private VehicleRepository vehicleRepository;
    private MapService mapService;
    private FeeRepository feeRepository;
    private DonationRepository donationRepository;
    private NotificationRepository notificationRepository;
    private ComplaintRepository complaintsRepository;
    private receiveNotificationRepository receiveNotificationRepository;
    private interactNotificationRepository interactNotificationRepository;
    // Constructor injection for AccountRepository
    public GetList(AccountRepository accountRepository, ResidentRepository residentRepository, VehicleRepository vehicleRepository, 
            MapService mapService, FeeRepository feeRepository, DonationRepository donationRepository, 
            NotificationRepository notificationRepository, ComplaintRepository complaintsRepository, receiveNotificationRepository receiveNotificationRepository, 
            interactNotificationRepository interactNotificationRepository) {
        this.interactNotificationRepository = interactNotificationRepository;
        this.receiveNotificationRepository = receiveNotificationRepository;
        this.notificationRepository = notificationRepository;
        this.vehicleRepository = vehicleRepository;
        this.residentRepository = residentRepository;
        this.accountRepository = accountRepository;
        this.mapService = mapService;
        this.feeRepository = feeRepository;
        this.donationRepository = donationRepository;
        this.complaintsRepository = complaintsRepository;
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
    @GetMapping("/fees")
    public ResponseEntity<List<FeeDTO>> getAllFees() {
        // Fetch all fees
        List<Fee> fees = feeRepository.findAll();

        // Map fees to DTOs (excluding content)
        List<FeeDTO> feeDTOs = fees.stream()
                .map(fee -> mapService.mapToFeeDTO(fee,false))
                .collect(Collectors.toList());

        return ResponseEntity.ok(feeDTOs);
    }
    @GetMapping("/donations")
    public ResponseEntity<List<DonationDTO>> getAllDonations() {
        // Fetch all donations
        List<Donation> donations = donationRepository.findAll();

        // Map donations to DTOs (excluding content)
        List<DonationDTO> donationDTOs = donations.stream()
                .map(donation -> mapService.mapToDonationDTO(donation,false))
                .collect(Collectors.toList());

        return ResponseEntity.ok(donationDTOs);
    }
    @GetMapping("/public-notifications")
    public ResponseEntity<List<NotificationDTO>> getPublicNotifications() {
        // Fetch all notifications where sendto is "public"
        List<Notification> notifications = notificationRepository.findBySendto("public");

        // Map notifications to NotificationDTO (excluding content if needed)
        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(notification -> mapService.mapToNotificationDTO(notification, false))
                .collect(Collectors.toList());

        return ResponseEntity.ok(notificationDTOs);
    }
    @PostMapping("/private-notifications")
    public ResponseEntity<List<NotificationDTO>> getPrivateNotifications(Authentication authentication) {
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");
        if(!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body(List.of());
        }
        // Fetch notifications where sendto is "private" and recipient is the current user
        List<Notification> notifications = notificationRepository.findBySendto("private");

        // Map notifications to NotificationDTO (excluding content if needed)
        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(notification -> mapService.mapToNotificationDTO(notification, false))
                .collect(Collectors.toList());

        return ResponseEntity.ok(notificationDTOs);
    }
    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintsDTO>> getAllComplaints() {
        // Fetch all complaints
        List<Complaints> complaints = complaintsRepository.findAll();

        // Map complaints to ComplaintsDTO (excluding description)
        List<ComplaintsDTO> complaintsDTOs = complaints.stream()
                .map(complaint -> mapService.mapToComplaintsDTO(complaint, false))
                .collect(Collectors.toList());

        return ResponseEntity.ok(complaintsDTOs);
    }
    @PostMapping("/getprivateNotification")
    public ResponseEntity<?> getConcernedNotification(Authentication authentication) {
        // Get the currently authenticated user's email
        String currentEmail = authentication.getName();
        Account currentAccount = accountRepository.findByEmail(currentEmail);
        Resident currentResident = currentAccount.getResident();
        if (currentResident == null) {
            return ResponseEntity.status(403).body("User is not a resident");
        }
        // Fetch concerned notifications for the current user through the interactNotification table
        List<Notification> privateNotifications = receiveNotificationRepository.findNotificationsByResident(currentResident);

        if (privateNotifications.isEmpty()) {
            return ResponseEntity.ok("No private notifications found for the current user");
        }

        // Map notifications to NotificationDTO
        List<NotificationDTO> notificationDTOs = privateNotifications.stream()
                .map(notification -> mapService.mapToNotificationDTO(notification, false))
                .collect(Collectors.toList());

        return ResponseEntity.ok(notificationDTOs);
    }
    @PostMapping("/filterConcernedNotifications")
    public ResponseEntity<?> filterConcernedNotifications(@RequestBody List<NotificationDTO> notificationDTOs, Authentication authentication) {
        // Get the currently authenticated user's email
        String currentEmail = authentication.getName();

        // Extract notification IDs from the input list
        List<String> notificationIds = notificationDTOs.stream()
                .map(NotificationDTO::getAnnouncementId)
                .collect(Collectors.toList());

        // Fetch notifications with interactType="concerned" for the current user
        List<Notification> concernedNotifications = interactNotificationRepository.findConcernedNotificationsByUserEmailAndNotificationIds(currentEmail, notificationIds);

        if (concernedNotifications.isEmpty()) {
            return ResponseEntity.ok("No concerned notifications found for the current user");
        }

        // Map notifications to NotificationDTO
        List<NotificationDTO> filteredNotificationDTOs = concernedNotifications.stream()
                .map(notification -> mapService.mapToNotificationDTO(notification, false))
                .collect(Collectors.toList());

        return ResponseEntity.ok(filteredNotificationDTOs);
    }
}