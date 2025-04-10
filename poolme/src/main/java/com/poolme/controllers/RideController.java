package com.poolme.controllers;

import com.poolme.models.Ride;
import com.poolme.repositories.RideRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin("*")
public class RideController {

    private final RideRepository rideRepository;

    public RideController(RideRepository rideRepository) {
        this.rideRepository = rideRepository;
    }

    // ✅ Store Ride with Live Location
    @PostMapping("/store")
    public ResponseEntity<String> storeRide(@RequestBody Ride ride) {
        rideRepository.save(ride);
        return ResponseEntity.ok("✅ Ride stored successfully with location.");
    }

    // ✅ Get All Rides with Live Locations
    @GetMapping("/live")
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }
}
