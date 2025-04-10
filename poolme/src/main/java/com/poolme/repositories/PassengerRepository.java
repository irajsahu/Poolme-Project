package com.poolme.repositories;

import com.poolme.models.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PassengerRepository extends JpaRepository<Passenger, Long> {
    List<Passenger> findByPickupLocationIgnoreCaseAndDestinationIgnoreCaseAndStatus(
            String pickupLocation, String destination, String status
    );
}