package com.example.demo.controller;

import com.example.demo.model.DTO.AccountDTO;
import com.example.demo.model.DTO.BillDTO;
import com.example.demo.model.DTO.ComplaintsDTO;
import com.example.demo.model.DTO.DonationDTO;
import com.example.demo.model.DTO.DonationHouseholdDTO;
import com.example.demo.model.DTO.FeeDTO;
import com.example.demo.model.DTO.FeeHouseholdDTO;
import com.example.demo.model.DTO.IncludeInComplaintsDTO;
import com.example.demo.model.DTO.NotificationDTO;
import com.example.demo.model.DTO.VehicleDTO;
import com.example.demo.model.DTO.InteractComplaintDTO;
import com.example.demo.model.DTO.InteractNotificationDTO;
import com.example.demo.model.DTO.ReceiveNotificationDTO;
import com.example.demo.model.DTO.ResponseComplaintsDTO;
import com.example.demo.model.DTO.ResponseNotificationDTO;
import com.example.demo.model.Account;
import com.example.demo.model.Bill;
import com.example.demo.model.Complaints;
import com.example.demo.model.Donation;
import com.example.demo.model.DonationHousehold;
import com.example.demo.model.Fee;
import com.example.demo.model.FeeHousehold;
import com.example.demo.model.IncludeInComplaints;
import com.example.demo.model.Vehicle;
import com.example.demo.model.InteractComplaint;
import com.example.demo.model.InteractNotification;
import com.example.demo.model.ReceiveNotification;
import com.example.demo.model.ResponseComplaints;
import com.example.demo.model.Notification;
import com.example.demo.model.Resident;
import com.example.demo.repository.AccountRepository;
import com.example.demo.repository.BillRepository;
import com.example.demo.model.ResponseNotification;

import java.util.List;
import java.util.stream.Collectors;

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
import com.example.demo.repository.FeeHouseholdRepository;
import com.example.demo.repository.DonationHouseholdRepository;
import com.example.demo.repository.ReceiveNotificationRepository;



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
    @Autowired
    private FeeHouseholdRepository feeHouseholdRepository;
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private DonationHouseholdRepository donationHouseholdRepository;
    @Autowired
    private ReceiveNotificationRepository receiveNotificationRepository;

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
            boolean includeEmail = account.getEmail().equals(currentEmail)||"ROLE_admin".equals(currentUserRole);

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
        if(requestDTO.getResidentId() != null) {
            Resident resident = residentRepository.findByResidentId(requestDTO.getResidentId());
            if (resident==null) {
                return ResponseEntity.badRequest().body("Resident not found");
            }
            // Check if the resident belongs to the current user
            boolean full = "ROLE_admin".equals(currentUserRole) || resident.getAccount().getEmail().equals(currentEmail);
            ResidentDTO responseDTO = mapService.mapToResidentDTO(resident, full);
            return ResponseEntity.ok(responseDTO);
        }
        return ResponseEntity.badRequest().body("Invalid request");
    }
    @PostMapping("/getVehiclesByResident")
    public ResponseEntity<?> getVehiclesByResident(@RequestBody VehicleDTO vehicleDTO) {
        // Validate the residentId in the DTO
        if (vehicleDTO.getResidentId() == null || vehicleDTO.getResidentId().isEmpty()) {
            return ResponseEntity.badRequest().body("Resident ID is required");
        }

        // Find the resident by residentId
        Resident resident = residentRepository.findByResidentId(vehicleDTO.getResidentId());
        if (resident == null) {
            return ResponseEntity.badRequest().body("Resident not found");
        }

        // Find vehicles by resident
        List<Vehicle> vehicles = vehicleRepository.findAllByResident(resident);
        if (vehicles.isEmpty()) {
            return ResponseEntity.ok("No vehicles found for the given resident");
        }

        // Map vehicles to VehicleDTOs
        List<VehicleDTO> vehicleDTOs = vehicles.stream()
                .map(vehicle -> mapService.mapToVehicleDTO(vehicle))
                .collect(Collectors.toList());

        return ResponseEntity.ok(vehicleDTOs);
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
                    dto.setResidentId(resident.getResidentId());
                    dto.setFullName(resident.getFullName());
                    dto.setGender(resident.getGender());
                    dto.setRelationshipWithOwner(resident.getRelationshipWithOwner());
                    dto.setIsHouseholdOwner(resident.getIsHouseholdOwner());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(residentDTOs);
    }
    @PostMapping("/getFee")
    public ResponseEntity<?> getFee(@RequestBody FeeDTO feeDTO) {
        // Validate the feeId in the DTO
        if (feeDTO.getId() == null || feeDTO.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }

        // Find the fee by feeId
        Fee fee = feeRepository.findFeeById(feeDTO.getId());
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
    public ResponseEntity<?> getNotification(@RequestBody NotificationDTO notificationDTO,Authentication authentication) {
        // Validate the notificationId in the DTO
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");
        String currentEmail = authentication.getName();
        Account account = accountRepository.findByEmail(currentEmail);
        if (notificationDTO.getAnnouncementId() == null || notificationDTO.getAnnouncementId().isEmpty()) {
            return ResponseEntity.badRequest().body("Notification ID is required");
        }

        // Find the notification by ID
        Notification notification = notificationRepository.findById(notificationDTO.getAnnouncementId()).orElse(null);
        if (notification == null) {
            return ResponseEntity.badRequest().body("Notification not found");
        }
        if("ROLE_guest".equals(currentUserRole)){
            return ResponseEntity.badRequest().body("You are not allowed to access this resource");
        }
        if ("ROLE_resident".equals(currentUserRole)) {
        // Find the resident associated with the current account
        Resident resident = account.getResident();

        // Check if the pair of resident and notification exists in the receiveNotification table
        boolean exists = receiveNotificationRepository.existsByResidentAndNotification(resident, notification);
        if (!exists) {
            return ResponseEntity.badRequest().body("You are not authorized to access this notification");
        }
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
    @PostMapping("/getFeeHouseholds")
    public ResponseEntity<?> getFeeHouseholds(@RequestBody FeeDTO feeDTO) {
        // Validate the feeId in the DTO
        if (feeDTO.getId() == null || feeDTO.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }

        // Find the fee by feeId
        Fee fee = feeRepository.findFeeById(feeDTO.getId());
        if (fee == null) {
            return ResponseEntity.badRequest().body("Fee not found");
        }

        // Get the list of FeeHousehold entities associated with the Fee
        List<FeeHousehold> feeHouseholds = fee.getFeeHouseholds();

        // Map FeeHousehold entities to FeeHouseholdDTO
        List<FeeHouseholdDTO> feeHouseholdDTOs = feeHouseholds.stream()
                .map(feeHousehold -> {
                    FeeHouseholdDTO dto = new FeeHouseholdDTO();
                    dto.setApartmentNumber(feeHousehold.getApartmentNumber());
                    dto.setStartingDay(feeHousehold.getStartingDay());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(feeHouseholdDTOs);
    }
    @PostMapping("/getBills")
    public ResponseEntity<?> getBills(@RequestBody FeeHouseholdDTO feeHouseholdDTO) {
        // Validate the feeId and apartmentNumber in the DTO
        if (feeHouseholdDTO.getApartmentNumber() == null || feeHouseholdDTO.getApartmentNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Apartment number is required");
        }
        if (feeHouseholdDTO.getFeeID() == null || feeHouseholdDTO.getFeeID().isEmpty()) {
            return ResponseEntity.badRequest().body("Fee ID is required");
        }

        // Find the FeeHousehold by apartmentNumber and feeId
        FeeHousehold feeHousehold = feeHouseholdRepository.findByApartmentNumberAndFeeId(
                feeHouseholdDTO.getApartmentNumber(), feeHouseholdDTO.getFeeID());
        if (feeHousehold == null) {
            return ResponseEntity.badRequest().body("FeeHousehold not found for the given apartment number and fee ID");
        }

        // Find the bills by FeeHousehold
        List<Bill> bills = billRepository.findByFeeHousehold(feeHousehold);
        if (bills.isEmpty()) {
            return ResponseEntity.ok("No bills found for the given FeeHousehold");
        }

        // Map Bill entities to BillDTO
        List<BillDTO> billDTOs = bills.stream()
                .map(bill -> {
                    BillDTO dto = new BillDTO();
                    dto.setId(bill.getId());
                    dto.setStartingDate(bill.getStartingDate());
                    dto.setDueDate(bill.getDueDate());
                    dto.setAmount(bill.getAmount());
                    dto.setStatus(bill.getStatus());
                    dto.setPayingDate(bill.getPayingDate());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(billDTOs);
    }
    @PostMapping("/getDonationHouseholds")
    public ResponseEntity<?> getDonationHouseholds(@RequestBody DonationDTO donationDTO) {
        // Validate the donationId in the DTO
        if (donationDTO.getId() == null || donationDTO.getId().isEmpty()) {
            return ResponseEntity.badRequest().body("Donation ID is required");
        }

        // Find the donation by donationId
        Donation donation = donationRepository.findDonationById(donationDTO.getId());
        if (donation == null) {
            return ResponseEntity.badRequest().body("Donation not found");
        }

        // Get the list of DonationHousehold entities associated with the Donation
        List<DonationHousehold> donationHouseholds = donation.getDonationHouseholds();

        // Map DonationHousehold entities to DonationHouseholdDTO
        List<DonationHouseholdDTO> donationHouseholdDTOs = donationHouseholds.stream()
                .map(donationHousehold -> {
                    DonationHouseholdDTO dto = new DonationHouseholdDTO();
                    dto.setApartmentNumber(donationHousehold.getApartmentNumber());
                    dto.setDonatedMoney(donationHousehold.getDonatedMoney());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(donationHouseholdDTOs);
    }
    @PostMapping("/getBillByApartment")
    public ResponseEntity<?> getBillDetails(@RequestBody BillDTO billDTO) {
        // Validate the apartmentNumber in the DTO
        if (billDTO.getApartmentNumber() == null || billDTO.getApartmentNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Apartment number is required");
        }

        // Find the bills by apartmentNumber
        List<Bill> bills = billRepository.findByApartmentNumber(billDTO.getApartmentNumber());
        if (bills.isEmpty()) {
            return ResponseEntity.ok("No bills found for the given apartment number");
        }

        // Map Bill entities to BillDTO (excluding apartmentNumber)
        List<BillDTO> billDTOs = bills.stream()
                .map(bill -> {
                    BillDTO dto = new BillDTO();
                    dto.setFeeId(bill.getFeeHousehold().getFee().getId());
                    dto.setFeeName(bill.getFeeHousehold().getFee().getFeeName());
                    dto.setStartingDate(bill.getStartingDate());
                    dto.setDueDate(bill.getDueDate());
                    dto.setAmount(bill.getAmount());
                    dto.setStatus(bill.getStatus());
                    dto.setPayingDate(bill.getPayingDate());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(billDTOs);
    }
    @PostMapping("/getDonationByApartment")
    public ResponseEntity<?> getDonationByApartment(@RequestBody DonationHouseholdDTO donationHouseholdDTO) {
        // Validate the apartmentNumber in the DTO
        if (donationHouseholdDTO.getApartmentNumber() == null || donationHouseholdDTO.getApartmentNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Apartment number is required");
        }

        // Find the DonationHousehold records by apartmentNumber
        List<DonationHousehold> donationHouseholds = donationHouseholdRepository.findByApartmentNumber(donationHouseholdDTO.getApartmentNumber());
        if (donationHouseholds.isEmpty()) {
            return ResponseEntity.ok("No donations found for the given apartment number");
        }

        // Map DonationHousehold entities to DonationDTO
        List<DonationHouseholdDTO> donationDTOs = donationHouseholds.stream()
                .map(donationHousehold -> {
                    DonationHouseholdDTO dto = new DonationHouseholdDTO();
                    dto.setDonation_id(donationHousehold.getDonation().getId());
                    dto.setDonationName(donationHousehold.getDonation().getDonationName());
                    dto.setDonatedMoney(donationHousehold.getDonatedMoney());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(donationDTOs);
    }
    @PostMapping("/getPrivateAccount")
    public ResponseEntity<?> getPrivateAccount(Authentication authentication) {
        // Get the current user's email from authentication
        String currentEmail = authentication.getName();
        Account account = accountRepository.findByEmail(currentEmail);
        if (account == null) {
            return ResponseEntity.badRequest().body("Account not found");
        }
        // Always include private info for the owner
        AccountDTO accountDTO = mapService.mapToAccountDTO(account, true);
        return ResponseEntity.ok(accountDTO);
    }
    @PostMapping("/getResponseComplaints")
    public ResponseEntity<?> getResponseComplaints(@RequestBody ComplaintsDTO complaintsDTO) {
        // Validate the complaintId in the DTO
        if (complaintsDTO.getComplaintId() == null || complaintsDTO.getComplaintId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }

        // Find the complaint by ID
        Complaints complaint = complaintsRepository.findById(complaintsDTO.getComplaintId()).orElse(null);
        if (complaint == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }
        List<ResponseComplaints> responses = complaint.getResponseComplaints();
        if (responses.isEmpty()) {
            return ResponseEntity.ok("No responses found for the given complaint");
        }
        // Map responseComplaints entities to DTO
        List<ResponseComplaintsDTO> responseDTOs = responses.stream()
                .map(response -> {
                    ResponseComplaintsDTO dto = new ResponseComplaintsDTO();
                    dto.setId(response.getId());
                    dto.setUserRole(response.getAccount().getRole());
                    dto.setUserName(response.getAccount().getUsername());
                    dto.setResponseTime(response.getResponseTime());
                    dto.setResponseContent(response.getResponseContent());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDTOs);
    }
    @PostMapping("/getResponseNotification")
    public ResponseEntity<?> getResponseNotification(@RequestBody NotificationDTO notificationDTO) {
        // Validate the notificationId in the DTO
        if (notificationDTO.getAnnouncementId() == null || notificationDTO.getAnnouncementId().isEmpty()) {
            return ResponseEntity.badRequest().body("Notification ID is required");
        }

        // Find the notification by ID
        Notification notification = notificationRepository.findById(notificationDTO.getAnnouncementId()).orElse(null);
        if (notification == null) {
            return ResponseEntity.badRequest().body("Notification not found");
        }
        List<ResponseNotification> responses = notification.getResponseNotifications();
        if (responses.isEmpty()) {
            return ResponseEntity.ok("No responses found for the given notification");
        }
        // Map responseComplaints entities to DTO
        List<ResponseNotificationDTO> responseDTOs = responses.stream()
                .map(response -> {
                    ResponseNotificationDTO dto = new ResponseNotificationDTO();
                    dto.setId(response.getId());
                    dto.setUserRole(response.getAccount().getRole());
                    dto.setUserName(response.getAccount().getUsername());
                    dto.setResponseTime(response.getResponseTime());
                    dto.setResponseContent(response.getResponseContent());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDTOs);
        }
    @PostMapping("/getReceiveResidents")
    public ResponseEntity<?> getReceiveResidents(@RequestBody NotificationDTO notificationDTO, Authentication authentication) {
        // Validate the notificationId in the DTO
        if (notificationDTO.getAnnouncementId() == null || notificationDTO.getAnnouncementId().isEmpty()) {
            return ResponseEntity.badRequest().body("Notification ID is required");
        }

        // Find the notification by ID
        Notification notification = notificationRepository.findById(notificationDTO.getAnnouncementId()).orElse(null);
        if (notification == null) {
            return ResponseEntity.badRequest().body("Notification not found");
        }

        // Get current user info
        String currentUserRole = authentication.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .findFirst()
                .orElse("guest");
        String currentEmail = authentication.getName();

        // Get all receiveNotification records for this notification
        List<ReceiveNotification> receiveNotifications = notification.getReceiveNotifications();
        if (receiveNotifications == null || receiveNotifications.isEmpty()) {
            return ResponseEntity.ok("No receive notifications found for the given notification");
        }

        // Check if current user is admin or a receiver
        boolean isReceiver = receiveNotifications.stream()
                .anyMatch(rn -> rn.getResident().getAccount().getEmail().equals(currentEmail));
        if (!"ROLE_admin".equalsIgnoreCase(currentUserRole) && !isReceiver) {
            return ResponseEntity.status(403).body("You do not have permission to view this list");
        }

        // Map to DTO (only id and residentID)
        List<ReceiveNotificationDTO> resultDTOs = receiveNotifications.stream()
                .map(rn -> {
                    ReceiveNotificationDTO dto = new ReceiveNotificationDTO();
                    dto.setId(rn.getId());
                    dto.setResidentId(rn.getResident().getResidentId());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(resultDTOs);
    }
    @PostMapping("/getIncludeResidents")
    public ResponseEntity<?> getIncludeResidents(@RequestBody ComplaintsDTO complaintsDTO) {
        // Validate the complaintId in the DTO
        if (complaintsDTO.getComplaintId() == null || complaintsDTO.getComplaintId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }

        // Find the complaint by ID
        Complaints complaint = complaintsRepository.findById(complaintsDTO.getComplaintId()).orElse(null);
        if (complaint == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }

        // Get the list of IncludeInComplaints entities associated with the complaint
        List<IncludeInComplaints> includeList = complaint.getIncludeInComplaints();
        if (includeList == null || includeList.isEmpty()) {
            return ResponseEntity.ok("No residents included for the given complaint");
        }

        // Map IncludeInComplaints entities to IncludeInComplaintsDTO (only residentID and ID)
        List<IncludeInComplaintsDTO> resultDTOs = includeList.stream()
                .map(inc -> {
                    IncludeInComplaintsDTO dto = new IncludeInComplaintsDTO();
                    dto.setId(inc.getId());
                    dto.setResidentId(inc.getResident().getResidentId());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(resultDTOs);
    }
    @PostMapping("/getInteractNotification")
    public ResponseEntity<?> getInteractNotification(@RequestBody InteractNotificationDTO interactNotificationDTO) {
        // Validate input
        if (interactNotificationDTO.getNotificationId() == null || interactNotificationDTO.getNotificationId().isEmpty()) {
            return ResponseEntity.badRequest().body("Notification ID is required");
        }
        if (interactNotificationDTO.getTypeInteract() == null || interactNotificationDTO.getTypeInteract().isEmpty()) {
            return ResponseEntity.badRequest().body("TypeInteract is required");
        }

        // Find the notification by ID
        Notification notification = notificationRepository.findByAnnouncementId(interactNotificationDTO.getNotificationId());
        if (notification == null) {
            return ResponseEntity.badRequest().body("Notification not found");
        }

        // Get all interactNotification records for this notification and typeInteract
        List<InteractNotification> interactList = notification.getInteractNotifications().stream()
                .filter(in -> interactNotificationDTO.getTypeInteract().equals(in.getTypeInteract()))
                .collect(Collectors.toList());

        if (interactList.isEmpty()) {
            return ResponseEntity.ok("No interact notifications found for the given notification and typeInteract");
        }

        // Map to DTO (only id, userName, userRole)
        List<InteractNotificationDTO> resultDTOs = interactList.stream()
                .map(in -> {
                    InteractNotificationDTO dto = new InteractNotificationDTO();
                    dto.setId(in.getId());
                    dto.setUserName(in.getAccount().getUsername());
                    dto.setUserRole(in.getAccount().getRole());
                    dto.setResponseTime(in.getResponseTime());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(resultDTOs);
    }
    @PostMapping("/getInteractComplaints")
    public ResponseEntity<?> getInteractComplaints(@RequestBody InteractComplaintDTO interactComplaintDTO) {
        // Validate input
        if (interactComplaintDTO.getComplaintId() == null || interactComplaintDTO.getComplaintId().isEmpty()) {
            return ResponseEntity.badRequest().body("Complaint ID is required");
        }
        if (interactComplaintDTO.getStarNumberRating() == null) {
            return ResponseEntity.badRequest().body("Star rating is required");
        }

        // Find the complaint by ID
        Complaints complaint = complaintsRepository.findById(interactComplaintDTO.getComplaintId()).orElse(null);
        if (complaint == null) {
            return ResponseEntity.badRequest().body("Complaint not found");
        }

        // Get all interactComplaint records for this complaint and starRating
        List<InteractComplaint> interactList = complaint.getInteractComplaints().stream()
                .filter(ic -> interactComplaintDTO.getStarNumberRating().equals(ic.getStarNumberRating()))
                .collect(Collectors.toList());

        if (interactList.isEmpty()) {
            return ResponseEntity.ok("No interact complaints found for the given complaint and star rating");
        }

        // Map to DTO (only id, userName, userRole)
        List<InteractComplaintDTO> resultDTOs = interactList.stream()
                .map(ic -> {
                    InteractComplaintDTO dto = new InteractComplaintDTO();
                    dto.setId(ic.getId());
                    dto.setUserName(ic.getAccount().getUsername());
                    dto.setUserRole(ic.getAccount().getRole());
                    dto.setResponseTime(ic.getResponseTime());
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(resultDTOs);
    }
}