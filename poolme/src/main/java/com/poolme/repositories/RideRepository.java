package com.poolme.repositories;

import com.poolme.models.Ride;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByPickupLocationIgnoreCaseAndDestinationIgnoreCaseAndStatus(
            String pickupLocation, String destination, String status
    );
}