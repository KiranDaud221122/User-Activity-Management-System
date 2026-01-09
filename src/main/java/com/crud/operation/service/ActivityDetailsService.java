package com.crud.operation.service;

import com.crud.operation.entity.ActivityDetails;
import com.crud.operation.repository.ActivityDetailsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityDetailsService {

    private final ActivityDetailsRepository activityDetailsRepository;

    public ActivityDetails create(ActivityDetails activityDetails) {
        log.info("Creating new activity with type: {}", activityDetails.getId());

        activityDetails.setActivityTimestamp(LocalDateTime.now());
        ActivityDetails saved = activityDetailsRepository.save(activityDetails);

        log.info("Activity created successfully with id: {}", saved.getId());
        return saved;
    }

    public ActivityDetails getById(String id) {
        log.info("Fetching activity with id: {}", id);

        return activityDetailsRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Activity not found with id: {}", id);
                    return new RuntimeException("Activity not found with id: " + id);
                });
    }

    public List<ActivityDetails> getAll() {
        log.info("Fetching all activities");
        return activityDetailsRepository.findAll();
    }

    public void delete(String id) {
        log.info("Deleting activity with id: {}", id);

        if (!activityDetailsRepository.existsById(id)) {
            log.error("Activity not found with id: {}", id);
            throw new RuntimeException("Activity not found with id: " + id);
        }

        activityDetailsRepository.deleteById(id);
        log.info("Activity deleted successfully with id: {}", id);
    }
}
