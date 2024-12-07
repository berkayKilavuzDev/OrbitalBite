document.addEventListener('DOMContentLoaded', function () {
    // Event delegation to capture clicks on "Add to Cart" buttons within modals
    document.addEventListener('click', function (e) {
        // Check if the clicked element is the "Add to Cart" button
        if (e.target.id === 'add-to-cart-btn') {
            console.log("Add to Cart button clicked");

            const button = e.target;
            const itemId = button.getAttribute('data-item-id');  // Get item ID
            const modal = button.closest('.modal');  // Get the modal containing the button
            const quantity = modal.querySelector('.quantity-input').value;  // Get quantity input value

            console.log("Item ID:", itemId);
            console.log("Quantity:", quantity);

            // Collect selected options
            const selectedOptions = Array.from(modal.querySelectorAll('input[type="radio"]:checked'))
                .map(option => option.value);  // Get IDs of selected options

            console.log("Selected Options:", selectedOptions);

            // Prepare the data to send to the backend
            const data = {
                item_id: itemId,
                quantity: parseInt(quantity, 10),
                selected_options: selectedOptions,
            };

            // Send the data to the backend
            fetch('/cart/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);  // Success message
                } else {
                    alert(`Error: ${data.error}`);  // Error message
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });
});
