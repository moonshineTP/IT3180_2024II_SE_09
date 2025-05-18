package com.example.demo.controller;

import com.example.demo.model.DTO.AccountDTO;
import com.example.demo.model.DTO.ResidentDTO;
import com.example.demo.model.DTO.VehicleDTO;
import com.example.demo.model.DTO.FeeDTO;
import com.example.demo.model.DTO.FeeHouseholdDTO;
import com.example.demo.model.DTO.IncludeInComplaintsDTO;
import com.example.demo.model.DTO.DonationDTO;
import com.example.demo.model.DTO.DonationHouseholdDTO;
import com.example.demo.model.DTO.ComplaintsDTO;
import com.example.demo.model.DTO.BillDTO;
import com.example.demo.model.Account;
import com.example.demo.model.Bill;

import com.example.demo.model.Resident;
import com.example.demo.model.Vehicle;
import com.example.demo.model.Fee;
import com.example.demo.model.FeeHousehold;
import com.example.demo.model.IncludeInComplaints;
import com.example.demo.model.Notification;
import com.example.demo.model.Donation;
import com.example.demo.model.DonationHousehold;
import com.example.demo.model.Complaints;
import com.example.demo.model.InteractComplaint;
import com.example.demo.model.DTO.InteractComplaintDTO;
import com.example.demo.model.InteractNotification;
import com.example.demo.model.ReceiveNotification;
import com.example.demo.model.ResponseNotification;
import com.example.demo.model.DTO.ResponseNotificationDTO;
import com.example.demo.model.DTO.InteractNotificationDTO;
import com.example.demo.model.DTO.ReceiveNotificationDTO;
import com.example.demo.model.ResponseComplaints;
import com.example.demo.model.DTO.ResponseComplaintsDTO;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.ResidentRepository;
import com.example.demo.repository.VehicleRepository;
import com.example.demo.repository.FeeRepository;
import com.example.demo.repository.DonationRepository;
import com.example.demo.repository.BillRepository;
import com.example.demo.repository.ComplaintRepository;
import com.example.demo.repository.FeeHouseholdRepository;
import com.example.demo.repository.DonationHouseholdRepository;
import com.example.demo.repository.InteractComplaintRepository;
import com.example.demo.repository.InteractNotificationRepository;
import com.example.demo.repository.ReceiveNotificationRepository;
import com.example.demo.repository.NotificationRepository;
import com.example.demo.repository.ResponseNotificationRepository;
import com.example.demo.repository.ResponseComplaintsRepository;
import com.example.demo.repository.IncludeInComplaintsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.LocalDateTime;



@RestController
@RequestMapping("/api/update")
public class updateTarget {


    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private ResidentRepository residentRepository;

    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private FeeRepository feeRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private ComplaintRepository complaintRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private FeeHouseholdRepository feeHouseholdRepository;
    @Autowired
    private DonationHouseholdRepository donationHouseholdRepository;
    @Autowired
    private InteractComplaintRepository interactComplaintRepository;
    @Autowired
    private InteractNotificationRepository interactNotificationRepository;
    @Autowired
    private ResponseNotificationRepository responseNotificationRepository;
    @Autowired
    private ResponseComplaintsRepository responseComplaintsRepository;
    @Autowired
    private ReceiveNotificationRepository receiveNotificationRepository;
    @Autowired
    private IncludeInComplaintsRepository includeInComplaintsRepository;
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
                Resident resident = residentRepository.findByResidentId(accountDTO.getResident_id());
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
        Resident resident = residentRepository.findByResidentId(residentDTO.getResident_id());
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
            if (residentRepository.existsByIdentityNumberAndResidentIdNot(residentDTO.getIdentityNumber(), resident.getResidentId())) {
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
            if (residentRepository.existsByPhoneNumberAndResidentIdNot(residentDTO.getPhoneNumber(), resident.getResidentId())) {
                return ResponseEntity.badRequest().body("Phone number must be unique");
            }
            resident.setPhoneNumber(residentDTO.getPhoneNumber());
        }
        if (residentDTO.getEmail() != null) {
            // Ensure email is unique
            if (residentRepository.existsByEmailAndResidentIdNot(residentDTO.getEmail(), resident.getResidentId())) {
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
            if (residentDTO.getIsHouseholdOwner() && residentRepository.existsByApartmentNumberAndIsHouseholdOwnerTrueAndResidentIdNot(resident.getApartmentNumber(), resident.getResidentId())) {
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
        Resident resident = residentRepository.findByResidentId(residentId);
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
            Resident resident = residentRepository.findByResidentId(vehicleDTO.getResidentId());
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
    @PostMapping("/changeFee")
    public ResponseEntity<?> updateFee(@RequestBody FeeDTO feeDTO, Authentication authentication) {
        // Check if the user is authenticated
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to update fees
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to update fees");
        }

        // Validate the fee_id in the DTO
        if (feeDTO.getId() == null || feeDTO.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }

        // Find the fee by fee_id
        Fee fee = feeRepository.findFeeById(feeDTO.getId());
        if (fee == null) {
            return ResponseEntity.badRequest().body("Fee not found");
        }

        // Update fields if they are not null in the DTO
        if (feeDTO.getFeeName() != null) {
            fee.setFeeName(feeDTO.getFeeName());
        }
        if (feeDTO.getFeeType() != null) {
            fee.setFeeType(feeDTO.getFeeType());
        }
        if (feeDTO.getNote() != null) {
            fee.setNote(feeDTO.getNote());
        }
        if (feeDTO.getSupervisor() != null) {
            fee.setSupervisor(feeDTO.getSupervisor());
        }
        fee.setUpdatedAt(LocalDateTime.now()); // Update the timestamp
        // Save the updated fee
        feeRepository.save(fee);

        return ResponseEntity.ok("Fee updated successfully");
    }


    @DeleteMapping("/deletefee")
    public ResponseEntity<?> deleteFeeById(@RequestBody FeeDTO feeDTO, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to delete fees
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to delete fees");
        }
        // Validate the feeId in the DTO
        String feeId = feeDTO.getId();
        // Validate the feeId
        if (feeId == null || feeId.isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }

        // Find the fee by feeId
        Fee fee = feeRepository.findFeeById(feeId);
        if (fee == null) {
            return ResponseEntity.badRequest().body("Fee not found");
        }

        // Delete all bills associated with FeeHousehold entries for this Fee
        List<Bill> billsToDelete = billRepository.findByFeeHousehold_Fee(fee);
        billRepository.deleteAll(billsToDelete);

        // Delete the fee
        feeRepository.delete(fee);

        return ResponseEntity.ok("Fee and associated bills deleted successfully");
    }

    @PostMapping("/changedonation")
    public ResponseEntity<?> updateDonation(@RequestBody DonationDTO donationDTO, Authentication authentication) {
        // Check if the user is authenticated
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to update donations
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to update donations");
        }

        // Validate the donationId in the DTO
        if (donationDTO.getId() == null || donationDTO.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("Donation ID is required");
        }

        // Find the donation by donationId
        Donation donation = donationRepository.findDonationById(donationDTO.getId());
        if (donation == null) {
            return ResponseEntity.badRequest().body("Donation not found");
        }

        // Update fields if they are not null in the DTO
        if (donationDTO.getDonationName() != null) {
            donation.setDonationName(donationDTO.getDonationName());
        }
        if (donationDTO.getFounder() != null) {
            donation.setFounder(donationDTO.getFounder());
        }
        if (donationDTO.getContent() != null) {
            donation.setContent(donationDTO.getContent());
        }
        if (donationDTO.getAccumulatedMoney() == 0) {
            donation.setAccumulatedMoney(donationDTO.getAccumulatedMoney());
        }
        if (donationDTO.getStatus() != null) {
            donation.setStatus(donationDTO.getStatus());
        }
        // Save the updated donation
        donationRepository.save(donation);

        return ResponseEntity.ok("Donation updated successfully");
    }

    @DeleteMapping("/deletedonation")
    public ResponseEntity<?> deleteDonationById(@RequestBody DonationDTO donationDTO, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to delete donations
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to delete donations");
        }

        // Validate the donationId in the DTO
        String donationId = donationDTO.getId();
        // Validate the donationId
        if (donationId == null || donationId.isEmpty()) {
            return ResponseEntity.badRequest().body("Donation ID is required");
        }

        // Find the donation by donationId
        Donation donation = donationRepository.findDonationById(donationId);
        if (donation == null) {
            return ResponseEntity.badRequest().body("Donation not found");
        }
        
        // Delete the donation
        donationRepository.delete(donation);

        return ResponseEntity.ok("Donation deleted successfully");
    }
    @PostMapping("/changecomplaints")
    public ResponseEntity<?> updateComplaints(@RequestBody ComplaintsDTO complaintDTO, Authentication authentication) {
        // Check if the user is authenticated
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to update complaints
        if (!"admin".equals(currentUserRole)||"resident".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to update complaints");
        }

        // Validate the complaintId in the DTO
        if (complaintDTO.getComplaintId() == null || complaintDTO.getComplaintId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }

        // Find the complaint by complaintId
        Complaints complaint = complaintRepository.findByComplaintId(complaintDTO.getComplaintId());
        if (complaint == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }

        // Update fields if they are not null in the DTO
        if (complaintDTO.getTitle() != null) {
            complaint.setTitle(complaintDTO.getTitle());
        }
        if (complaintDTO.getDescription() != null) {
            complaint.setDescription(complaintDTO.getDescription());
        }
        if("admin".equals(currentUserRole)){
            if (complaintDTO.getStatus() != null) {
                complaint.setStatus(complaintDTO.getStatus());
            }
            if (complaintDTO.getProcessedAt() != null) {
                complaint.setProcessedAt(complaintDTO.getProcessedAt());
            }
            if (complaintDTO.getStaffId() != null) {
                complaint.setStaffId(complaintDTO.getStaffId());
            }
            if(complaintDTO.getPriority() != null) {
                complaint.setPriority(complaintDTO.getPriority());
            }
        } else return ResponseEntity.status(403).body("You do not have permission to update the status of this complaint");
        // Save the updated complaint
        complaintRepository.save(complaint);

        return ResponseEntity.ok("Complaint updated successfully");
    }
    @DeleteMapping("/deletecomplaints")
    public ResponseEntity<?> deleteComplaintById(@RequestBody ComplaintsDTO complaintDTO, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");
        String currentEmail = authentication.getName();

        // Validate the complaintId in the DTO
        String complaintId = complaintDTO.getComplaintId();
        // Validate the complaintId
        if (complaintId == null || complaintId.isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }

        // Find the complaint by complaintId
        Complaints complaint = complaintRepository.findByComplaintId(complaintId);
        if (complaint == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }

        // Only admins are allowed to delete complaints
        if ("guest".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to delete complaints");
        }
        if("resident".equals(currentUserRole)) {
            if (!complaint.getResident().getAccount().getEmail().equals(currentEmail)) {
                return ResponseEntity.status(403).body("You do not have permission to delete this complaint");
            }
        }
        // Delete the complaint
        complaintRepository.delete(complaint);

        return ResponseEntity.ok("Complaint deleted successfully");
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
        if (residentRepository.findByResidentId(residentDTO.getResident_id()) != null) {
            return ResponseEntity.badRequest().body("Resident with the given ID already exists");
        }

        // Create a new resident with default values
        Resident resident = new Resident();
        resident.setResidentId(residentDTO.getResident_id());
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
        // Save the new vehicle
        vehicleRepository.save(vehicle);

        return ResponseEntity.ok("Vehicle created successfully");
    }
    @PostMapping("/createfee")
    public ResponseEntity<?> createFee(@RequestBody FeeDTO feeDTO, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to create fees
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to create fees");
        }

        // Validate the feeId in the DTO
        if (feeDTO.getId() == null || feeDTO.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }

        // Check if a fee with the same ID already exists
        if (feeRepository.findById(feeDTO.getId()) != null) {
            return ResponseEntity.badRequest().body("Fee with the given ID already exists");
        }

        // Create a new fee with default values
        Fee fee = new Fee();
        fee.setId(feeDTO.getId());
        fee.setCreatedAt(LocalDateTime.now());
        // Save the new fee
        feeRepository.save(fee);

        return ResponseEntity.ok("Fee created successfully");
    }
    @PostMapping("/createdonation")
    public ResponseEntity<?> createDonation(@RequestBody DonationDTO donationDTO, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        // Only admins are allowed to create donations
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to create donations");
        }

        // Validate the donationId in the DTO
        if (donationDTO.getId() == null || donationDTO.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("Donation ID is required");
        }

        // Check if a donation with the same ID already exists
        if (donationRepository.findDonationById(donationDTO.getId()) != null) {
            return ResponseEntity.badRequest().body("Donation with the given ID already exists");
        }

        // Create a new donation with default values
        Donation donation = new Donation();
        donation.setId(donationDTO.getId());
        // Save the new donation
        donationRepository.save(donation);

        return ResponseEntity.ok("Donation created successfully");
    }
    @PostMapping("/createcomplaints")
    public ResponseEntity<?> createComplaints(@RequestBody ComplaintsDTO complaintDTO, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");

        String currentEmail = authentication.getName();

        // Only admins are allowed to create complaints
        if (!"resident".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to create complaints");
        }

        Account account = accountRepository.findByEmail(currentEmail);

        Resident resident = account.getResident();

        // Validate the complaintId in the DTO
        if (complaintDTO.getComplaintId() == null || complaintDTO.getComplaintId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }

        // Check if a complaint with the same ID already exists
        if (complaintRepository.findByComplaintId(complaintDTO.getComplaintId()) != null) {
            return ResponseEntity.badRequest().body("Complaint with the given ID already exists");
        }

        // Create a new complaint with default values
        Complaints complaint = new Complaints();
        complaint.setComplaintId(complaintDTO.getComplaintId());
        complaint.setResident(resident);
        // Save the new complaint
        complaintRepository.save(complaint);

        return ResponseEntity.ok("Complaint created successfully");
    }
    @PreAuthorize("hasRole('admin')")
    @PostMapping("/createFeeHousehold")
    public ResponseEntity<?> createFeeHousehold(@RequestBody FeeHouseholdDTO feeHouseholdDTO, Authentication authentication) {
        // Validate the feeId and apartmentNumber in the DTO
        if (feeHouseholdDTO.getFeeID() == null || feeHouseholdDTO.getFeeID().isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }
        if (feeHouseholdDTO.getApartmentNumber() == null || feeHouseholdDTO.getApartmentNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Apartment number is required");
        }

        // Find the Fee by feeId
        Fee fee = feeRepository.findFeeById(feeHouseholdDTO.getFeeID());
        if (fee == null) {
            return ResponseEntity.badRequest().body("Fee not found");
        }

        // Check if a FeeHousehold with the same apartmentNumber and fee already exists
        if (feeHouseholdRepository.findByApartmentNumberAndFeeId(feeHouseholdDTO.getApartmentNumber(), feeHouseholdDTO.getFeeID()) != null) {
            return ResponseEntity.badRequest().body("FeeHousehold with the given apartment number and fee already exists");
        }

        // Create a new FeeHousehold
        FeeHousehold feeHousehold = new FeeHousehold();
        feeHousehold.setApartmentNumber(feeHouseholdDTO.getApartmentNumber());
        feeHousehold.setFee(fee);
        feeHousehold.setStartingDay(feeHouseholdDTO.getStartingDay());

        // Save the new FeeHousehold
        feeHouseholdRepository.save(feeHousehold);

        return ResponseEntity.ok("FeeHousehold created successfully");
    }
    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/deleteFeeHousehold")
    public ResponseEntity<?> deleteFeeHousehold(@RequestBody FeeHouseholdDTO feeHouseholdDTO, Authentication authentication) {
        // Validate the feeId and apartmentNumber in the DTO
        if (feeHouseholdDTO.getFeeID() == null || feeHouseholdDTO.getFeeID().isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }
        if (feeHouseholdDTO.getApartmentNumber() == null || feeHouseholdDTO.getApartmentNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Apartment number is required");
        }
        // Find the Fee by feeId
        Fee fee = feeRepository.findFeeById(feeHouseholdDTO.getFeeID());
        if (fee == null) {
            return ResponseEntity.badRequest().body("Fee not found");
        }
        FeeHousehold feeHousehold = feeHouseholdRepository.findByApartmentNumberAndFeeId(feeHouseholdDTO.getApartmentNumber(), feeHouseholdDTO.getFeeID());
        // Check if a FeeHousehold with the same apartmentNumber and fee already exists
        if (feeHousehold == null) {
            return ResponseEntity.badRequest().body("FeeHousehold with the given apartment number and fee no exists");
        }
        // Save the new FeeHousehold
        feeHouseholdRepository.delete(feeHousehold);

        return ResponseEntity.ok("FeeHousehold created successfully");
    }
    @PreAuthorize("hasRole('admin')")
    @PostMapping("/createDonationHousehold")
    public ResponseEntity<?> createDonationHousehold(@RequestBody DonationHouseholdDTO donationHouseholdDTO, Authentication authentication) {
        // Validate the donationId and apartmentNumber in the DTO
        if (donationHouseholdDTO.getDonation_id() == null || donationHouseholdDTO.getDonation_id().isEmpty()) {
            return ResponseEntity.badRequest().body("Donation ID is required");
        }
        if (donationHouseholdDTO.getApartmentNumber() == null || donationHouseholdDTO.getApartmentNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Apartment number is required");
        }
        // Find the Donation by donationId
        Donation donation = donationRepository.findDonationById(donationHouseholdDTO.getDonation_id());
        if (donation == null) {
            return ResponseEntity.badRequest().body("Donation not found");
        }
        // Check if a DonationHousehold with the same apartmentNumber and donation already exists
        if (donationHouseholdRepository.findByApartmentNumberAndDonation(donationHouseholdDTO.getApartmentNumber(), donation) != null) {
            return ResponseEntity.badRequest().body("DonationHousehold with the given apartment number and donation already exists");
        }
        // Create a new DonationHousehold
        DonationHousehold donationHousehold = new DonationHousehold();
        donationHousehold.setApartmentNumber(donationHouseholdDTO.getApartmentNumber());
        donationHousehold.setDonation(donation);
        donationHousehold.setDonatedMoney(donationHouseholdDTO.getDonatedMoney());
        // Update the accumulated money of the donation
        donation.setAccumulatedMoney(donation.getAccumulatedMoney() + donationHouseholdDTO.getDonatedMoney());
        // Save the new DonationHousehold
        donationHouseholdRepository.save(donationHousehold);
        // Save the updated donation
        donationRepository.save(donation);
        return ResponseEntity.ok("DonationHousehold created successfully");
    }
    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/deleteDonationHousehold")
    public ResponseEntity<?> deleteDonationHousehold(@RequestBody DonationHouseholdDTO donationHouseholdDTO, Authentication authentication) {
        // Validate the donationId and apartmentNumber in the DTO
        if (donationHouseholdDTO.getDonation_id() == null || donationHouseholdDTO.getDonation_id().isEmpty()) {
            return ResponseEntity.badRequest().body("Donation ID is required");
        }
        if (donationHouseholdDTO.getApartmentNumber() == null || donationHouseholdDTO.getApartmentNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Apartment number is required");
        }
        // Find the Donation by donationId
        Donation donation = donationRepository.findDonationById(donationHouseholdDTO.getDonation_id());
        if (donation == null) {
            return ResponseEntity.badRequest().body("Donation not found");
        }
        DonationHousehold donationHousehold = donationHouseholdRepository.findByApartmentNumberAndDonation(donationHouseholdDTO.getApartmentNumber(), donation);
        // Check if a DonationHousehold with the same apartmentNumber and donation already exists
        if (donationHousehold == null) {
            return ResponseEntity.badRequest().body("DonationHousehold with the given apartment number and donation already exists");
        }
        // Update the accumulated money of the donation
        donation.setAccumulatedMoney(donation.getAccumulatedMoney() - donationHouseholdDTO.getDonatedMoney());
        // Save the new DonationHousehold
        donationHouseholdRepository.delete(donationHousehold);
        // Save the updated donation
        donationRepository.save(donation);
        return ResponseEntity.ok("DonationHousehold created successfully");
    }
    @PostMapping("/createInteractComplaints")
    public ResponseEntity<?> createInteractComplaint(@RequestBody InteractComplaintDTO interactComplaintsDTO, Authentication authentication) {
        String currentEmail = authentication.getName();
        Account account = accountRepository.findByEmail(currentEmail);
        // Validate the complaintId and residentId in the DTO
        if (interactComplaintsDTO.getComplaintId() == null || interactComplaintsDTO.getComplaintId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }
        // Find the complaint by complaintId
        Complaints complaint = complaintRepository.findByComplaintId(interactComplaintsDTO.getComplaintId());
        if (complaint == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }
        // Check if an InteractComplaints with the same complaintId and account already exists
        if (interactComplaintRepository.findByComplaintAndStarNumberRatingAndAccount(complaint,interactComplaintsDTO.getStarNumberRating(), account) != null) {
            return ResponseEntity.badRequest().body("InteractComplaints with the given complaint ID and account already exists");
        }
        // Create a new InteractComplaints
        InteractComplaint interactComplaints = new InteractComplaint();
        interactComplaints.setComplaint(complaint);
        interactComplaints.setStarNumberRating(interactComplaintsDTO.getStarNumberRating());
        interactComplaints.setResponseTime(LocalDateTime.now());
        interactComplaints.setAccount(account);

        // Save the new InteractComplaints
        interactComplaintRepository.save(interactComplaints);
        return ResponseEntity.ok("InteractComplaints created successfully");
    }
    @DeleteMapping("/deleteInteractComplaints")
    public ResponseEntity<?> deleteInteractComplaint(@RequestBody InteractComplaintDTO interactComplaintsDTO, Authentication authentication) {
        String currentEmail = authentication.getName();
        Account account = accountRepository.findByEmail(currentEmail);
        // Validate the complaintId and residentId in the DTO
        if (interactComplaintsDTO.getComplaintId() == null || interactComplaintsDTO.getComplaintId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }
        // Find the complaint by complaintId
        Complaints complaint = complaintRepository.findByComplaintId(interactComplaintsDTO.getComplaintId());
        if (complaint == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }
        InteractComplaint interactComplaints = interactComplaintRepository.findByComplaintAndStarNumberRatingAndAccount(complaint,interactComplaintsDTO.getStarNumberRating(), account);
        // Check if an InteractComplaints with the same complaintId and account already exists
        if (interactComplaints == null) {
            return ResponseEntity.badRequest().body("InteractComplaints with the given complaint ID and account no exists");
        }
        // Save the new InteractComplaints
        interactComplaintRepository.delete(interactComplaints);
        return ResponseEntity.ok("InteractComplaints created successfully");
    }
    @PostMapping("/createInteractNotification")
    public ResponseEntity<?> createInteractNotification(@RequestBody InteractNotificationDTO interactNotificationDTO, Authentication authentication) {
        String currentEmail = authentication.getName();
        Account account = accountRepository.findByEmail(currentEmail);
        // Validate the complaintId and residentId in the DTO
        if (interactNotificationDTO.getNotificationId() == null || interactNotificationDTO.getNotificationId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }
        // Find the complaint by complaintId
        Notification noti = notificationRepository.findByAnnouncementId(interactNotificationDTO.getNotificationId());
        if (noti == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }
        // Check if an InteractComplaints with the same complaintId and account already exists
        if (interactNotificationRepository.findByNotificationAndTypeInteractAndAccount(noti,interactNotificationDTO.getTypeInteract(), account) != null) {
            return ResponseEntity.badRequest().body("InteractComplaints with the given complaint ID and account already exists");
        }
        // Create a new InteractComplaints
        InteractNotification interact = new InteractNotification();
        interact.setNotification(noti);
        interact.setTypeInteract(interactNotificationDTO.getTypeInteract());
        interact.setResponseTime(LocalDateTime.now());
        interact.setAccount(account);

        // Save the new InteractComplaints
        interactNotificationRepository.save(interact);
        return ResponseEntity.ok("InteractComplaints created successfully");
    }
    @DeleteMapping("/deleteInteractNotification")
    public ResponseEntity<?> deleteInteractNotification(@RequestBody InteractNotificationDTO interactNotificationDTO, Authentication authentication) {
        String currentEmail = authentication.getName();
        Account account = accountRepository.findByEmail(currentEmail);
        // Validate the complaintId and residentId in the DTO
        if (interactNotificationDTO.getNotificationId() == null || interactNotificationDTO.getNotificationId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }
        // Find the complaint by complaintId
        Notification noti = notificationRepository.findByAnnouncementId(interactNotificationDTO.getNotificationId());
        if (noti == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }
        InteractNotification interact = interactNotificationRepository.findByNotificationAndTypeInteractAndAccount(noti,interactNotificationDTO.getTypeInteract(), account);
        // Check if an InteractComplaints with the same complaintId and account already exists
        if (interact == null) {
            return ResponseEntity.badRequest().body("InteractComplaints with the given complaint ID and account already exists");
        }
        // Save the new InteractComplaints
        interactNotificationRepository.delete(interact);
        return ResponseEntity.ok("InteractComplaints created successfully");
    }
    @PostMapping("/createresponseNotification")
    public ResponseEntity<?> createResponseNotification(@RequestBody ResponseNotificationDTO responseNotificationDTO, Authentication authentication) {
        String currentEmail = authentication.getName();
        Account account = accountRepository.findByEmail(currentEmail);
        // Validate the notificationId in the DTO
        if (responseNotificationDTO.getNotificationId() == null || responseNotificationDTO.getNotificationId().isEmpty()) {
            return ResponseEntity.badRequest().body("Notification ID is required");
        }
        // Find the notification by notificationId
        Notification notification = notificationRepository.findByAnnouncementId(responseNotificationDTO.getNotificationId());
        if (notification == null) {
            return ResponseEntity.badRequest().body("Notification not found");
        }
        // Create a new response notification with default values
        ResponseNotification response = new ResponseNotification();
        response.setResponseContent(responseNotificationDTO.getResponseContent());
        response.setResponseTime(LocalDateTime.now());
        response.setAccount(account);
        response.setNotification(notification);

        // Save the new response notification
        responseNotificationRepository.save(response);

        return ResponseEntity.ok("Response notification created successfully");
    }
    @PostMapping("/deleteresponseNotification")
    public ResponseEntity<?> deleteResponseNotification(@RequestBody ResponseNotificationDTO responseNotificationDTO, Authentication authentication) {
        String currentEmail = authentication.getName();
        Account account = accountRepository.findByEmail(currentEmail);
        if(responseNotificationDTO.getUserName() != account.getUsername()){
            return ResponseEntity.status(403).body("You do not have permission to delete this response notification");
        }
        ResponseNotification response = responseNotificationRepository.findById(responseNotificationDTO.getId()).orElse(null);
        if(response == null) {
            return ResponseEntity.badRequest().body("Response notification not found");
        }
        responseNotificationRepository.delete(response);

        return ResponseEntity.ok("Response notification created successfully");
    }
    @PostMapping("/createresponseComplaint")
    public ResponseEntity<?> createResponseComplaint(@RequestBody ResponseComplaintsDTO responseComplaintDTO, Authentication authentication) {
        String currentEmail = authentication.getName();
        Account account = accountRepository.findByEmail(currentEmail);

        // Validate the complaintId in the DTO
        if (responseComplaintDTO.getComplaintId() == null || responseComplaintDTO.getComplaintId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }

        // Find the complaint by complaintId
        Complaints complaint = complaintRepository.findByComplaintId(responseComplaintDTO.getComplaintId());
        if (complaint == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }

        // Check if a response complaint with the same complaintId and account already exists
        if (responseComplaintsRepository.findByComplaintAndAccount(complaint, account) != null) {
            return ResponseEntity.badRequest().body("Response complaint with the given complaint ID and account already exists");
        }

        // Create a new response complaint with default values
        ResponseComplaints response = new ResponseComplaints();
        response.setResponseContent(responseComplaintDTO.getResponseContent());
        response.setResponseTime(LocalDateTime.now());
        response.setAccount(account);
        response.setComplaint(complaint);

        // Save the new response complaint
        responseComplaintsRepository.save(response);

        return ResponseEntity.ok("Response complaint created successfully");
    }
    @PostMapping("/deleteresponseComplaint")
    public ResponseEntity<?> deleteResponseComplaint(@RequestBody ResponseComplaintsDTO responseComplaintDTO, Authentication authentication) {
        String currentEmail = authentication.getName();
        Account account = accountRepository.findByEmail(currentEmail);
        if(responseComplaintDTO.getUserName() != account.getUsername()){
            return ResponseEntity.status(403).body("You do not have permission to delete this response complaint");
        }
        ResponseComplaints response = responseComplaintsRepository.findById(responseComplaintDTO.getId()).orElse(null);
        if(response == null) {
            return ResponseEntity.badRequest().body("Response complaint not found");
        }
        responseComplaintsRepository.delete(response);

        return ResponseEntity.ok("Response complaint created successfully");
    }
    @PostMapping("/createBill")
    public ResponseEntity<?> createBill(@RequestBody BillDTO billDTO, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");
        // Only admins are allowed to create bills
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to create bills");
        }
        // Validate the feeId and apartmentNumber in the DTO
        if (billDTO.getFeeId() == null || billDTO.getFeeId().isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }
        if (billDTO.getApartmentNumber() == null || billDTO.getApartmentNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Apartment number is required");
        }
        // Find the FeeHousehold by feeId and apartmentNumber
        FeeHousehold feeHousehold = feeHouseholdRepository.findByApartmentNumberAndFeeId(billDTO.getApartmentNumber(), billDTO.getFeeId());
        if (feeHousehold == null) {
            return ResponseEntity.badRequest().body("FeeHousehold not found");
        }
        // Check if a Bill with the same startingDate and FeeHousehold already exists
        if (billRepository.findByStartingDateAndFeeHousehold(billDTO.getStartingDate(), feeHousehold) != null) {
            return ResponseEntity.badRequest().body("Bill with the same starting date and FeeHousehold already exists");
        }
        // Create a new Bill with default values
        Bill bill = new Bill();
        bill.setFeeHousehold(feeHousehold);
        bill.setAmount(billDTO.getAmount());
        bill.setStartingDate(billDTO.getStartingDate());
        bill.setDueDate(billDTO.getDueDate());
        bill.setStatus(billDTO.getStatus());
        bill.setPayingDate(billDTO.getPayingDate());
        // Save the new Bill
        billRepository.save(bill);

        return ResponseEntity.ok("Bill created successfully");
    }
    @PostMapping("/deleteBill")
    public ResponseEntity<?> deleteBill(@RequestBody BillDTO billDTO, Authentication authentication) {
        // Get the currently authenticated user's role
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");
        // Only admins are allowed to delete bills
        if (!"admin".equals(currentUserRole)) {
            return ResponseEntity.status(403).body("You do not have permission to delete bills");
        }
        // Find the Bill by startingDate and FeeHousehold
        Bill bill = billRepository.findById(billDTO.getId()).orElse(null);
        if (bill == null) {
            return ResponseEntity.badRequest().body("Bill not found");
        }
        // Delete the Bill
        billRepository.delete(bill);

        return ResponseEntity.ok("Bill deleted successfully");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/createReceiveNotification")
    public ResponseEntity<?> createReceiveNotification(@RequestBody ReceiveNotificationDTO dto) {
        // Validate input
        if (dto.getResidentId() == null || dto.getResidentId().isEmpty()) {
            return ResponseEntity.badRequest().body("Resident ID is required");
        }
        if (dto.getNotificationId() == null || dto.getNotificationId().isEmpty()) {
            return ResponseEntity.badRequest().body("Notification ID is required");
        }
        // Find Resident
        Resident resident = residentRepository.findByResidentId(dto.getResidentId());
        if (resident == null) {
            return ResponseEntity.badRequest().body("Resident not found");
        }

        // Find Notification
        Notification notification = notificationRepository.findByAnnouncementId(dto.getNotificationId());
        if (notification == null) {
            return ResponseEntity.badRequest().body("Notification not found");
        }

        // Check for duplicate
        if (receiveNotificationRepository.findByResidentAndNotification(resident, notification) != null) {
            return ResponseEntity.badRequest().body("This receiveNotification already exists");
        }

        // Create and save
        ReceiveNotification rn = new ReceiveNotification();
        rn.setResident(resident);
        rn.setNotification(notification);
        receiveNotificationRepository.save(rn);

        return ResponseEntity.ok("ReceiveNotification created successfully");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/deleteReceiveNotification")
    public ResponseEntity<?> deleteReceiveNotification(@RequestBody ReceiveNotificationDTO dto) {
        ReceiveNotification rn = receiveNotificationRepository.findById(dto.getId()).orElse(null);
        if (rn == null) {
            return ResponseEntity.badRequest().body("ReceiveNotification not found");
        }
        receiveNotificationRepository.delete(rn);
        return ResponseEntity.ok("ReceiveNotification created successfully");
    }
    @PostMapping("/createIncludeInComplaints")
    public ResponseEntity<?> createIncludeInComplaints(@RequestBody IncludeInComplaintsDTO dto) {
        // Validate input
        if (dto.getResidentId() == null || dto.getResidentId().isEmpty()) {
            return ResponseEntity.badRequest().body("Resident ID is required");
        }
        if (dto.getComplaintId() == null || dto.getComplaintId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }
        // Find Resident
        Resident resident = residentRepository.findByResidentId(dto.getResidentId());
        if (resident == null) {
            return ResponseEntity.badRequest().body("Resident not found");
        }
        // Find Complaint
        Complaints complaint = complaintRepository.findByComplaintId(dto.getComplaintId());
        if (complaint == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }
        // Check for duplicate
        if (includeInComplaintsRepository.findByResidentAndComplaint(resident, complaint) != null) {
            return ResponseEntity.badRequest().body("This IncludeInComplaints already exists");
        }
        // Create and save
        IncludeInComplaints inc = new IncludeInComplaints();
        inc.setResident(resident);
        inc.setComplaint(complaint);
        includeInComplaintsRepository.save(inc);

        return ResponseEntity.ok("IncludeInComplaints created successfully");
    }
    @PostMapping("/deleteIncludeInComplaints")
    public ResponseEntity<?> deleteIncludeInComplaints(@RequestBody IncludeInComplaintsDTO dto) {
        IncludeInComplaints inc = includeInComplaintsRepository.findById(dto.getId()).orElse(null);
        if (inc == null) {
            return ResponseEntity.badRequest().body("IncludeInComplaints not found");
        }
        includeInComplaintsRepository.delete(inc);
        return ResponseEntity.ok("IncludeInComplaints deleted successfully");
    }
}
