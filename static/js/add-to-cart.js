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

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            console.log('Item ID:', itemId);

            const hasOption = this.getAttribute('data-option-status');
            console.log('hasOption:', hasOption);

            if (hasOption === 'True') {
                console.log('Item has options, not adding to cart directly.');
                $('#exampleModal').modal('show');
                return;
            }            

            const quantityInput = document.getElementById(`quantity-input-${itemId}`);
            const quantity = parseInt(quantityInput.value);
            console.log('Current quantity:', quantity);
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            fetch('/add-to-basket/', {
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

    function updateBasket(basketHTML, checkoutPrice) {
        document.getElementById('basket-items').innerHTML = basketHTML;
        const checkoutPriceElement = document.querySelector('.card-footer h5');
        checkoutPriceElement.innerHTML = `Total: <br>£ ${checkoutPrice.toFixed(2)}`;
        // Reattach event listeners for new basket elements
        addBasketEventListeners();
    }
});
