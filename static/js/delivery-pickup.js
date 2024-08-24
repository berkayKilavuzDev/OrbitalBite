function populateDateOptions(selectElement) {
    // Clear any existing options
    selectElement.innerHTML = '';

    // Get today's date
    const today = new Date();

    // Format the date as DD.MM
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}.${month}`;
    };

    // Create options dynamically
    const todayOption = document.createElement("option");
    todayOption.text = `${formatDate(today)} - Today`;
    todayOption.selected = true;

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowOption = document.createElement("option");
    tomorrowOption.text = `${formatDate(tomorrow)} - Tomorrow`;
    tomorrowOption.value = "1";

    // Append options to the select element
    selectElement.appendChild(todayOption);
    selectElement.appendChild(tomorrowOption);
}

// Function to toggle the visibility for delivery or pick-up
function toggleAddressField() {
    var deliveryRadio = document.getElementById('btnradio2');
    var pickupRadio = document.getElementById('btnradio3');
    var addressField = document.getElementById('addressField');
    var pickupField = document.getElementById('pickupField');

    if (deliveryRadio.checked) {
        addressField.classList.remove('d-none');
        pickupField.classList.add('d-none');
        populateDateOptions(document.getElementById('deliveryDateSelect'));
    } else if (pickupRadio.checked) {
        addressField.classList.add('d-none');
        pickupField.classList.remove('d-none');
        populateDateOptions(document.getElementById('pickupDateSelect'));
    }
}

// Attach the function to the radio buttons
document.getElementById('btnradio2').addEventListener('change', toggleAddressField);
document.getElementById('btnradio3').addEventListener('change', toggleAddressField);

// Initialize the fields on page load
toggleAddressField();
