package com.example.demo.service;

import com.example.demo.model.Account;
import com.example.demo.repository.AccountRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final AccountRepository accountRepository;

    public CustomUserDetailsService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        // Fetch account by email
        Account account = accountRepository.findByEmail(email);
        if (account == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        // Return a UserDetails object with only the email in the SecurityContext
        return new org.springframework.security.core.userdetails.User(
            account.getEmail(),
            "", // No password needed in the SecurityContext
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + account.getRole()))
        );
    }
}