document.addEventListener('DOMContentLoaded', function() {
    // Function to add event listeners for increment, decrement buttons, and delete buttons in the basket
    function addBasketEventListeners() {
        document.querySelectorAll('.increment-btn-basket').forEach(button => {
            button.addEventListener('click', function() {
                console.log('Clicked');
                const itemId = this.getAttribute('data-item-id');
                console.log('Item ID:', itemId);
                const quantityInput = document.getElementById(`quantity-input-${itemId}`);
                let quantity = parseInt(quantityInput.value);
                quantity = quantity + 1;
                console.log('Current quantity:', quantity);
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

                fetch('/update-basket/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': csrfToken
                    },
                    body: new URLSearchParams({
                        'item_id': itemId,
                        'quantity': quantity
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        updateBasket(data.basket_html, data.checkout_price);
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        });

        document.querySelectorAll('.decrement-btn-basket').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                const quantityInput = document.getElementById(`quantity-input-${itemId}`);
                let currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

                    fetch('/update-basket/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-CSRFToken': csrfToken
                        },
                        body: new URLSearchParams({
                            'item_id': itemId,
                            'quantity': currentValue - 1
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            updateBasket(data.basket_html, data.checkout_price);
                        } else {
                            alert(data.message);
                        }
                    })
                    .catch(error => console.error('Error:', error));
                }
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    const itemId = this.getAttribute('data-item-id');
                    let quantity = parseInt(this.value);
                    if (quantity < 1) {
                        quantity = 1; // Ensure quantity is at least 1
                        this.value = quantity;
                    }
                    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

                    fetch('/update-basket/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'X-CSRFToken': csrfToken
                        },
                        body: new URLSearchParams({
                            'item_id': itemId,
                            'quantity': quantity
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            updateBasket(data.basket_html, data.checkout_price);
                        } else {
                            alert(data.message);
                        }
                    })
                    .catch(error => console.error('Error:', error));
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

                fetch('/delete-from-basket/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRFToken': csrfToken
                    },
                    body: new URLSearchParams({
                        'item_id': itemId
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        updateBasket(data.basket_html, data.checkout_price);
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error:', error));
            });
        });
    }

    // Initial setup
    addBasketEventListeners();

    document.querySelectorAll('.decrement-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            const quantityInput = document.getElementById(`quantity-input-${itemId}`);
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    });

    document.querySelectorAll('.increment-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            const quantityInput = document.getElementById(`quantity-input-${itemId}`);
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    });

    function updateBasket(basketHTML, checkoutPrice) {
        document.getElementById('basket-items').innerHTML = basketHTML;
        const checkoutPriceElement = document.querySelector('.card-footer h5');
        checkoutPriceElement.innerHTML = `Total: <br>£ ${checkoutPrice.toFixed(2)}`;
        addBasketEventListeners();  // Reattach event listeners for new basket elements
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            const hasOption = this.getAttribute('data-option-status') === 'True';
            const itemName = this.getAttribute('data-item-name');

            console.log('data-item-id:', itemId);

            const quantityInput = document.getElementById(`quantity-input-${itemId}`);
            const quantity = parseInt(quantityInput.value);
            console.log('Current quantity:', quantity);

            if (hasOption) {
                fetch(`/get-options/${itemId}/`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const optionsContainer = document.getElementById('options-container');
                        optionsContainer.innerHTML = ''; // Clear existing options

                        data.options.forEach(option => {
                            const optionGroupElement = document.createElement('div');
                            optionGroupElement.classList.add('option-group');
                            optionGroupElement.innerHTML = `<strong>${option.option_name}:</strong>`;
                            
                            option.details.forEach(detail => {
                                const optionDetailElement = document.createElement('div');
                                optionDetailElement.classList.add('form-check');
                                
                                const priceText = detail.price ? ` (£${detail.price})` : ''; // Only show price if it exists
                                
                                optionDetailElement.innerHTML = `
                                    <input class="form-check-input" type="radio" name="option-${option.id}" value="${detail.id}" id="optionDetail-${detail.id}">
                                    <label class="form-check-label" for="optionDetail-${detail.id}">
                                        ${detail.optionDetail_name}${priceText}
                                    </label>
                                `;
                                
                                optionGroupElement.appendChild(optionDetailElement);
                            });
                            

                            optionsContainer.appendChild(optionGroupElement);
                        });

                        document.getElementById('exampleModalLabel').textContent = itemName;

                        const modal = document.getElementById('exampleModal');
                        modal.setAttribute('data-item-id', itemId);

                        $('#exampleModal').modal('show');
                    } else {
                        alert('Error fetching options!');
                    }
                })
                .catch(error => console.error('Error:', error));
            } else {
                const selectedOptions = [];
                addItemToCart(itemId, quantity, selectedOptions);
            }
        });
    });

    document.getElementById('save-options-btn').addEventListener('click', function() {
        //const itemId = document.querySelector('.add-to-cart-btn').getAttribute('data-item-id');

        const modal = document.getElementById('exampleModal');
        const itemId = modal.getAttribute('data-item-id');

        const quantityInput = document.getElementById(`quantity-input-${itemId}`);
        const quantity = parseInt(quantityInput.value);
        const selectedOptions = [];
        document.querySelectorAll('#options-container input[type="radio"]:checked').forEach(radio => {
            selectedOptions.push(radio.value);
        });

        console.log(selectedOptions);

        //const requiredOptions = document.querySelectorAll('#options-container input[type="radio"]:required');
        const optionGroups = document.querySelectorAll('.option-group');
        console.log(optionGroups);

        if (selectedOptions.length === optionGroups.length) {
            // Hide the warning message if any option is selected
            document.getElementById('option-warning').style.display = 'none';
            addItemToCart(itemId, quantity, selectedOptions);
            $('#exampleModal').modal('hide');
        } else {
            // Show the warning message if no options are selected
            document.getElementById('option-warning').style.display = 'block';
        }
    });

    function addItemToCart(itemId, quantity, options) {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch('/add-to-basket/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrfToken
            },
            body: new URLSearchParams({
                'item_id': itemId,
                'quantity': quantity,
                'options': options
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                updateBasket(data.basket_html, data.checkout_price);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }
});