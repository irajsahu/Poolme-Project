document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded ✅");
    // Function when "Find Pillion" button is clicked
    function findPillion() {
        alert("Searching for a pillion... 🚀");
        // Redirect or perform API call to find pillion
        window.location.href = "/find-pillion";
    }

    // Function when "Find Passenger" button is clicked
    function findPassenger() {
        alert("Searching for a passenger... 🏍️");
        // Redirect or perform API call to find passenger
        window.location.href = "/find-passenger";
    }


    // ✅ Handle Login Form Submission
    const loginForm = document.querySelector("form[action='/api/auth/login']");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const formData = new FormData(loginForm);
            const response = await fetch("/api/auth/login", {
                method: "POST",
                body: new URLSearchParams(formData),
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            if (response.ok) {
                window.location.href = "/home"; // Redirect to home page after login
            } else {
                alert("Invalid credentials. Please try again.");
            }
        });
    }

    // ✅ Handle Registration Form Submission
    const registerForm = document.querySelector("form[action='/api/auth/register']");
    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const formData = new FormData(registerForm);
            const response = await fetch("/api/auth/register", {
                method: "POST",
                body: new URLSearchParams(formData),
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            if (response.ok) {
                window.location.href = "/home"; // Redirect after successful registration
            } else {
                alert("Registration failed. User may already exist.");
            }
        });
    }

    // ✅ Handle Map Functionality in Home Page
    if (document.getElementById("map")) {
        const map = L.map('map').setView([26.8467, 80.9462], 12); // Default (Lucknow)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        let routingControl;

        document.getElementById('findRideBtn').addEventListener('click', function () {
            const pickup = document.getElementById('pickup').value;
            const destination = document.getElementById('destination').value;

            if (!pickup || !destination) {
                alert('Please enter both pickup and destination locations.');
                return;
            }

            // Simulated location (hardcoded for now)
            const pickupCoords = [26.8467, 80.9462];
            const destinationCoords = [26.9124, 75.7873];

            L.marker(pickupCoords).addTo(map).bindPopup("Pickup: " + pickup).openPopup();
            L.marker(destinationCoords).addTo(map).bindPopup("Destination: " + destination).openPopup();

            if (routingControl) {
                map.removeControl(routingControl);
            }

            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(pickupCoords),
                    L.latLng(destinationCoords)
                ],
                routeWhileDragging: true
            }).addTo(map);
        });
    }
});
