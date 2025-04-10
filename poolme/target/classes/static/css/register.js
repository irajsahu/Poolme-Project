document.addEventListener("DOMContentLoaded", function () {
    console.log("Register JavaScript Loaded ✅");

    // ✅ Handle Registration Form Submission
    const registerForm = document.querySelector("form");
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
                alert("✅ Registration Successful!");
                window.location.href = "/home";  // Redirect after successful registration
            } else {
                alert("❌ Registration failed. User may already exist.");
            }
        });
    }
});
