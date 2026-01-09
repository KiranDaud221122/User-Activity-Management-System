package com.crud.operation.repository;

import com.crud.operation.entity.UserActivity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserActivityRepository extends MongoRepository<UserActivity,String> {
    List<UserActivity> findByUserId(String userId);
    boolean existsByActivityId(String activityId);
}
