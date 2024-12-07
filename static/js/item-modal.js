document.addEventListener('DOMContentLoaded', function () {

    document.querySelectorAll('#add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function () {
            const itemId = this.getAttribute('data-item-id');
            const modal = document.querySelector(`#add-to-cart-modal-${itemId}`);
            const optionGroups = modal.querySelectorAll('.form-group');
    
            let isValid = true;
            const selectedOptions = [];
    
            optionGroups.forEach(group => {
                const radios = group.querySelectorAll('input[type="radio"]');
                const checkboxes = group.querySelectorAll('input[type="checkbox"]');
                const warning = group.querySelector('.warning-message');
    
                // Handle radio buttons
                if (radios.length > 0) {
                    const name = radios[0].name; // Get the radio group name
                    const checked = modal.querySelector(`input[name="${name}"]:checked`);
    
                    if (!checked) {
                        // Show warning if no radio option is selected
                        if (warning) {
                            warning.classList.remove('d-none');
                            warning.classList.add('d-block');
                        }
                        isValid = false;
                    } else {
                        // Hide warning if a radio option is selected
                        if (warning) {
                            warning.classList.remove('d-block');
                            warning.classList.add('d-none');
                        }
                        selectedOptions.push(checked.value); // Add selected radio option
                    }
                }
    
                // Handle checkboxes
                if (checkboxes.length > 0) {
                    checkboxes.forEach(checkbox => {
                        if (checkbox.checked) {
                            selectedOptions.push(checkbox.value); // Add selected checkbox option
                        }
                    });
                    // No warnings for unselected checkboxes
                }
            });
    
            if (!isValid) {
                console.log('Some options are not selected.');
                return; // Exit if validation fails
            }
    
            const quantityInput = modal.querySelector('.quantity-input');
            const quantity = parseInt(quantityInput.value, 10);
    
            console.log('All options are selected. Proceeding to add to cart.');
            console.log('Selected options:', selectedOptions);
    
            // Send data to backend
            addItemToBasket(itemId, quantity, selectedOptions);
        });
    });

    function updateBasketView(basketHtml, checkoutPrice) {
        // Update the basket container with the new HTML
        const basketContainer = document.querySelector('#basket-container');
        if (basketContainer) {
            basketContainer.innerHTML = basketHtml;
        }
    
        // Update the checkout price
        const checkoutPriceElement = document.querySelector('#checkout-price');
        if (checkoutPriceElement) {
            checkoutPriceElement.textContent = `Total: £${checkoutPrice.toFixed(2)}`;
        }
    }
    
    
    
    function addItemToBasket(itemId, quantity, selectedOptions) {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
        fetch('/add-to-basket/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                item_id: itemId,
                quantity: quantity,
                options: selectedOptions
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Close the modal
                const modalElement = document.querySelector(`#add-to-cart-modal-${itemId}`);
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
    
                // Update the basket in real-time
                updateBasketView(data.basket, data.checkout_price);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
    
    
    function updateBasketView(basketData, checkoutPrice) {
        const basketContainer = document.querySelector('#basket-container');
        if (basketContainer) {
            // Clear existing basket items
            basketContainer.innerHTML = '';
    
            // Render updated basket items
            basketData.forEach(item => {
                const optionsHtml = item.options.map(option => `
                    <div class="row">
                        <div class="col-12 option-name text-muted">
                            ${option}
                        </div>
                    </div>`).join('');
    
                const basketItemHtml = `
                    <li class="list-group-item">
                        <div class="row">
                            <div class="col-10">
                                <span>${item.item_name}</span>
                            </div>
                            <div class="col-2 text-right">
                                <button type="button" class="btn-close" aria-label="Close" data-item-id="${item.id}"></button>
                            </div>
                        </div>
                        ${optionsHtml}
                        <div class="row mt-3">
                            <div class="col-4 col-md-6">
                                <div class="input-group input-group-sm">
                                    <button type="button" class="input-group-text btn btn-outline-secondary btn decrement-btn" data-item-id="${item.id}">
                                        <i class="bi bi-dash"></i>
                                    </button>
                                    <input type="number" name="quantity" style="max-width: 35px;" class="m-0 p-0 form-control form-control-sm text-center quantity-input" value="${item.quantity}" id="quantity-input-${item.id}" min="1">
                                    <button type="button" class="input-group-text btn btn-outline-secondary btn increment-btn" data-item-id="${item.id}">
                                        <i class="bi bi-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-6 d-flex justify-content-end align-items-center">
                                <p class="">£ ${item.total_price.toFixed(2)}</p>
                            </div>
                        </div>
                    </li>`;
                basketContainer.insertAdjacentHTML('beforeend', basketItemHtml);
            });
        }
    
        const checkoutPriceElement = document.querySelector('#checkout-price');
        if (checkoutPriceElement) {
            checkoutPriceElement.textContent = `Total: £${checkoutPrice.toFixed(2)}`;
        }
    }
    
    
    
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
        const selectedOptions = modal.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
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
        const optionInputs = modal.querySelectorAll('input[type="radio"], input[type="checkbox"]');
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
        const optionInputs = modal.querySelectorAll('input[type="radio"], input[type="checkbox"]');
        optionInputs.forEach(input => {
            input.checked = false;
        });

        // Reset dynamic price display
        const dynamicPrice = modal.querySelector('.badge.align-middle');
        if (dynamicPrice) {
            dynamicPrice.textContent = `£ 0.00`; // Or a base price if needed
        }

        const warnings = modal.querySelectorAll('.warning-message');
        warnings.forEach(warning => {
            warning.classList.remove('d-block'); // Hide the warning
            warning.classList.add('d-none');
        });

        // Clear any stored data in the modal
        modal.dataset.itemData = null;
    }
});
