// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the appointment form page
    if (document.getElementById('appointment-form')) {
        setupAppointmentForm();
    }
    
    // Check if we're on the patient details page
    if (document.getElementById('patient-details')) {
        displayPatientDetails();
        setupDetailPageButtons();
    }
    
    // Check if BMI calculator exists on page
    if (document.getElementById('calculate-bmi')) {
        setupBMICalculator();
    }
});

function setupBMICalculator() {
    const calculateBtn = document.getElementById('calculate-bmi');
    calculateBtn.addEventListener('click', calculateBMI);
}

function calculateBMI() {
    // Get input values
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const height = parseFloat(heightInput.value) / 100; // Convert cm to m
    const weight = parseFloat(weightInput.value);
    
    // Validate inputs
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight values');
        return;
    }
    
    // Calculate BMI
    const bmi = weight / (height * height);
    const roundedBMI = bmi.toFixed(1);
    
    // Determine category
    let category = '';
    let className = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        className = 'underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal weight';
        className = 'normal';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        className = 'overweight';
    } else {
        category = 'Obese';
        className = 'obese';
    }
    
    // Display result
    const resultElement = document.getElementById('bmi-result');
    resultElement.innerHTML = `
        Your BMI is <strong>${roundedBMI}</strong><br>
        Category: <strong>${category}</strong>
    `;
    resultElement.className = className;
    resultElement.style.display = 'block';
}

function setupAppointmentForm() {
    const appointmentForm = document.getElementById('appointment-form');
    appointmentForm.addEventListener('submit', handleAppointmentSubmit);
}

function handleAppointmentSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        preferredDate: document.getElementById('preferred-date').value,
        reason: document.getElementById('reason').value,
        submittedAt: new Date().toISOString()
    };
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.phone || !formData.dob || !formData.preferredDate) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Store the form data in localStorage
    localStorage.setItem('patientAppointmentData', JSON.stringify(formData));
    
    // Redirect to the patient details page
    window.location.href = 'patient-details.html';
}

function displayPatientDetails() {
    const detailsContainer = document.getElementById('details-container');
    const storedData = localStorage.getItem('patientAppointmentData');
    
    if (!storedData) {
        detailsContainer.innerHTML = '<p>No appointment data found. Please submit an appointment form first.</p>';
        return;
    }
    
    const formData = JSON.parse(storedData);
    
    // Format the date for display
    const preferredDate = new Date(formData.preferredDate);
    const formattedDate = preferredDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedTime = preferredDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Create the details HTML
    detailsContainer.innerHTML = `
        <div class="detail-row">
            <div class="detail-label">Patient Name:</div>
            <div class="detail-value">${formData.name}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Email:</div>
            <div class="detail-value">${formData.email}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Phone:</div>
            <div class="detail-value">${formData.phone}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Date of Birth:</div>
            <div class="detail-value">${new Date(formData.dob).toLocaleDateString()}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Appointment Date:</div>
            <div class="detail-value">${formattedDate} at ${formattedTime}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Reason for Visit:</div>
            <div class="detail-value">${formData.reason || 'Not specified'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">Confirmation Number:</div>
            <div class="detail-value">HL-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</div>
        </div>
    `;
}

function setupDetailPageButtons() {
    // Print button functionality
    document.getElementById('print-btn').addEventListener('click', function() {
        window.print();
    });
    
    // New appointment button functionality
    document.getElementById('new-appointment-btn').addEventListener('click', function() {
        window.location.href = 'index.html#appointment';
    });
}