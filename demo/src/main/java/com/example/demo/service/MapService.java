package com.example.demo.service;

import org.aspectj.weaver.ast.Not;
import org.springframework.stereotype.Service;

import com.example.demo.model.Account;
import com.example.demo.model.Donation;
import com.example.demo.model.Fee;
import com.example.demo.model.Resident;
import com.example.demo.model.Vehicle;
import com.example.demo.model.Complaints;
import com.example.demo.model.Notification;
import com.example.demo.model.DTO.AccountDTO;
import com.example.demo.model.DTO.FeeDTO;
import com.example.demo.model.DTO.ResidentDTO;
import com.example.demo.model.DTO.VehicleDTO;
import com.example.demo.model.DTO.DonationDTO;
import com.example.demo.model.DTO.ComplaintsDTO;
import com.example.demo.model.DTO.NotificationDTO;
@Service 
public class MapService {
    // Helper method to map Resident to ResidentDTO based on role
    public ResidentDTO mapToResidentDTO(Resident resident, boolean full) {
        ResidentDTO dto = new ResidentDTO();
        dto.setResident_id(resident.getResident_id());
        dto.setFullName(resident.getFullName());
        dto.setGender(resident.getGender());
        dto.setDateOfBirth(resident.getDateOfBirth());
        dto.setPlaceOfBirth(resident.getPlaceOfBirth());
        dto.setOccupation(resident.getOccupation());
        dto.setApartmentNumber(resident.getApartmentNumber());
        dto.setRelationshipWithOwner(resident.getRelationshipWithOwner());
        dto.setMoveInDate(resident.getMoveInDate());
        dto.setMoveOutDate(resident.getMoveOutDate());
        dto.setAvatar(resident.getAvatar());
        dto.setLinkingUsername(resident.getAccount().getUsername());
        // Admin gets all information
        if (full) {
            dto.setIdentityNumber(resident.getIdentityNumber());
            dto.setCccdIssueDate(resident.getCccdIssueDate());
            dto.setCccdExpiryDate(resident.getCccdExpiryDate());
            dto.setPhoneNumber(resident.getPhoneNumber());
            dto.setEmail(resident.getEmail());
            dto.setIsHouseholdOwner(resident.getIsHouseholdOwner());
            dto.setLinkingEmail(resident.getAccount().getEmail());
        }
        else {
            dto.setIdentityNumber(null);
            dto.setCccdIssueDate(null);
            dto.setCccdExpiryDate(null);
            dto.setPhoneNumber(null);
            dto.setEmail(null);
            dto.setIsHouseholdOwner(null);
            dto.setLinkingEmail(null);
        }

        return dto;
    }
    public VehicleDTO mapToVehicleDTO(Vehicle vehicle) {
        VehicleDTO dto = new VehicleDTO();
        dto.setLicensePlate(vehicle.getLicensePlate());
        dto.setResidentId(vehicle.getResident() != null ? vehicle.getResident().getResident_id() : null);
        dto.setVehicleType(vehicle.getVehicleType());
        dto.setBrand(vehicle.getBrand());
        dto.setModel(vehicle.getModel());
        dto.setColor(vehicle.getColor());
        dto.setRegistrationDate(vehicle.getRegistrationDate());
        dto.setParkingSlot(vehicle.getParkingSlot());
        dto.setImage(vehicle.getImage());
        dto.setNote(vehicle.getNote());
        return dto;
    }
    // Helper method to map Account to AccountDTO
    public AccountDTO mapToAccountDTO(Account account, boolean full) {
        AccountDTO dto = new AccountDTO();
        dto.setUsername(account.getUsername());
        if (full) {
            dto.setEmail(account.getEmail());
        }
        dto.setRole(account.getRole());
        dto.setStatus(account.getStatus());
        dto.setBan(account.getBan());
        dto.setCreatedDate(account.getCreatedDate());
        dto.setLastVisit(account.getLastVisit());
        if (account.getResident() != null) {
            dto.setResident_id(account.getResident().getResident_id());
        }
        return dto;
    }
    public FeeDTO mapToFeeDTO(Fee fee, boolean full) {
        FeeDTO responseDTO = new FeeDTO();
        responseDTO.setFeeId(fee.getFeeId());
        responseDTO.setFeeName(fee.getFeeName());
        responseDTO.setFeeType(fee.getFeeType());
        responseDTO.setCreatedAt(fee.getCreatedAt());
        responseDTO.setUpdatedAt(fee.getUpdatedAt());
        responseDTO.setSupervisor(fee.getSupervisor());
        if(full) responseDTO.setNote(fee.getNote());
        return responseDTO;
    }
    public DonationDTO mapToDonationDTO(Donation donation, boolean full) {
        DonationDTO responseDTO = new DonationDTO();
        responseDTO.setId(donation.getId());
        responseDTO.setDonationName(donation.getDonationName());
        responseDTO.setFounder(donation.getFounder());
        responseDTO.setAccumulatedMoney(donation.getAccumulatedMoney());
        responseDTO.setStatus(donation.getStatus());
        if(full) responseDTO.setContent(donation.getContent());
        return responseDTO;
    }
    public ComplaintsDTO mapToComplaintsDTO(Complaints complaints, boolean full) {
        ComplaintsDTO responseDTO = new ComplaintsDTO();
        responseDTO.setComplaintId(complaints.getComplaintId());
        responseDTO.setTitle(complaints.getTitle());
        responseDTO.setSubmittedAt(complaints.getSubmittedAt());
        responseDTO.setStatus(complaints.getStatus());
        responseDTO.setProcessedAt(complaints.getProcessedAt());
        responseDTO.setStaffId(complaints.getStaffId());
        if(full) responseDTO.setDescription(complaints.getDescription());
        return responseDTO;
    }
    public NotificationDTO mapToNotificationDTO(Notification notification, boolean full) {
        NotificationDTO responseDTO = new NotificationDTO();
        responseDTO.setAnnouncementId(notification.getAnnouncementId());
        responseDTO.setTitle(notification.getTitle());
        responseDTO.setCreatedAt(notification.getCreatedAt());
        responseDTO.setUpdatedAt(notification.getUpdatedAt());
        responseDTO.setCreatorName(notification.getCreatorName());
        responseDTO.setType(notification.getType());
        responseDTO.setSendto(notification.getSendto());
        if(full) responseDTO.setContent(notification.getContent());
        return responseDTO;
    }
}
