
$(document).ready(function(){
    $('.add-to-cart-btn').click(function(){
        var itemId = $(this).data('item-id');
        var quantity = $('#quantity-input-' + itemId).val();
        
        console.log('Add to Cart button clicked'); // Debugging statement
        console.log('Item ID:', itemId); // Debugging statement
        console.log('Quantity:', quantity); // Debugging statement

        // Perform AJAX request
        $.ajax({
            url: '/add-to-basket/', // URL to send the request to
            type: 'POST', // HTTP method
            data: {
                'csrfmiddlewaretoken': '{{ csrf_token }}', // CSRF token for security
                'item_id': itemId, // Item ID
                'quantity': quantity // Quantity
            },
            success: function(response) {
                // Optionally handle the response from the server
                console.log('Response:', response); // Debugging statement
                alert(response.message);
            },
            error: function(xhr, status, error) {
                // Handle errors
                console.log('Error:', xhr.responseText); // Debugging statement
                alert('Error adding item to basket!');
            }
        });
    });
});

