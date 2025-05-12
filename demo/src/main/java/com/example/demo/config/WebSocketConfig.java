package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-chat")
                .setAllowedOriginPatterns(
                    "http://localhost:8080", 
                    "http://yourdomain.com",
                    "https://*.yourdomain.com" // Thêm pattern cho subdomain
                )
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry registry) {
        // Prefix cho các message mapping đến @MessageMapping
        registry.setApplicationDestinationPrefixes("/app");
        
        // Enable broker cho các topic
        registry.enableSimpleBroker(
            "/topic",  // Cho chat group
            "/queue"   // Cho chat private
        );
        
        // Prefix cho user destination
        registry.setUserDestinationPrefix("/user");
    }
}
