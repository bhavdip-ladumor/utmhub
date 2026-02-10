/* --- UTTAM HUB GLOBAL CART SYSTEM (cart.js) --- */

// 1. Initialize and Inject HTML UI with Animation Styles
document.addEventListener('DOMContentLoaded', () => {
    const cartHTML = `
        <style>
            /* Shake Animation for the Icon */
            @keyframes cartShake {
                0% { transform: scale(1); }
                25% { transform: scale(1.2) rotate(15deg); }
                50% { transform: scale(1.4) rotate(-15deg); }
                75% { transform: scale(1.2) rotate(10deg); }
                100% { transform: scale(1); }
            }
            .shake-animation { animation: cartShake 0.5s ease-in-out; }

            /* Pulse effect for the number bubble */
            @keyframes countPop {
                0% { transform: scale(1); }
                50% { transform: scale(2.5); }
                100% { transform: scale(1); }


                
            }
            .pop-animation { animation: countPop 0.4s ease-in-out; }
        </style>

        <div id="cart-icon" onclick="toggleCart()" style="position:fixed; bottom:20px; right:20px; background:#0984e3; color:white; width:55px; height:55px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; z-index:3000; box-shadow:0 4px 10px rgba(0,0,0,0.3); transition: 0.3s;">
            <i class="fas fa-shopping-basket"></i>
            <span id="cart-count" style="position:absolute; top:0; right:0; background:red; color:white; border-radius:50%; padding:2px 6px; font-size:11px; border: 2px solid white;">0</span>
        </div>

        <div id="cart-sidebar" style="position:fixed; top:0; right:-400px; width:340px; height:100%; background:white; z-index:3001; transition:0.4s; box-shadow:-5px 0 15px rgba(0,0,0,0.2); padding:20px; display:flex; flex-direction:column; font-family: 'Segoe UI', sans-serif;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:10px;">
                <h3 style="margin:0; color:#2d3436;">Global Selection</h3>
                <i class="fas fa-times" onclick="toggleCart()" style="cursor:pointer; color:#999;"></i>
            </div>
            <div id="cart-items" style="flex-grow:1; overflow-y:auto; margin-top:15px;"></div>
            <button onclick="checkoutWhatsApp()" style="width:100%; background:#25D366; color:white; border:none; padding:15px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:1rem;">
                <i class="fab fa-whatsapp"></i> Order via WhatsApp
            </button>
            <button onclick="clearCart()" style="width:100%; background:none; border:none; color:#ff7675; margin-top:10px; cursor:pointer; font-size:12px;">Clear All Selections</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cartHTML);
    updateCartUI();
});

// 2. Load Cart from LocalStorage
let cart = JSON.parse(localStorage.getItem('uttamHubCart')) || [];

// 3. Helper for Animation Trigger
function triggerFeedback() {
    const icon = document.getElementById('cart-icon');
    const count = document.getElementById('cart-count');
    
    // Apply animations
    icon.classList.add('shake-animation');
    count.classList.add('pop-animation');
    
    // Remove classes after animation finishes so it can repeat
    setTimeout(() => {
        icon.classList.remove('shake-animation');
        count.classList.remove('pop-animation');
    }, 500);
}

// 4. Smart Add to Cart (NO Auto-Open + Animation)
function addToCart(brand, productName) {
    const existingItem = cart.find(item => item.name === productName && item.brand === brand);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ brand, name: productName, qty: 1 });
    }
    
    saveCart();
    triggerFeedback(); // Visual feedback instead of opening sidebar
}

// 5. Quantity Controls
function updateQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
}

function clearCart() {
    if(confirm("Clear your whole selection?")) {
        cart = [];
        saveCart();
    }
}

function saveCart() {
    localStorage.setItem('uttamHubCart', JSON.stringify(cart));
    updateCartUI();
}

// 6. Update UI
function updateCartUI() {
    const list = document.getElementById('cart-items');
    const countLabel = document.getElementById('cart-count');
    
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countLabel) countLabel.innerText = totalItems;
    
    if (!list) return;

    list.innerHTML = '';
    if (cart.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding:20px; color:#999;">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            list.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #eee;">
                    <div style="text-align:left; flex-grow: 1;">
                        <small style="color:#0984e3; font-size:10px; font-weight:bold; text-transform:uppercase;">${item.brand}</small>
                        <div style="font-size:13px; font-weight:bold; color:#2d3436;">${item.name}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px; background:#f8f9fa; padding:5px 10px; border-radius:20px;">
                        <button onclick="updateQty(${index}, -1)" style="border:none; background:none; cursor:pointer; color:#ff7675; font-weight:bold;">-</button>
                        <span style="font-size:13px; font-weight:bold; min-width:15px; text-align:center;">${item.qty}</span>
                        <button onclick="updateQty(${index}, 1)" style="border:none; background:none; cursor:pointer; color:#0984e3; font-weight:bold;">+</button>
                    </div>
                </div>`;
        });
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    if (sidebar) {
        sidebar.style.right = (sidebar.style.right === '0px') ? '-400px' : '0px';
    }
}

// 7. WhatsApp Checkout
function checkoutWhatsApp() {
    if (cart.length === 0) return alert("Cart is empty!");
    let msg = "Hello Uttam Hub! I am interested in these items:%0A%0A";
    cart.forEach((item, i) => {
        msg += `${i+1}. *[${item.brand}]* ${item.name} (Qty: ${item.qty})%0A`;
    });
    msg += "%0APlease let me know the process for these. Thanks!";
    window.open(`https://wa.me/919724362981?text=${msg}`, '_blank');
}

// 8. Variant Support
function addWithVariant(brand, productName, selectId) {
    const selectElement = document.getElementById(selectId);
    if (selectElement) {
        const size = selectElement.value;
        addToCart(brand, `${productName} (${size})`);
    }
}


// for coming soon page
// Automatically handle broken or empty links
document.addEventListener('click', function (e) {
    const link = e.target.closest('a');
    
    if (link) {
        const href = link.getAttribute('href');

        // 1. Check if link is empty, just a "#", or "coming-soon.html"
        if (!href || href === "#" || href === "" || href.includes('coming-soon.html')) {
            e.preventDefault();
            window.location.href = "coming-soon.html";
            return;
        }

        // 2. Optional: Check if the file actually exists (Only works on a live server)
        // If you are just working locally, keep the manually assigned 'coming-soon.html' 
        // for files you haven't created yet.
    }
});

       // for unavalible pages
       document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a');
    
    // Only intercept internal links (ending in .html)
    if (anchor && anchor.getAttribute('href') && anchor.getAttribute('href').endsWith('.html')) {
        const url = anchor.getAttribute('href');
        
        // Prevent the default jump so we can check the link first
        e.preventDefault();

        // Try to "ping" the file
        fetch(url, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // File exists! Go there.
                    window.location.href = url;
                } else {
                    // File not found (404)! Go to coming soon.
                    window.location.href = "coming-soon.html";
                }
            })
            .catch(() => {
                // Network error or file missing! Go to coming soon.
                window.location.href = "coming-soon.html";
            });
    }
}, true);


 