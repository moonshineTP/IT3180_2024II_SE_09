package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.model.Account;
import com.example.demo.model.Resident;
import com.example.demo.model.Vehicle;
import com.example.demo.model.DTO.AccountDTO;
import com.example.demo.model.DTO.ResidentDTO;
import com.example.demo.model.DTO.VehicleDTO;
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
        dto.setId(account.getId());
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
}
