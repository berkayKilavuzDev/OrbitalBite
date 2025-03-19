document.addEventListener("DOMContentLoaded", function () {
    const checkoutForm = document.getElementById("checkout-form");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Sayfanın yenilenmesini önle

            const address = document.getElementById("address").value.trim();
            const deliveryDate = document.getElementById("delivery_date").value;
            const deliveryTime = document.getElementById("delivery_time").value;
            const orderInstructions = document.getElementById("order_instructions").value.trim();
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            if (!address || !deliveryDate || !deliveryTime) {
                alert("Please fill in all required fields.");
                return;
            }

            fetch("/create-order/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify({
                    address,
                    delivery_date: deliveryDate,
                    delivery_time: deliveryTime,
                    instructions: orderInstructions
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    alert("Order placed successfully!");
                    window.location.href = "/order-history/"; // Sipariş geçmişine yönlendir
                } else {
                    alert(`Error: ${data.message}`);
                }
            })
            .catch(error => console.error("Error:", error));
        });
    }
});
