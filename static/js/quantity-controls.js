
/*document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.decrement-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            console.log('Decrement clicked for item ID:', itemId); // Debugging statement
            const quantityInput = document.getElementById(`quantity-input-${itemId}`);
            console.log('Quantity input:', quantityInput); // Debugging statement
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
    });

    document.querySelectorAll('.increment-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            console.log('Increment clicked for item ID:', itemId); // Debugging statement
            const quantityInput = document.getElementById(`quantity-input-${itemId}`);
            console.log('Quantity input:', quantityInput); // Debugging statement
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    });
});
*/
