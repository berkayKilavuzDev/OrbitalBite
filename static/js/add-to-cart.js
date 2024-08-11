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

            if (hasOption) {
                fetch(`/get-options/${itemId}/`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        const optionsContainer = document.getElementById('options-container');
                        optionsContainer.innerHTML = ''; // Clear existing options
                        data.options.forEach(option => {
                            const optionElement = document.createElement('div');
                            optionElement.classList.add('form-check');
                            optionElement.innerHTML = `
                                <input class="form-check-input" type="checkbox" value="${option.id}" id="option-${option.id}">
                                <label class="form-check-label" for="option-${option.id}">
                                    ${option.option_name} (£${option.price})
                                </label>
                            `;
                            optionsContainer.appendChild(optionElement);
                        });
                        $('#exampleModal').modal('show');
                    } else {
                        alert('Error fetching options!');
                    }
                })
                .catch(error => console.error('Error:', error));
            } else {
                const selectedOptions = [];
                addItemToCart(itemId, 1, selectedOptions);
            }
        });
    });

    document.getElementById('save-options-btn').addEventListener('click', function() {
        const itemId = document.querySelector('.add-to-cart-btn').getAttribute('data-item-id');
        const selectedOptions = [];
        document.querySelectorAll('#options-container input[type="checkbox"]:checked').forEach(checkbox => {
            selectedOptions.push(checkbox.value);
        });
        addItemToCart(itemId, 1, selectedOptions);
        $('#exampleModal').modal('hide');
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