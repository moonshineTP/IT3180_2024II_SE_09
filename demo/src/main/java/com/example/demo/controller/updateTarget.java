package com.example.demo.controller;

import com.example.demo.model.DTO.AccountDTO;
import com.example.demo.model.DTO.ResidentDTO;
import com.example.demo.model.DTO.VehicleDTO;
import com.example.demo.model.DTO.FeeDTO;
import com.example.demo.model.DTO.DonationDTO;
import com.example.demo.model.DTO.ComplaintsDTO;
import com.example.demo.model.Account;
import com.example.demo.model.Bill;
import com.example.demo.model.Resident;
import com.example.demo.model.Vehicle;
import com.example.demo.model.Fee;
import com.example.demo.model.Donation;
import com.example.demo.model.Complaints;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.ResidentRepository;
import com.example.demo.repository.VehicleRepository;
import com.example.demo.repository.FeeRepository;
import com.example.demo.repository.DonationRepository;
import com.example.demo.repository.BillRepository;
import com.example.demo.repository.ComplaintRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
        if (feeDTO.getFeeId() == null || feeDTO.getFeeId().isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }

        // Find the fee by fee_id
        Fee fee = feeRepository.findByFeeId(feeDTO.getFeeId());
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
        String feeId = feeDTO.getFeeId();
        // Validate the feeId
        if (feeId == null || feeId.isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }

        // Find the fee by feeId
        Fee fee = feeRepository.findByFeeId(feeId);
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
        Complaints complaint = complaintRepository.findComplaintById(complaintDTO.getComplaintId());
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
        Complaints complaint = complaintRepository.findComplaintById(complaintId);
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
        if (residentRepository.findByResident_id(residentDTO.getResident_id()) != null) {
            return ResponseEntity.badRequest().body("Resident with the given ID already exists");
        }

        // Create a new resident with default values
        Resident resident = new Resident();
        resident.setResident_id(residentDTO.getResident_id());
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
        if (feeDTO.getFeeId() == null || feeDTO.getFeeId().isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }

        // Check if a fee with the same ID already exists
        if (feeRepository.findByFeeId(feeDTO.getFeeId()) != null) {
            return ResponseEntity.badRequest().body("Fee with the given ID already exists");
        }

        // Create a new fee with default values
        Fee fee = new Fee();
        fee.setFeeId(feeDTO.getFeeId());
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
        if (complaintRepository.findComplaintById(complaintDTO.getComplaintId()) != null) {
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
}
