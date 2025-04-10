package com.poolme.controllers;

import com.poolme.models.Passenger;
import com.poolme.repositories.PassengerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/passengers")
@CrossOrigin("*")
public class PassengerController {

    private final PassengerRepository passengerRepository;

    public PassengerController(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }

    // ✅ Store Passenger with Live Location
    @PostMapping("/store")
    public ResponseEntity<String> storePassenger(@RequestBody Passenger passenger) {
        passengerRepository.save(passenger);
        return ResponseEntity.ok("✅ Passenger stored successfully with location.");
    }

    // ✅ Get All Passengers with Live Locations
    @GetMapping("/live")
    public List<Passenger> getAllPassengers() {
        return passengerRepository.findAll();
    }
}
