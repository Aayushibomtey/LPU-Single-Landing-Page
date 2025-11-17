// ===================== OVERVIEW SLIDER =====================
let slideIndex = 0;
const slides = document.querySelectorAll(".slides img");
const dots = document.querySelectorAll(".dot");

function showSlide(n) {
    slides.forEach((slide, i) => {
        slide.style.display = i === n ? "block" : "none";
        dots[i].classList.toggle("active", i === n);
    });
}

function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
}

function prevSlide() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
}

// Initialize
if (slides.length > 0) {
    showSlide(slideIndex);
    setInterval(nextSlide, 4000); // auto slide every 4 sec
}

// Dot click
dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
        slideIndex = i;
        showSlide(slideIndex);
    });
});

// ===================== FAQ TOGGLE =====================
const faqCards = document.querySelectorAll(".faq-card");
faqCards.forEach(card => {
    const header = card.querySelector(".faq-header");
    header.addEventListener("click", () => {
        card.classList.toggle("active");
        const toggle = header.querySelector(".faq-toggle");
        toggle.textContent = card.classList.contains("active") ? "-" : "+";
    });
});

// ===================== FACILITIES SLIDER =====================
const facilitySlider = document.querySelector(".facilities-slider");
const slidesFacility = document.querySelectorAll(".facilities-slider .slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
let facilityIndex = 0;

function updateFacilitySlider() {
    const width = slidesFacility[0].clientWidth;
    facilitySlider.style.transform = `translateX(-${facilityIndex * width}px)`;
}

nextBtn.addEventListener("click", () => {
    facilityIndex = (facilityIndex + 1) % slidesFacility.length;
    updateFacilitySlider();
});
prevBtn.addEventListener("click", () => {
    facilityIndex = (facilityIndex - 1 + slidesFacility.length) % slidesFacility.length;
    updateFacilitySlider();
});

// ===================== COURSE FEES MODAL =====================
const ctaBtn = document.querySelector(".cta-btn");
const modal = document.getElementById("fees-modal");
const closeBtn = document.querySelector(".close");
const feesListDiv = document.getElementById("fees-list");

// Fetch fees from JSON
let feesData = [];
fetch("fees1.json") // put your JSON file path here
    .then(res => res.json())
    .then(data => feesData = data)
    .catch(err => console.error("Error loading fees JSON:", err));

// Open modal
ctaBtn.addEventListener("click", () => {
    if (feesData.length > 0) {
        let html = "<ul style='list-style:none; padding:0;'>";
        feesData.forEach(fee => {
            html += `<li style="padding:8px 0;"><strong>${fee.course}:</strong> ${fee.fee}</li>`;
        });
        html += "</ul>";
        feesListDiv.innerHTML = html;
    } else {
        feesListDiv.innerHTML = "<p>No fees data available.</p>";
    }
    modal.style.display = "block";
});

// Close modal
closeBtn.addEventListener("click", () => modal.style.display = "none");

// Close on outside click
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

// ===================== APPLY FORM =====================
const form = document.getElementById("apply-form");
const formMessage = document.getElementById("form-message");

// Replace with your LP1 Pipedream workflow trigger URL
const pipedreamURL = "https://eoqhwqd0ea2ovdj.m.pipedream.net";
 // <-- PUT YOUR WORKFLOW URL HERE

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Simple validation
    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const state = form.state.value;
    const course = form.course.value;
    const intake = form.intake.value;
    const consent = form.consent.checked;

    if (!fullName || !email || !phone || !state || !course || !intake || !consent) {
        formMessage.style.color = "red";
        formMessage.textContent = "Please fill all fields and agree to consent.";
        return;
    }

    // Prepare data to send
    const formData = {
        fullName,
        email,
        phone,
        state,
        course,
        intake,
        consent
    };

    try {
        // POST data to Pipedream
        const response = await fetch(pipedreamURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            formMessage.style.color = "green";
            formMessage.textContent = "Application submitted successfully!";
            form.reset();
        } else {
            formMessage.style.color = "red";
            formMessage.textContent = "Error submitting the application. Please try again.";
        }
    } catch (error) {
        console.error("Error:", error);
        formMessage.style.color = "red";
        formMessage.textContent = "Error submitting the application. Please try again.";
    }
});
