package com.codingplatform.contact.service;

import com.codingplatform.contact.dto.ContactMessageRequest;
import com.codingplatform.contact.entity.ContactMessage;
import com.codingplatform.contact.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository repository;

    public ContactMessage saveMessage(ContactMessageRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.getName());
        message.setEmail(request.getEmail());
        message.setMessage(request.getMessage());
        return repository.save(message);
    }

    public List<ContactMessage> getAllMessages() {
        return repository.findAll();
    }
}
