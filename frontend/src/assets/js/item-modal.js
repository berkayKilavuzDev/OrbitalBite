document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function () {
            const itemId = this.getAttribute('data-item-id');
            const modal = document.querySelector(`#add-to-cart-modal-${itemId}`);

            if (!modal) return;

            const optionGroups = modal.querySelectorAll('.form-group');
            let isValid = true;
            const selectedOptions = [];

            optionGroups.forEach(group => {
                const radios = group.querySelectorAll('input[type="radio"]');
                const checkboxes = group.querySelectorAll('input[type="checkbox"]');
                const warning = group.querySelector('.warning-message');

                if (radios.length > 0) {
                    const checked = modal.querySelector(`input[name="${radios[0].name}"]:checked`);
                    if (!checked) {
                        warning?.classList.remove('d-none');
                        isValid = false;
                    } else {
                        warning?.classList.add('d-none');
                        selectedOptions.push(checked.value);
                    }
                }

                if (checkboxes.length > 0) {
                    checkboxes.forEach(checkbox => {
                        if (checkbox.checked) selectedOptions.push(checkbox.value);
                    });
                }
            });

            if (!isValid) return;

            const quantity = parseInt(modal.querySelector('.quantity-input').value, 10);
            addItemToBasket(itemId, quantity, selectedOptions);
        });
    });

    function updateBasketView(basketData, checkoutPrice) {
        const basketContainer = document.querySelector('#basket-container');
        if (basketContainer) {
            basketContainer.innerHTML = basketData.map(item => `
                <li class="list-group-item">
                    <div class="row">
                        <div class="col-10">${item.item_name}</div>
                        <div class="col-2 text-right">
                            <button type="button" class="btn-close delete-btn" data-item-id="${item.id}"></button>
                        </div>
                    </div>
                    ${item.options.map(option => `<div class="row"><div class="col-12 option-name text-muted">${option}</div></div>`).join('')}
                    <div class="row mt-3">
                        <div class="col-4">
                            <div class="input-group input-group-sm">
                                <button class="input-group-text btn decrement-btn" data-item-id="${item.id}">-</button>
                                <input type="number" class="form-control form-control-sm text-center quantity-input" value="${item.quantity}" min="1" id="quantity-input-${item.id}">
                                <button class="input-group-text btn increment-btn" data-item-id="${item.id}">+</button>
                            </div>
                        </div>
                        <div class="col-6 text-right">
                            <p>£ ${item.total_price.toFixed(2)}</p>
                        </div>
                    </div>
                </li>`).join('');
        }

        document.querySelector('#checkout-price')?.textContent = `Total: £${checkoutPrice.toFixed(2)}`;
    }

    function addItemToBasket(itemId, quantity, selectedOptions) {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch('/add-to-basket/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
            body: JSON.stringify({ item_id: itemId, quantity, options: selectedOptions })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                bootstrap.Modal.getInstance(document.querySelector(`#add-to-cart-modal-${itemId}`))?.hide();
                updateBasketView(data.basket, data.checkout_price);
            } else {
                alert(data.message);
            }
        })
        .catch(console.error);
    }

    function fetchItemDetails(modal) {
        const itemId = modal.querySelector('.quantity-input').id.split('-')[2];
        fetch(`/api/item-details/${itemId}/`)
            .then(response => response.json())
            .then(data => {
                modal.dataset.itemData = JSON.stringify(data);
                updateDynamicPrice(modal, data);
            })
            .catch(console.error);
    }

    function updateDynamicPrice(modal, itemData) {
        const quantity = parseInt(modal.querySelector('.quantity-input').value, 10) || 1;
        let basePrice = itemData.price * quantity;

        modal.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked')
            .forEach(option => basePrice += parseFloat(option.dataset.price || 0) * quantity);

        modal.querySelector(`#dynamic-price-${itemData.id}`).textContent = `£ ${basePrice.toFixed(2)}`;
        modal.querySelector(`#dynamic-quantity-${itemData.id}`).textContent = quantity;
    }

    function handleQuantityChange(button, isIncrement, modal) {
        const itemId = button.getAttribute('data-item-id');
        const quantityInput = document.getElementById(`quantity-input-${itemId}`);
        let currentValue = parseInt(quantityInput.value, 10) || 1;
        quantityInput.value = isIncrement ? currentValue + 1 : Math.max(currentValue - 1, 1);
        updateDynamicPrice(modal, JSON.parse(modal.dataset.itemData));
    }

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('show.bs.modal', () => fetchItemDetails(modal));
        modal.addEventListener('hidden.bs.modal', () => resetModal(modal));

        modal.querySelectorAll('.decrement-btn').forEach(button =>
            button.addEventListener('click', () => handleQuantityChange(button, false, modal)));

        modal.querySelectorAll('.increment-btn').forEach(button =>
            button.addEventListener('click', () => handleQuantityChange(button, true, modal)));

        modal.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input =>
            input.addEventListener('change', () => updateDynamicPrice(modal, JSON.parse(modal.dataset.itemData))));
    });

    function resetModal(modal) {
        modal.querySelector('.quantity-input').value = 1;
        modal.querySelector('.dynamic-quantity').textContent = 1;
        modal.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => input.checked = false);
        modal.querySelector('.badge.align-middle').textContent = `£ 0.00`;
        modal.querySelectorAll('.warning-message').forEach(warning => warning.classList.add('d-none'));
        modal.dataset.itemData = null;
    }
});
