document.addEventListener("DOMContentLoaded", function () {
    console.log("🗺️ Map loaded");

    const map = L.map('map').setView([26.8467, 80.9462], 12); // Default to Lucknow

    // Add OpenStreetMap Layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let userMarker = null;
    let rideMarkers = [];
    let passengerMarkers = [];
    let routingControl = null;

    // Function to show match popup
    function showMatchPopup(type, username, distance) {
        const popup = L.popup()
            .setLatLng(map.getCenter())
            .setContent(`
                <div class="match-popup">
                    <h3>${type} Match Found!</h3>
                    <p><strong>${username}</strong> is available</p>
                    <p>${distance} km from your location</p>
                    <button class="accept-btn">Accept</button>
                    <button class="decline-btn">Decline</button>
                </div>
            `)
            .openOn(map);

        // Handle button clicks (you can add actual functionality here)
        document.querySelector('.accept-btn')?.addEventListener('click', () => {
            alert(`You've accepted ${username}'s ${type}`);
            map.closePopup();
        });

        document.querySelector('.decline-btn')?.addEventListener('click', () => {
            map.closePopup();
        });
    }

    // Function to calculate distance between coordinates
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return (R * c).toFixed(1); // Distance in km with 1 decimal
    }

    // Ask for User Location Permission
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                console.log(`📍 Your live location: ${lat}, ${lng}`);

                // Remove previous marker
                if (userMarker) {
                    map.removeLayer(userMarker);
                }

                // Add new marker
                userMarker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup("🚶 You are here")
                    .openPopup();

                // Center map on user location
                map.setView([lat, lng], 13);

                // Store live location in database (AJAX request)
                fetch("http://localhost:8080/api/rides/store", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        driverUsername: "testDriver",
                        pickupLocation: "current",
                        destination: "current",
                        latitude: lat,
                        longitude: lng
                    })
                }).catch(error => console.error("❌ Error storing location:", error));
            },
            function () {
                alert("❌ Location permission denied. Please enable location access.");
            }
        );
    } else {
        alert("❌ Geolocation not supported by your browser.");
    }

    // Find Ride button functionality
    window.findRide = function() {
        const pickup = document.getElementById('pickup').value;
        const destination = document.getElementById('destination').value;

        if (!pickup || !destination) {
            alert('Please enter both pickup and destination locations.');
            return;
        }

        // Simulate finding a ride (in a real app, this would be an API call)
        setTimeout(() => {
            if (userMarker) {
                const userLatLng = userMarker.getLatLng();
                const rideLat = userLatLng.lat + (Math.random() * 0.02 - 0.01);
                const rideLng = userLatLng.lng + (Math.random() * 0.02 - 0.01);

                const distance = calculateDistance(
                    userLatLng.lat, userLatLng.lng,
                    rideLat, rideLng
                );

                showMatchPopup("Ride", "Driver123", distance);

                // Add ride marker
                const rideMarker = L.marker([rideLat, rideLng])
                    .addTo(map)
                    .bindPopup(`🚗 Ride available (${distance} km away)`)
                    .openPopup();

                rideMarkers.push(rideMarker);

                // Show route if user accepts
                if (routingControl) {
                    map.removeControl(routingControl);
                }

                routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(userLatLng.lat, userLatLng.lng),
                        L.latLng(rideLat, rideLng)
                    ],
                    routeWhileDragging: true
                }).addTo(map);
            }
        }, 1500);
    };

    // Find Passenger button functionality
    window.findPassenger = function() {
        const pickup = document.getElementById('pickup').value;
        const destination = document.getElementById('destination').value;

        if (!pickup || !destination) {
            alert('Please enter both pickup and destination locations.');
            return;
        }

        // Simulate finding a passenger (in a real app, this would be an API call)
        setTimeout(() => {
            if (userMarker) {
                const userLatLng = userMarker.getLatLng();
                const passengerLat = userLatLng.lat + (Math.random() * 0.02 - 0.01);
                const passengerLng = userLatLng.lng + (Math.random() * 0.02 - 0.01);

                const distance = calculateDistance(
                    userLatLng.lat, userLatLng.lng,
                    passengerLat, passengerLng
                );

                showMatchPopup("Passenger", "Passenger456", distance);

                // Add passenger marker
                const passengerMarker = L.marker([passengerLat, passengerLng])
                    .addTo(map)
                    .bindPopup(`🚶 Passenger available (${distance} km away)`)
                    .openPopup();

                passengerMarkers.push(passengerMarker);

                // Show route if user accepts
                if (routingControl) {
                    map.removeControl(routingControl);
                }

                routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(userLatLng.lat, userLatLng.lng),
                        L.latLng(passengerLat, passengerLng)
                    ],
                    routeWhileDragging: true
                }).addTo(map);
            }
        }, 1500);
    };

    // Fetch Live Rides & Passengers Every 5 Seconds
    setInterval(async () => {
        try {
            const rideResponse = await fetch("http://localhost:8080/api/rides/live");
            const passengerResponse = await fetch("http://localhost:8080/api/passengers/live");

            const rides = await rideResponse.json();
            const passengers = await passengerResponse.json();

            console.log("🚗 Live Rides:", rides);
            console.log("🚶 Live Passengers:", passengers);

            // Clear old markers
            rideMarkers.forEach(marker => map.removeLayer(marker));
            passengerMarkers.forEach(marker => map.removeLayer(marker));
            rideMarkers = [];
            passengerMarkers = [];

            // Display Rides
            rides.forEach(ride => {
                const marker = L.marker([ride.latitude, ride.longitude])
                    .addTo(map)
                    .bindPopup(`🚗 Ride: ${ride.driverUsername}`);
                rideMarkers.push(marker);
            });

            // Display Passengers
            passengers.forEach(passenger => {
                const marker = L.marker([passenger.latitude, passenger.longitude])
                    .addTo(map)
                    .bindPopup(`🚶 Passenger: ${passenger.passengerUsername}`);
                passengerMarkers.push(marker);
            });

        } catch (error) {
            console.error("❌ Error fetching live data:", error);
        }
    }, 5000);  // Update every 5 seconds
});