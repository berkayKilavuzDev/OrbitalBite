document.addEventListener('DOMContentLoaded', function() {
    const postcodeInput = document.getElementById('postcode');
    const suggestionsBox = document.getElementById('suggestions');

    postcodeInput.addEventListener('input', function() {
        const query = this.value.trim();

        if (query.length >= 2) {  
            fetch(`/postcode-suggestions/?postcode=${query}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(data => {
                suggestionsBox.innerHTML = '';  
                if (data.length) {
                    data.forEach(item => {
                        let option = document.createElement('div');
                        option.className = 'suggestion-item';
                        option.innerHTML = `<strong>${item.postcode}</strong> - ${item.admin_district}, ${item.region}, ${item.country}`;
                        option.onclick = () => {
                            postcodeInput.value = item.postcode;
                            suggestionsBox.innerHTML = '';  
                        };
                        suggestionsBox.appendChild(option);
                    });
                } else {
                    suggestionsBox.innerHTML = '<div class="suggestion-item">No suggestions found</div>';
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            suggestionsBox.innerHTML = '';  
        }
    });

    /** 🛒 SEPET EVENT LİSTENERLARI */
    function addBasketEventListeners() {
        document.querySelectorAll('.increment-btn-basket').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                const quantityInput = document.getElementById(`quantity-input-${itemId}`);
                let quantity = parseInt(quantityInput.value) + 1;
                updateBasketItem(itemId, quantity);
            });
        });

        document.querySelectorAll('.decrement-btn-basket').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                const quantityInput = document.getElementById(`quantity-input-${itemId}`);
                let quantity = Math.max(parseInt(quantityInput.value) - 1, 1);
                updateBasketItem(itemId, quantity);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                removeBasketItem(itemId);
            });
        });
    }

    /** 🔄 SEPET GÜNCELLEME */
    function updateBasketItem(itemId, quantity) {
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
                updateBasket(data.basket_html, data.checkout_price);
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function removeBasketItem(itemId) {
        fetch('/delete-from-basket/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: new URLSearchParams({ 'item_id': itemId })
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

    function updateBasket(basketHTML, checkoutPrice) {
        document.getElementById('basket-items').innerHTML = basketHTML;
        document.querySelector('.card-footer h5').innerHTML = `Total: <br>£ ${checkoutPrice.toFixed(2)}`;
        addBasketEventListeners();
    }

    /** 📌 MODAL (POPUP) ÜZERİNDEN SEPETE ÜRÜN EKLEME **/
    document.addEventListener('click', function(e) {
        if (e.target.id === 'add-to-cart-btn') {
            console.log("Popup 'Add to Cart' Clicked");

            const button = e.target;
            const itemId = button.getAttribute('data-item-id');
            const modal = button.closest('.modal');
            const quantity = modal.querySelector('.quantity-input').value;
            
            console.log("Item ID:", itemId);
            console.log("Quantity:", quantity);

            // Seçilen opsiyonları al
            const selectedOptions = Array.from(modal.querySelectorAll('input[type="radio"]:checked'))
                .map(option => option.value);

            console.log("Selected Options:", selectedOptions);

            // Backend'e veri gönder
            fetch('/add-to-basket/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({
                    item_id: itemId,
                    quantity: parseInt(quantity, 10),
                    options: selectedOptions
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

    /** ✅ MODAL KAYDET BUTONU EVENT LİSTENERI */
    document.getElementById('save-options-btn').addEventListener('click', function() {
        const modal = document.getElementById('exampleModal');
        const itemId = modal.getAttribute('data-item-id');
        const quantity = document.getElementById(`quantity-input-${itemId}`).value;
        const selectedOptions = Array.from(document.querySelectorAll('#options-container input[type="radio"]:checked'))
            .map(radio => radio.value);

        console.log(selectedOptions);

        const optionGroups = document.querySelectorAll('.option-group');

        if (selectedOptions.length === optionGroups.length) {
            document.getElementById('option-warning').style.display = 'none';
            addItemToCart(itemId, quantity, selectedOptions);
            $('#exampleModal').modal('hide');
        } else {
            document.getElementById('option-warning').style.display = 'block';
        }
    });

    /** 🛒 SEPETE ÜRÜN EKLEME */
    function addItemToCart(itemId, quantity, options) {
        fetch('/add-to-basket/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
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