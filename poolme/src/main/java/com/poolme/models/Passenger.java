package com.poolme.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String passengerUsername;
    private String pickupLocation;
    private String destination;
    private String status;

    // ✅ Live Location Fields
    private double latitude;
    private double longitude;
}
