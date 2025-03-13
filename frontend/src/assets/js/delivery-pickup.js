document.addEventListener("DOMContentLoaded", function () {
    function populateDateOptions(selectElement) {
        if (!selectElement) return;

        selectElement.innerHTML = ""; // Eski seçenekleri temizle

        const today = new Date();
        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            return `${day}.${month}`;
        };

        const todayOption = document.createElement("option");
        todayOption.text = `${formatDate(today)} - Today`;
        todayOption.selected = true;

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowOption = document.createElement("option");
        tomorrowOption.text = `${formatDate(tomorrow)} - Tomorrow`;
        tomorrowOption.value = "1";

        selectElement.appendChild(todayOption);
        selectElement.appendChild(tomorrowOption);
    }

    function toggleAddressField() {
        const deliveryRadio = document.getElementById("btnradio2");
        const pickupRadio = document.getElementById("btnradio3");
        const addressField = document.getElementById("addressField");
        const pickupField = document.getElementById("pickupField");
        const deliverySelect = document.getElementById("deliveryDateSelect");
        const pickupSelect = document.getElementById("pickupDateSelect");

        if (deliveryRadio?.checked) {
            addressField?.classList.remove("d-none");
            pickupField?.classList.add("d-none");
            populateDateOptions(deliverySelect);
        } else if (pickupRadio?.checked) {
            addressField?.classList.add("d-none");
            pickupField?.classList.remove("d-none");
            populateDateOptions(pickupSelect);
        }
    }

    // Eğer elementler varsa event listener ekleyelim
    const deliveryRadioBtn = document.getElementById("btnradio2");
    const pickupRadioBtn = document.getElementById("btnradio3");

    if (deliveryRadioBtn) deliveryRadioBtn.addEventListener("change", toggleAddressField);
    if (pickupRadioBtn) pickupRadioBtn.addEventListener("change", toggleAddressField);

    toggleAddressField(); // Sayfa açıldığında başlangıç durumu ayarla
});
