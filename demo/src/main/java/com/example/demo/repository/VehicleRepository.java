package com.example.demo.repository;

import com.example.demo.model.Vehicle;
import com.example.demo.model.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    Vehicle findByLicensePlate(String licensePlate);

    List<Vehicle> findAllByResident(Resident resident); // ✅ Tìm tất cả xe của resident
    boolean existsByParkingSlotAndLicensePlateNot(String parkingSlot, String licensePlate); // ✅ Kiểm tra biển số xe đã tồn tại trong danh sách xe của cư dân chưa
}
