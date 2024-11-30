document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch item details from the API and initialize the modal
    function fetchItemDetails(modal) {
        const itemId = modal.querySelector('.quantity-input').id.split('-')[2]; // Extract item ID
        const apiUrl = `/api/item-details/${itemId}/`; // API path

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Store the item data in the modal for price calculations
                modal.dataset.itemData = JSON.stringify(data);

                // Initialize the price
                updateDynamicPrice(modal, data);
            })
            .catch(error => console.error('Error fetching item details:', error));
    }

    // Function to update the dynamic price
    function updateDynamicPrice(modal, itemData) {
        const quantityInput = modal.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value, 10) || 1;

        let basePrice = itemData.price * quantity;

        // Calculate additional cost from selected options
        const selectedOptions = modal.querySelectorAll('input[type="radio"]:checked');
        selectedOptions.forEach(option => {
            const optionPrice = parseFloat(option.dataset.price || 0);
            basePrice += optionPrice * quantity;
        });

        // Update the dynamic price element
        const dynamicPriceElement = modal.querySelector(`#dynamic-price-${itemData.id}`);
        dynamicPriceElement.textContent = `£ ${basePrice.toFixed(2)}`;

        // Update the dynamic quantity display
        const dynamicQuantityElement = modal.querySelector(`#dynamic-quantity-${itemData.id}`);
        dynamicQuantityElement.textContent = quantity;
    }

    // Function to handle quantity changes
    function handleQuantityChange(button, isIncrement, modal) {
        const itemId = button.getAttribute('data-item-id');
        const quantityInput = document.getElementById(`quantity-input-${itemId}`);
        let currentValue = parseInt(quantityInput.value, 10) || 1;

        // Increment or decrement the quantity
        if (isIncrement) {
            quantityInput.value = currentValue + 1;
        } else if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }

        // Fetch the stored item data and recalculate the price
        const itemData = JSON.parse(modal.dataset.itemData);
        updateDynamicPrice(modal, itemData);
    }

    // Event listeners for modals
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        // When the modal is shown, fetch item details
        modal.addEventListener('show.bs.modal', function () {
            fetchItemDetails(modal);
        });

        modal.addEventListener('hidden.bs.modal', function () {
            resetModal(modal);
        });

        // Attach event listeners to increment and decrement buttons
        modal.querySelectorAll('.decrement-btn').forEach(button => {
            button.addEventListener('click', function () {
                handleQuantityChange(button, false, modal);
            });
        });

        modal.querySelectorAll('.increment-btn').forEach(button => {
            button.addEventListener('click', function () {
                handleQuantityChange(button, true, modal);
            });
        });

        // Listen for option selection changes
        const optionInputs = modal.querySelectorAll('input[type="radio"]');
        optionInputs.forEach(input => {
            input.addEventListener('change', function () {
                const itemData = JSON.parse(modal.dataset.itemData);
                updateDynamicPrice(modal, itemData);
            });
        });
    });

    function resetModal(modal) {
        // Reset quantity input to 1
        const quantityInput = modal.querySelector('.quantity-input');
        if (quantityInput) {
            quantityInput.value = 1;
        }

        // Reset dynamic quantity display
        const dynamicQuantity = modal.querySelector('.dynamic-quantity');
        if (dynamicQuantity) {
            dynamicQuantity.textContent = 1;
        }

        // Reset options (uncheck all radio buttons)
        const optionInputs = modal.querySelectorAll('input[type="radio"]');
        optionInputs.forEach(input => {
            input.checked = false;
        });

        // Reset dynamic price display
        const dynamicPrice = modal.querySelector('.badge.align-middle');
        if (dynamicPrice) {
            dynamicPrice.textContent = `£ 0.00`; // Or a base price if needed
        }

        // Clear any stored data in the modal
        modal.dataset.itemData = null;
    }
});
