package com.example.demo.scheduler;   // đổi theo cấu trúc của bạn

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.demo.repository.AccountRepository;
import com.example.demo.model.Account;

@Component
public class OfflineChecker {

    @Autowired
    private AccountRepository accountRepo;

    @Scheduled(fixedRate = 60_000)           // chạy mỗi 1 phút
    public void checkInactiveUsers() {
        System.out.println("Checking for inactive users...");
        Instant cutoff = Instant.now().minus(Duration.ofMinutes(5));
        List<Account> inactive = accountRepo
                .findByLastVisitBeforeAndStatus(cutoff, "Online");

        inactive.forEach(u -> u.setStatus("Offline"));
        accountRepo.saveAll(inactive);
    }
}
