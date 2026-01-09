package com.crud.operation.config;

import org.hibernate.annotations.ConcreteProxy;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
public class MongoAuditConfig {
}
