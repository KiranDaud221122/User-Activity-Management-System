package com.crud.operation.repository;

import com.crud.operation.entity.ActivityDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActivityDetailsRepository extends MongoRepository<ActivityDetails,String> {
    Optional<ActivityDetails> findByActivityDetailsId(String activityDetailsId);

}
