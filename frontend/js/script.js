// Cart Array to Store Items
let cart = [];

// Add Event Listeners to Each Button
document.querySelectorAll('.product button').forEach((button) => {
    button.addEventListener('click', () => {
        const productName = button.parentElement.querySelector('h3').textContent;
        const productPrice = parseFloat(button.parentElement.querySelector('p').textContent.replace('$', ''));
        const existingItem = cart.find((item) => item.name === productName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }

        alert(`${productName} has been added to your cart.`);
        console.log('Cart:', cart);
    });
});

// Show Cart Section
const viewCartButton = document.getElementById('view-cart');
const cartSection = document.getElementById('cart');
const cartItemsTable = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');

viewCartButton.addEventListener('click', () => {
    cartSection.style.display = 'block';
    renderCart();
});

// Render Cart Items
function renderCart() {
    cartItemsTable.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        const totalItemPrice = (item.price * item.quantity).toFixed(2);

        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button class="quantity-decrease">-</button>
                ${item.quantity}
                <button class="quantity-increase">+</button>
            </td>
            <td>$${totalItemPrice}</td>
            <td><span class="cart-remove" data-index="${index}">Remove</span></td>
        `;

        cartItemsTable.appendChild(row);
        totalPrice += parseFloat(totalItemPrice);
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);

    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.quantity-increase').forEach((button, index) => {
        button.addEventListener('click', () => {
            cart[index].quantity++;
            renderCart();
        });
    });

    document.querySelectorAll('.quantity-decrease').forEach((button, index) => {
        button.addEventListener('click', () => {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            renderCart();
        });
    });

    document.querySelectorAll('.cart-remove').forEach((button) => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            cart.splice(index, 1);
            renderCart();
        });
    });
}

// Place Order
document.getElementById('place-order').addEventListener('click', () => {
    const phoneNumber = document.getElementById('phone-number').value.trim();

    // Validate phone number
    if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    fetch('https://bejewelled-blini-ca4f49.netlify.app/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            orders: cart,
            phoneNumber,
            timestamp: new Date().toISOString()
        })
    })
    .then(response => response.json())
    .then((data) => {
        alert('Order placed successfully!');
        console.log('Order response:', data);
        cart = [];
        document.getElementById('phone-number').value = ''; // Clear phone number field
        renderCart();
    })
    .catch((error) => {
        console.error('Failed to place order:', error);
        alert('Failed to place the order.');
    });
});
