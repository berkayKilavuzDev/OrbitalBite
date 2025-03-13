document.addEventListener('DOMContentLoaded', function () {
    function updateQuantity(itemId, isIncrement) {
        const quantityInput = document.getElementById(`quantity-input-${itemId}`);
        if (!quantityInput) return;

        let currentValue = parseInt(quantityInput.value, 10) || 1;
        quantityInput.value = isIncrement ? currentValue + 1 : Math.max(1, currentValue - 1);

        // Redux state güncellemesi için custom event tetikle
        const updateEvent = new CustomEvent("updateQuantity", {
            detail: { itemId, quantity: quantityInput.value }
        });
        document.dispatchEvent(updateEvent);
    }

    document.querySelectorAll('.decrement-btn').forEach(button => {
        button.addEventListener('click', function () {
            updateQuantity(this.getAttribute('data-item-id'), false);
        });
    });

    document.querySelectorAll('.increment-btn').forEach(button => {
        button.addEventListener('click', function () {
            updateQuantity(this.getAttribute('data-item-id'), true);
        });
    });

    // Enter tuşuna basıldığında da güncelleme yap
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                const itemId = this.getAttribute('data-item-id');
                updateQuantity(itemId, null);
            }
        });
    });

    // Redux güncellemesi için event listener
    document.addEventListener("updateQuantity", function (event) {
        const { itemId, quantity } = event.detail;
        console.log(`Updating quantity for item ${itemId}: ${quantity}`);

        fetch('/update-basket/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: new URLSearchParams({ 'item_id': itemId, 'quantity': quantity })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('basket-items').innerHTML = data.basket_html;
                document.querySelector('.card-footer h5').innerHTML = `Total: £${data.checkout_price.toFixed(2)}`;
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});
