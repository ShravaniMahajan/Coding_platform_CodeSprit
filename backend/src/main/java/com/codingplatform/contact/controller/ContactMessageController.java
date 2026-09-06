package com.codingplatform.contact.controller;

import com.codingplatform.contact.dto.ContactMessageRequest;
import com.codingplatform.contact.entity.ContactMessage;
import com.codingplatform.contact.service.ContactMessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageService service;

    @PostMapping
    public ResponseEntity<ContactMessage> submitMessage(@Valid @RequestBody ContactMessageRequest request) {
        return ResponseEntity.ok(service.saveMessage(request));
    }

    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllMessages() {
        return ResponseEntity.ok(service.getAllMessages());
    }
}
