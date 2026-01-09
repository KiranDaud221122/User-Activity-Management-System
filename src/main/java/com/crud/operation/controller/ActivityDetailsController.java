package com.crud.operation.controller;

import com.crud.operation.entity.ActivityDetails;
import com.crud.operation.service.ActivityDetailsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity-details")
@RequiredArgsConstructor
@Slf4j
public class ActivityDetailsController {

    private final ActivityDetailsService activityDetailsService;

    @PostMapping
    public ResponseEntity<ActivityDetails> create(@RequestBody ActivityDetails activityDetails){
        log.info("Received request to create activity with type: {}", activityDetails.getActivityDetailsId());
        ActivityDetails saved = activityDetailsService.create(activityDetails);
        log.info("Activity created successfully with id: {}", saved.getId());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityDetails> getById(@PathVariable String id){
        log.info("Fetching activity with id: {}", id);
        ActivityDetails activity = activityDetailsService.getById(id);
        log.info("Returning activity with id: {}", activity.getId());
        return ResponseEntity.ok(activity);
    }

    @GetMapping
    public ResponseEntity<List<ActivityDetails>> getAll(){
        log.info("Fetching all activities");
        List<ActivityDetails> activities = activityDetailsService.getAll();
        log.info("Returning {} activities", activities.size());
        return ResponseEntity.ok(activities);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id){
        log.info("Deleting activity with id: {}", id);
        activityDetailsService.delete(id);
        log.info("Activity deleted successfully with id: {}", id);
        return ResponseEntity.ok("Activity deleted successfully with id: " + id);
    }
}
